import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Req,
  Patch,
  ForbiddenException,
  Query,
  ParseUUIDPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { RedisSessionService } from "./service";
import { JwtAuthGuard, AdminOnly, Auth } from "src/lib/common";
import { AuthenticatedRequest, SessionData } from "@shared/src/types/users-section";
import { Role, User } from "@shared/src/database";
import { BaseListResult } from "@shared/src/common";

@ApiTags("Sessions")
@Controller("sessions")
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly redisSessionService: RedisSessionService) { }

  @Get()
  @ApiOperation({
    summary: "Получить активные сессии",
    description: "Возвращает список всех активных сессий пользователя",
  })
  @ApiResponse({ status: 200, description: "Список активных сессий" })
  async getActiveSessions(
    @Auth() user: User,
    @Query("user_id", ParseUUIDPipe) user_id?: string,
  ): Promise<BaseListResult<SessionData>> {
    // Если пользователь не админ, он может видеть только свои сессии
    if (user_id && user.role !== Role.ADMIN)
      throw new ForbiddenException(
        "Недостаточно прав для просмотра сессий других пользователей",
      );
    // Если user_id не указан или пользователь не админ, возвращаем сессии текущего пользователя
    const target_user_id =
      user_id && user.role === Role.ADMIN ? user_id : user.id;
    return this.redisSessionService.getActiveSessions(target_user_id);
  }

  @Get("stats")
  @ApiOperation({
    summary: "Получить статистику сессий",
    description: "Возвращает статистику по сессиям",
  })
  @ApiResponse({ status: 200, description: "Статистика сессий" })
  async getSessionStats(@Auth() user: User): Promise<any> {
    // Только админы могут видеть общую статистику
    if (user.role !== Role.ADMIN)
      throw new ForbiddenException(
        "Недостаточно прав для просмотра статистики",
      );
    return this.redisSessionService.getSessionStats();
  }

  @AdminOnly()
  @Get("health")
  @ApiOperation({
    summary: "Проверить состояние сессий",
    description: "Проверяет состояние системы сессий",
  })
  @ApiResponse({ status: 200, description: "Статус состояния" })
  async healthCheck(@Auth() user: User): Promise<boolean> {
    // Только админы могут проверять здоровье системы
    if (user.role !== Role.ADMIN)
      throw new ForbiddenException(
        "Недостаточно прав для проверки состояния системы",
      );
    return this.redisSessionService.healthCheck();
  }

  @AdminOnly()
  @Patch(":id/refresh")
  @ApiOperation({
    summary: "Обновить время жизни сессии",
    description: "Продлевает время жизни указанной сессии",
  })
  @ApiResponse({ status: 200, description: "Сессия успешно обновлена" })
  async refreshSession(
    @Param("id", ParseUUIDPipe) id: string,
    @Auth() user: User,
  ): Promise<{ success: boolean; ttl?: number }> {
    // Проверяем что сессия принадлежит текущему пользователю
    const session = await this.redisSessionService.getSessionInfo(id);
    if (!session || session.user_id !== user.id)
      throw new ForbiddenException("Нет доступа к этой сессии");
    const success = await this.redisSessionService.refreshSession(id);
    if (success) {
      const ttl = await this.redisSessionService.getSessionTTL(id);
      return { success: true, ttl };
    }
    return { success: false };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @ApiOperation({
    summary: "Удалить сессию",
    description: "Удаляет указанную сессию",
  })
  @ApiResponse({ status: 200, description: "Сессия успешно удалена" })
  async deleteSession(
    @Param("id", ParseUUIDPipe) id: string,
    @Auth() user: User,
  ): Promise<{ message: string }> {
    // Проверяем что сессия принадлежит текущему пользователю
    const session = await this.redisSessionService.getSessionInfo(id);
    if (!session || session.user_id !== user.id)
      throw new ForbiddenException("Нет доступа к этой сессии");
    await this.redisSessionService.delete(id);
    return { message: "Сессия успешно удалена" };
  }

  @Delete("user/all-other")
  @ApiOperation({
    summary: "Удалить все другие сессии",
    description: "Деактивирует все сессии пользователя кроме текущей",
  })
  @ApiResponse({ status: 200, description: "Сессии успешно деактивированы" })
  async deactivateAllOtherSessions(
    @Req() req: AuthenticatedRequest,
  ): Promise<{ deactivatedCount: number }> {
    return {
      deactivatedCount:
        await this.redisSessionService.deactivateAllOtherSessions(
          req.user.id,
          req.user.session_id,
        ),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("count")
  @ApiOperation({
    summary: "Получить количество активных сессий пользователя",
    description: "Возвращает количество активных сессий текущего пользователя",
  })
  @ApiResponse({ status: 200, description: "Количество активных сессий" })
  async getUserSessionCount(
    @Req() req: AuthenticatedRequest,
  ): Promise<{ count: number }> {
    return {
      count: await this.redisSessionService.countUserActiveSessions(
        req.user.id,
      ),
    };
  }
}
