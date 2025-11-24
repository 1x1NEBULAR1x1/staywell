import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from 'src/lib/redis';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/lib/prisma';
import { SessionData } from '@shared/src/types/users-section';
import { CreateSessionDto } from '../dto/create-session.dto';
import { BaseListResult } from '@shared/src/common';

@Injectable()
export class SessionsService {
  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Create new session in Redis
   */
  async create(dto: CreateSessionDto): Promise<SessionData> {
    const id = uuidv4();
    const user = await this.prisma.user.findUnique({
      where: { id: dto.user_id },
    });
    if (!user) throw new NotFoundException('User not found');
    const ttl_milliseconds = 7 * 24 * 60 * 60 * 1000;

    const session: SessionData = {
      id,
      user: user,
      user_id: user.id,
      ip_address: dto.ip_address,
      user_agent: dto.user_agent,
      created: new Date().toISOString(),
      expires: new Date(Date.now() + ttl_milliseconds).toISOString(), // 7 days
      is_active: true,
    };

    const session_key = this.getSessionKey(id);
    const user_sessions_key = this.getUserSessionsKey(session.user_id);

    await Promise.all([
      this.redis.setex(session_key, ttl_milliseconds, JSON.stringify(session)),
      this.redis.sadd(user_sessions_key, id),
      this.redis.expire(user_sessions_key, ttl_milliseconds),
    ]);

    return session;
  }

  /**
   * Validate session
   */
  async validate(id: string): Promise<SessionData | null> {
    const session_key = this.getSessionKey(id);
    const data = await this.redis.get(session_key);

    if (!data) return null;

    try {
      const session = JSON.parse(data) as SessionData;
      if (new Date(session.expires) < new Date()) {
        await this.deactivate(id);
        return null;
      }
      if (!session.is_active) return null;

      // Automatically refresh session TTL on each access
      const ttl_milliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days
      await this.redis.expire(session_key, ttl_milliseconds);

      return session;
    } catch (error) {
      console.error('Session data parsing error:', error);
      await this.deactivate(id);
      return null;
    }
  }

  /**
   * Refresh session TTL
   */
  async refresh(
    id: string,
    ttl_milliseconds: number = 7 * 24 * 60 * 60 * 1000,
  ): Promise<boolean> {
    const session_key = this.getSessionKey(id);
    const data = await this.redis.get(session_key);
    if (!data) throw new NotFoundException('Session not found');

    try {
      const session = JSON.parse(data) as SessionData;
      session.expires = new Date(Date.now() + ttl_milliseconds).toISOString();
      await this.redis.setex(
        session_key,
        ttl_milliseconds,
        JSON.stringify(session),
      );
      return true;
    } catch (error) {
      console.error('Session refresh error:', error);
      throw new NotFoundException('Session data corrupted');
    }
  }

  /**
   * Deactivate session
   */
  async deactivate(id: string): Promise<void> {
    const session_key = this.getSessionKey(id);
    const data = await this.redis.get(session_key);

    if (!data) return;

    try {
      const session = JSON.parse(data) as SessionData;
      session.is_active = false;
      const ttl = await this.redis.ttl(session_key);
      if (ttl > 0)
        await this.redis.setex(session_key, ttl, JSON.stringify(session));
    } catch (error) {
      console.error('Session deactivation error:', error);
      // If we can't parse the session data, just delete the key
      await this.redis.del(session_key);
    }
  }

  /**
   * Deactivate all user sessions except current
   */
  async deactivateAll(
    user_id: string,
    current_session_id?: string,
  ): Promise<number> {
    const user_sessions_key = this.getUserSessionsKey(user_id);
    const session_ids = await this.redis.smembers(user_sessions_key);

    return (
      await Promise.all(
        session_ids
          .filter((id) => id !== current_session_id)
          .map((id) => this.deactivate(id)),
      )
    ).length;
  }

  /**
   * Get active user sessions
   */
  async getActive(user_id: string): Promise<BaseListResult<SessionData>> {
    const user_sessions_key = this.getUserSessionsKey(user_id);
    const session_ids = await this.redis.smembers(user_sessions_key);
    const sessions: SessionData[] = [];

    for (const session_id of session_ids) {
      const session = await this.validate(session_id);
      if (session && session.is_active) {
        sessions.push(session);
      } else {
        // Remove invalid sessions from list
        await this.redis.srem(user_sessions_key, session_id);
      }
    }

    return {
      items: sessions,
      total: sessions.length,
      skip: 0,
      take: sessions.length,
    };
  }

  // --------------- Utils ---------------
  /**
   * Get session key
   */
  private getSessionKey(id: string): string {
    return `session:${id}`;
  }

  /**
   * Get user sessions key
   */
  private getUserSessionsKey(user_id: string): string {
    return `user:${user_id}:sessions`;
  }
}
