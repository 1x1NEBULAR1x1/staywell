import { Injectable, NotFoundException } from "@nestjs/common";
import { RedisService } from "src/lib/redis";
import { v4 as uuidv4 } from "uuid";
import { PrismaService } from "src/lib/prisma";
import { SessionData } from "@shared/src/types/users-section";
import { CreateSessionDto } from "./dto";

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
  ): Promise<{ id: string; session: SessionData }> {
    const id = uuidv4();
    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 дней
    const user = await this.prisma.user.findUnique({
      where: { id: dto.user_id },
    });
    if (!user) throw new NotFoundException("User not found");
    const data: SessionData = {
      ...user,
      user_id: dto.user_id,
      ip_address: dto.ip_address,
      user_agent: dto.user_agent,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      is_active: true,
    };
    // Сохраняем в Redis с TTL 7 дней
    const ttlSeconds = 7 * 24 * 60 * 60;
    await this.redisService.createSession(id, data, ttlSeconds);
    return { id, session: data };
  }
  /**
   * Валидация сессии
   */
  async validateSession(id: string): Promise<SessionData | null> {
    const sessionData = await this.redisService.getSession(id);
    if (!sessionData || !sessionData.is_active) return null;
    // Автоматически продлеваем сессию при каждом обращении
    await this.refreshSession(id);
    return sessionData;
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
    userId: string,
  ): Promise<{ sessionId: string; data: SessionData }[]> {
    const sessions = await this.redisService.getUserActiveSessions(userId);
    await this.redisService.cleanupExpiredUserSessions(userId);
    return sessions;
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
    return (await this.getActiveSessions(user_id)).length;
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
