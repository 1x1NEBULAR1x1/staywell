import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../service";
import { Request } from "express";
import { RedisSessionService } from "../../sessions/service";
import { ConfigService } from "@nestjs/config";

export interface RequestWithCookies extends Request {
  cookies: {
    refresh_token?: string;
    access_token?: string;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: RedisSessionService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: RequestWithCookies) => {
          // Извлекаем токен из cookie
          const token: string | undefined = request?.cookies?.access_token;
          return token || null;
        },
        // Также поддерживаем извлечение из заголовка Authorization
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>("ACCESS_TOKEN_SECRET") ||
        "access-token-secret-key",
    });
  }

  async validate(payload: {
    user_id: string;
    session_id: string;
    email: string;
  }) {
    try {
      // 1. Валидируем пользователя по id из payload
      const user = await this.authService.validateUser(payload.user_id);

      // 2. КРИТИЧЕСКИ ВАЖНО: Проверяем сессию в Redis
      const sessionData = await this.sessionService.validateSession(
        payload.session_id,
      );

      // Если сессия не найдена, неактивна или удалена
      if (!sessionData)
        throw new UnauthorizedException(
          "Сессия неактивна или удалена. Пожалуйста, войдите заново.",
        );

      // 3. Возвращаем объект с данными пользователя и валидной сессии
      return {
        ...user,
        user_id: payload.user_id,
        session_id: payload.session_id,
        email: payload.email,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException("Пользователь не авторизован");
    }
  }
}
