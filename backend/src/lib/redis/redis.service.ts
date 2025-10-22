import { Injectable, Inject, OnModuleDestroy, NotFoundException } from "@nestjs/common";
import { SessionData } from "@shared/src/types/users-section";
import { Redis } from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject("REDIS_CONNECTION") private readonly redis: Redis) { }

  async onModuleDestroy() {
    await this.redis.quit();
  }
  /**
   * Создание сессии в Redis
   */
  async createSession(
    id: string,
    session: SessionData,
    ttl_seconds: number = 7 * 24 * 60 * 60, // 7 дней по умолчанию
  ): Promise<void> {
    const key = this.getSessionKey(id);
    const user_sessions_key = this.getUserSessionsKey(session.user_id);
    await Promise.all([
      this.redis.setex(key, ttl_seconds, JSON.stringify(session)),
      this.redis.sadd(user_sessions_key, id),
      this.redis.expire(user_sessions_key, ttl_seconds),
    ]);
  }
  /**
   * Получение сессии из Redis
   */
  async getSession(id: string): Promise<SessionData | null> {
    const key = this.getSessionKey(id);
    const data = await this.redis.get(key);
    if (!data) throw new NotFoundException("Session not found");
    try {
      const session = JSON.parse(data) as SessionData;
      if (new Date(session.expires) < new Date()) {
        await this.deleteSession(id);
        return null;
      }
      return session;
    } catch (error) {
      console.error("Ошибка парсинга данных сессии:", error);
      await this.deleteSession(id);
      return null;
    }
  }
  /**
   * Обновление TTL сессии
   */
  async refreshSession(
    id: string,
    ttl_seconds: number = 7 * 24 * 60 * 60,
  ): Promise<boolean> {
    const key = this.getSessionKey(id);
    const exists = await this.redis.exists(key);
    if (!exists) throw new NotFoundException("Session not found");
    await this.redis.expire(key, ttl_seconds);

    const session = await this.getSession(id);
    if (!session) throw new NotFoundException("Session not found");

    session.expires = new Date(Date.now() + ttl_seconds).toISOString();
    await this.redis.setex(key, ttl_seconds, JSON.stringify(session));
    return true;
  }
  /**
   * Удаление сессии
   */
  async deleteSession(id: string): Promise<void> {
    const session = await this.getSession(id);
    if (!session) throw new NotFoundException("Session not found");
    const key = this.getSessionKey(id);
    await Promise.all([
      this.redis.del(key),
      this.redis.srem(this.getUserSessionsKey(session.user_id), id),
    ]);
  }
  /**
   * Деактивация сессии (помечаем как неактивную, но не удаляем)
   */
  async deactivateSession(id: string): Promise<void> {
    const session = await this.getSession(id);
    if (!session) return;
    session.is_active = false;
    const key = this.getSessionKey(id);
    const ttl = await this.redis.ttl(key);
    if (ttl > 0) await this.redis.setex(key, ttl, JSON.stringify(session));
  }
  /**
   * Получение всех активных сессий пользователя
   */
  async getUserActiveSessions(
    user_id: string,
  ): Promise<SessionData[]> {
    const user_sessions_key = this.getUserSessionsKey(user_id);
    const session_ids = await this.redis.smembers(user_sessions_key);
    const sessions: SessionData[] = [];
    for (const session_id of session_ids) {
      const session = await this.getSession(session_id);
      if (session && session.is_active) {
        sessions.push(session);
      } else {
        // Удаляем недействительные сессии из списка
        await this.redis.srem(user_sessions_key, session_id);
      }
    }
    return sessions;
  }
  /**
   * Деактивация всех сессий пользователя кроме текущей
   */
  async deactivateAllOtherSessions(
    user_id: string,
    current_session_id?: string,
  ): Promise<number> {
    const user_sessions_key = this.getUserSessionsKey(user_id);
    const session_ids = await this.redis.smembers(user_sessions_key);

    let deactivated_count = 0;
    for (const session_id of session_ids) {
      if (session_id !== current_session_id) {
        await this.deactivateSession(session_id);
        deactivated_count++;
      }
    }
    return deactivated_count;
  }
  /**
   * Очистка истекших сессий пользователя
   */
  async cleanupExpiredUserSessions(user_id: string): Promise<number> {
    const user_sessions_key = this.getUserSessionsKey(user_id);
    const session_ids = await this.redis.smembers(user_sessions_key);
    let cleaned_count = 0;
    for (const session_id of session_ids) {
      const session = await this.getSession(session_id);
      if (!session) {
        await this.redis.srem(user_sessions_key, session_id);
        cleaned_count++;
      }
    }
    return cleaned_count;
  }
  /**
   * Проверка существования сессии
   */
  async sessionExists(id: string): Promise<boolean> {
    const key = this.getSessionKey(id);
    return (await this.redis.exists(key)) === 1;
  }
  /**
   * Получение TTL сессии
   */
  async getSessionTTL(id: string): Promise<number> {
    const key = this.getSessionKey(id);
    return await this.redis.ttl(key);
  }
  /**
   * Получение ключа для сессии
   */
  private getSessionKey(id: string): string {
    return `session:${id}`;
  }
  /**
   * Получение ключа для списка сессий пользователя
   */
  private getUserSessionsKey(user_id: string): string {
    return `user:${user_id}:sessions`;
  }
  /**
   * Получение статистики Redis
   */
  async getRedisInfo(): Promise<string> {
    return await this.redis.info();
  }
  /**
   * Проверка подключения к Redis
   */
  async ping(): Promise<string> {
    return await this.redis.ping();
  }
}
