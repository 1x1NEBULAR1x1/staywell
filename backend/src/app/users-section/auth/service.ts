import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "argon2";
import { PrismaService } from "src/lib/prisma";
import { LoginDto, RegisterDto } from "./dto";
import { CrudService } from "../users/services";
import { RedisSessionService } from "../sessions/service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly crudService: CrudService,
    private readonly redisSessionService: RedisSessionService,
  ) { }

  async register(data: RegisterDto, ip_address: string, user_agent: string) {
    const { email, password } = data;

    // Проверяем, существует ли пользователь с таким email
    if (await this.crudService.findOne({ email }, true))
      throw new ConflictException("Пользователь с таким email уже существует");
    // Хешируем пароль
    const hash = await argon2.hash(password);
    // Создаем нового пользователя
    const user = await this.prisma.user.create({
      data: { ...data, password_hash: hash },
    });
    // Создаем сессию для пользователя в Redis
    const session_result = await this.redisSessionService.create({
      user_id: user.id,
      ip_address,
      user_agent,
    });
    // Создаем токены
    const tokens = this.generateTokens({
      user_id: user.id,
      email: user.email,
      session_id: session_result.id,
    });
    // Возвращаем пользователя без пароля
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...user_without_password } = user;
    return {
      user: user_without_password,
      tokens,
      session: session_result.session,
    };
  }

  async login(loginDto: LoginDto, ip_address: string, user_agent: string) {
    const { email, password } = loginDto;
    // Ищем пользователя по email
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException("Неверный email или пароль");
    // Проверяем пароль
    if (!(await this.comparePasswords(password, user.password_hash)))
      throw new UnauthorizedException("Неверный email или пароль");
    // Создаем сессию для пользователя в Redis
    const session_result = await this.redisSessionService.create({
      user_id: user.id,
      ip_address,
      user_agent,
    });
    // Создаем токены
    const tokens = this.generateTokens({
      user_id: user.id,
      email: user.email,
      session_id: session_result.id,
    });
    // Возвращаем пользователя без пароля
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...user_without_password } = user;
    return {
      user: user_without_password,
      tokens,
      session: session_result.session,
    };
  }

  async refreshTokens(refresh_token: string) {
    try {
      // Верифицируем refresh token
      const payload = this.jwtService.verify<{
        user_id: string;
        session_id: string;
        email: string;
      }>(refresh_token, {
        secret:
          this.configService.get<string>("REFRESH_TOKEN_SECRET") ||
          "refresh-token-secret-key",
      });
      // КРИТИЧЕСКИ ВАЖНО: Проверяем сессию в Redis
      const session_data = await this.redisSessionService.validateSession(
        payload.session_id,
      );

      if (!session_data)
        throw new UnauthorizedException("Сессия неактивна или удалена");

      // Ищем пользователя
      const user = await this.prisma.user.findUnique({
        where: { id: payload.user_id },
      });
      if (!user) throw new UnauthorizedException("Пользователь не найден");
      if (!user.is_active)
        throw new UnauthorizedException("Аккаунт заблокирован");
      // Создаем новые токены
      const tokens = this.generateTokens({
        user_id: user.id,
        email: user.email,
        session_id: payload.session_id,
      });
      // Возвращаем пользователя без пароля
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...user_without_password } = user;
      return {
        user: user_without_password,
        tokens,
        session: session_data,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException("Недействительный токен обновления");
    }
  }

  async logout(user_id: string, session_id?: string) {
    if (session_id) {
      // Деактивируем конкретную сессию в Redis
      await this.redisSessionService.deactivateSession(session_id);
    } else {
      // Деактивируем все сессии пользователя в Redis
      await this.redisSessionService.deactivateAllOtherSessions(user_id);
    }
    return { message: "Выход выполнен успешно" };
  }

  async validateUser(user_id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: user_id } });
    if (!user) throw new UnauthorizedException("Пользователь не найден");
    if (!user.is_active)
      throw new UnauthorizedException("Аккаунт заблокирован");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...user_without_password } = user;
    return user_without_password;
  }

  private generateTokens(payload: {
    user_id: string;
    email: string;
    session_id: string;
  }) {
    const access_token = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>("ACCESS_TOKEN_SECRET") ||
        "access-token-secret-key",
      expiresIn:
        this.configService.get<string>("ACCESS_TOKEN_EXPIRES_IN") || "15m",
    });

    const refresh_token = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>("REFRESH_TOKEN_SECRET") ||
        "refresh-token-secret-key",
      expiresIn:
        this.configService.get<string>("REFRESH_TOKEN_EXPIRES_IN") || "7d",
    });

    return { access_token, refresh_token };
  }

  private async comparePasswords(
    plain_text_password: string,
    hashed_password: string,
  ): Promise<boolean> {
    return await argon2.verify(hashed_password, plain_text_password);
  }
}
