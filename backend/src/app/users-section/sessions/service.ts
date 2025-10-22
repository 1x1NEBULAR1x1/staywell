import { Injectable, NotFoundException } from "@nestjs/common";
import { RedisService } from "src/lib/redis";
import { v4 as uuidv4 } from "uuid";
import { PrismaService } from "src/lib/prisma";
import { SessionData } from "@shared/src/types/users-section";
import { CreateSessionDto } from "./dto";
import { BaseListResult } from "@shared/src/common";

@Injectable()
export class RedisSessionService {
  constructor(
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
  ) { }
  /**
   * Создание новой сессии в Redis
   */
  async create(
    dto: CreateSessionDto,
  ): Promise<SessionData> {
    const id = uuidv4();
    const user = await this.prisma.user.findUnique({
      where: { id: dto.user_id },
    });
    if (!user) throw new NotFoundException("User not found");
    const ttl_seconds = 7 * 24 * 60 * 60;

    const session: SessionData = {
      id,
      user: user,
      user_id: user.id,
      ip_address: dto.ip_address,
      user_agent: dto.user_agent,
      created: new Date().toISOString(),
      expires: new Date(Date.now() + ttl_seconds).toISOString(), // 7 days
      is_active: true,
    };
    await this.redisService.createSession(id, session, ttl_seconds);
    return session;
  }
  /**
   * Валидация сессии
   */
  async validateSession(id: string): Promise<SessionData | null> {
    const session = await this.redisService.getSession(id);
    if (!session || !session.is_active) return null;
    // Автоматически продлеваем сессию при каждом обращении
    await this.refreshSession(id);
    return session;
  }
  /**
   * Обновление TTL сессии
   */
  async refreshSession(
    id: string,
    ttlSeconds: number = 7 * 24 * 60 * 60,
  ): Promise<boolean> {
    return await this.redisService.refreshSession(id, ttlSeconds);
  }
  /**
   * Деактивация сессии
   */
  async deactivateSession(id: string): Promise<void> {
    await this.redisService.deactivateSession(id);
  }
  /**
   * Удаление сессии
   */
  async delete(sessionId: string): Promise<void> {
    await this.redisService.deleteSession(sessionId);
  }
  /**
   * Деактивация всех сессий пользователя кроме текущей
   */
  async deactivateAllOtherSessions(
    user_id: string,
    current_session_id?: string,
  ): Promise<number> {
    return await this.redisService.deactivateAllOtherSessions(
      user_id,
      current_session_id,
    );
  }
  /**
   * Получение активных сессий пользователя
   */
  async getActiveSessions(
    user_id: string,
  ): Promise<BaseListResult<SessionData>> {
    const sessions = await this.redisService.getUserActiveSessions(user_id);
    await this.redisService.cleanupExpiredUserSessions(user_id);
    return {
      items: sessions,
      total: sessions.length,
      skip: 0,
      take: sessions.length,
    };
  }
  /**
   * Получение статистики сессий
   */
  async getSessionStats(): Promise<string> {
    return await this.redisService.getRedisInfo();
  }
  /**
   * Проверка здоровья Redis соединения
   */
  async healthCheck(): Promise<boolean> {
    let redisHealthy = false;
    try {
      const pong = await this.redisService.ping();
      redisHealthy = pong === "PONG";
    } catch (error) {
      console.error("Redis health check failed:", error);
    }
    return redisHealthy;
  }
  /**
   * Подсчет активных сессий пользователя
   */
  async countUserActiveSessions(user_id: string): Promise<number> {
    return (await this.getActiveSessions(user_id)).total;
  }
  /**
   * Получение информации о сессии
   */
  async getSessionInfo(id: string): Promise<SessionData | null> {
    return await this.redisService.getSession(id);
  }
  /**
   * Проверка существования сессии
   */
  async sessionExists(id: string): Promise<boolean> {
    return await this.redisService.sessionExists(id);
  }
  /**
   * Получение времени жизни сессии (TTL)
   */
  async getSessionTTL(id: string): Promise<number> {
    return await this.redisService.getSessionTTL(id);
  }
}
