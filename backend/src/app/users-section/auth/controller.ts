import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
} from "@nestjs/common";
import { Response, Request } from "express";
import { ApiOperation, ApiTags, ApiResponse, ApiBody } from "@nestjs/swagger";
import { AuthService } from "./service";
import { LoginDto, RegisterDto } from "./dto";
import { JwtAuthGuard } from "src/lib/common";
import { CrudService } from "../users/services";
import { RequestWithCookies } from "./strategies/jwt.strategy";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly crudService: CrudService,
  ) { }

  @Post("register")
  @ApiOperation({ summary: "Регистрация нового пользователя" })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: "Пользователь успешно зарегистрирован",
  })
  @ApiResponse({ status: 400, description: "Неверные данные" })
  @ApiResponse({
    status: 409,
    description: "Пользователь с таким email уже существует",
  })
  async register(
    @Body() registerDto: RegisterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ip_address = this.getClientIp(req);
    const user_agent = req.get("User-Agent") || "Unknown";

    const { user, tokens, session } = await this.authService.register(
      registerDto,
      ip_address,
      user_agent,
    );

    this.setTokenCookies(res, tokens);

    return res
      .status(201)
      .json({ user, session, message: "Регистрация успешна" });
  }

  @Post("login")
  @ApiOperation({ summary: "Вход в систему" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: "Вход выполнен успешно" })
  @ApiResponse({ status: 401, description: "Неверный email или пароль" })
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ip_address = this.getClientIp(req);
    const user_agent = req.get("User-Agent") || "Unknown";

    const { user, tokens, session } = await this.authService.login(
      loginDto,
      ip_address,
      user_agent,
    );

    this.setTokenCookies(res, tokens);

    return res
      .status(200)
      .json({ user, session, message: "Вход выполнен успешно" });
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Выход из системы" })
  @ApiResponse({ status: 200, description: "Выход выполнен успешно" })
  async logout(
    @Req() req: Request & { user: { user_id: string; session_id: string } },
    @Res() res: Response,
  ) {
    // Получаем данные пользователя из JWT
    const user_id = req.user?.user_id;
    const session_id = req.user?.session_id;

    if (user_id) await this.authService.logout(user_id, session_id);

    this.clearTokenCookies(res);

    return res.status(200).json({ message: "Выход выполнен успешно" });
  }

  @Post("refresh")
  @ApiOperation({ summary: "Обновление токенов" })
  @ApiResponse({ status: 200, description: "Токены успешно обновлены" })
  @ApiResponse({ status: 401, description: "Невалидный refresh токен" })
  async refresh(@Req() req: RequestWithCookies, @Res() res: Response) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken)
      return res
        .status(401)
        .json({ message: "Токен обновления не предоставлен" });

    const { user, tokens, session } =
      await this.authService.refreshTokens(refreshToken);

    this.setTokenCookies(res, tokens);

    return res.status(200).json({ user, session });
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Получение данных текущего пользователя" })
  @ApiResponse({ status: 200, description: "Данные пользователя" })
  @ApiResponse({ status: 401, description: "Неавторизован" })
  async getProfile(@Req() req: Request & { user: { user_id: string } }) {
    return await this.crudService.findOne({ id: req.user.user_id });
  }

  private getClientIp(req: Request): string {
    // Пробуем различные способы получения IP адреса
    const forwarded = req.headers["x-forwarded-for"] as string;
    const realIp = req.headers["x-real-ip"] as string;
    const clientIp = req.headers["cf-connecting-ip"] as string; // Cloudflare

    let ip =
      req.ip ||
      (forwarded ? forwarded.split(",")[0].trim() : null) ||
      realIp ||
      clientIp ||
      "127.0.0.1";

    // Преобразуем IPv6 localhost в IPv4 для читаемости
    if (ip === "::1" || ip === "::ffff:127.0.0.1") ip = "127.0.0.1";

    return ip;
  }

  private setTokenCookies(
    res: Response,
    tokens: { access_token: string; refresh_token: string },
  ) {
    res.cookie("access_token", tokens.access_token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    }); // 15 минут
    res.cookie("refresh_token", tokens.refresh_token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); // 7 дней
  }

  private clearTokenCookies(res: Response) {
    res.cookie("access_token", "", { httpOnly: true, maxAge: 0 });
    res.cookie("refresh_token", "", { httpOnly: true, maxAge: 0 });
  }
}
