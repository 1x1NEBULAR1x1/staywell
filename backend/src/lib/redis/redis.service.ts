import { Injectable, Inject, OnModuleDestroy } from "@nestjs/common";
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
    sessionId: string,
    sessionData: SessionData,
    ttlSeconds: number = 7 * 24 * 60 * 60, // 7 дней по умолчанию
  ): Promise<void> {
    const key = this.getSessionKey(sessionId);
    const userSessionsKey = this.getUserSessionsKey(sessionData.user_id);
    await Promise.all([
      this.redis.setex(key, ttlSeconds, JSON.stringify(sessionData)),
      this.redis.sadd(userSessionsKey, sessionId),
      this.redis.expire(userSessionsKey, ttlSeconds),
    ]);
  }
  /**
   * Получение сессии из Redis
   */
  async getSession(sessionId: string): Promise<SessionData | null> {
    const key = this.getSessionKey(sessionId);
    const data = await this.redis.get(key);
    if (!data) return null;
    try {
      const sessionData = JSON.parse(data) as SessionData;
      if (new Date(sessionData.expires_at) < new Date()) {
        await this.deleteSession(sessionId);
        return null;
      }
      return sessionData;
    } catch (error) {
      console.error("Ошибка парсинга данных сессии:", error);
      await this.deleteSession(sessionId);
      return null;
    }
  }
  /**
   * Обновление TTL сессии
   */
  async refreshSession(
    sessionId: string,
    ttlSeconds: number = 7 * 24 * 60 * 60,
  ): Promise<boolean> {
    const key = this.getSessionKey(sessionId);
    const exists = await this.redis.exists(key);
    if (!exists) return false;
    await this.redis.expire(key, ttlSeconds);
    const sessionData = await this.getSession(sessionId);
    if (sessionData) {
      const newExpiresAt = new Date();
      newExpiresAt.setSeconds(newExpiresAt.getSeconds() + ttlSeconds);
      sessionData.expires_at = newExpiresAt.toISOString();
      await this.redis.setex(key, ttlSeconds, JSON.stringify(sessionData));
    }
    return true;
  }
  /**
   * Удаление сессии
   */
  async deleteSession(sessionId: string): Promise<void> {
    const sessionData = await this.getSession(sessionId);
    const key = this.getSessionKey(sessionId);
    await this.redis.del(key);

    // Удаляем из списка активных сессий пользователя
    if (sessionData) {
      const userSessionsKey = this.getUserSessionsKey(sessionData.user_id);
      await this.redis.srem(userSessionsKey, sessionId);
    }
  }
  /**
   * Деактивация сессии (помечаем как неактивную, но не удаляем)
   */
  async deactivateSession(sessionId: string): Promise<void> {
    const sessionData = await this.getSession(sessionId);
    if (!sessionData) return;
    sessionData.is_active = false;
    const key = this.getSessionKey(sessionId);
    const ttl = await this.redis.ttl(key);
    if (ttl > 0) await this.redis.setex(key, ttl, JSON.stringify(sessionData));
  }
  /**
   * Получение всех активных сессий пользователя
   */
  async getUserActiveSessions(
    userId: string,
  ): Promise<{ sessionId: string; data: SessionData }[]> {
    const userSessionsKey = this.getUserSessionsKey(userId);
    const sessionIds = await this.redis.smembers(userSessionsKey);
    const sessions: { sessionId: string; data: SessionData }[] = [];
    for (const sessionId of sessionIds) {
      const sessionData = await this.getSession(sessionId);
      if (sessionData && sessionData.is_active) {
        sessions.push({ sessionId, data: sessionData });
      } else {
        // Удаляем недействительные сессии из списка
        await this.redis.srem(userSessionsKey, sessionId);
      }
    }
    return sessions;
  }
  /**
   * Деактивация всех сессий пользователя кроме текущей
   */
  async deactivateAllOtherSessions(
    userId: string,
    currentSessionId?: string,
  ): Promise<number> {
    const userSessionsKey = this.getUserSessionsKey(userId);
    const sessionIds = await this.redis.smembers(userSessionsKey);
    let deactivatedCount = 0;
    for (const sessionId of sessionIds) {
      if (sessionId !== currentSessionId) {
        await this.deactivateSession(sessionId);
        deactivatedCount++;
      }
    }
    return deactivatedCount;
  }
  /**
   * Очистка истекших сессий пользователя
   */
  async cleanupExpiredUserSessions(userId: string): Promise<number> {
    const userSessionsKey = this.getUserSessionsKey(userId);
    const sessionIds = await this.redis.smembers(userSessionsKey);
    let cleanedCount = 0;
    for (const sessionId of sessionIds) {
      const sessionData = await this.getSession(sessionId);
      if (!sessionData) {
        await this.redis.srem(userSessionsKey, sessionId);
        cleanedCount++;
      }
    }
    return cleanedCount;
  }
  /**
   * Проверка существования сессии
   */
  async sessionExists(sessionId: string): Promise<boolean> {
    const key = this.getSessionKey(sessionId);
    return (await this.redis.exists(key)) === 1;
  }
  /**
   * Получение TTL сессии
   */
  async getSessionTTL(sessionId: string): Promise<number> {
    const key = this.getSessionKey(sessionId);
    return await this.redis.ttl(key);
  }
  /**
   * Получение ключа для сессии
   */
  private getSessionKey(sessionId: string): string {
    return `session:${sessionId}`;
  }
  /**
   * Получение ключа для списка сессий пользователя
   */
  private getUserSessionsKey(userId: string): string {
    return `user:${userId}:sessions`;
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
