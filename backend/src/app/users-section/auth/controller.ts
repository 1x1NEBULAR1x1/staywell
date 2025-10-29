import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { AuthService } from './services/auth.service';
import { CrudService } from '../users/services';
import { ConfigService } from '@nestjs/config';

import { RequestWithCookies, UserWithoutPassword } from '@shared/src/types/users-section';

import { LoginDto, RegisterDto } from './dto';

import { AuthenticatedRequest, JwtAuthGuard, Auth } from 'src/lib/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import ms, { StringValue } from 'ms';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly crud: CrudService,
    private readonly config: ConfigService,
  ) { }

  @Post('register')
  @ApiOperation({ summary: 'Registration of a new user' })
  async register(
    @Body() registerDto: RegisterDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ip_address = this.getClientIp(req);
    const user_agent = req.get('User-Agent') || 'Unknown';

    const { user, tokens, session } = await this.auth.register(
      registerDto,
      ip_address,
      user_agent,
    );

    this.setTokenCookies(res, tokens);

    return res
      .status(201)
      .json({ user, session, message: 'Registration successful' });
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in to the system' })
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ip_address = this.getClientIp(req);
    const user_agent = req.get('User-Agent') || 'Unknown';

    const { user, tokens, session } = await this.auth.login(
      loginDto,
      ip_address,
      user_agent,
    );

    this.setTokenCookies(res, tokens);

    return res.status(200).json({ user, session, message: 'Login successful' });
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout from the system' })
  async logout(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    const { id: user_id, session_id } = req.user;

    if (user_id) await this.auth.logout(user_id, session_id);

    this.clearTokenCookies(res);

    return res.status(200).json({ message: 'Logout successful' });
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh tokens' })
  async refresh(@Req() req: RequestWithCookies, @Res() res: Response) {
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token)
      return res.status(401).json({ message: 'Refresh token not provided' });

    const { user, tokens, session } = await this.auth.refresh(refresh_token);

    this.setTokenCookies(res, tokens);

    return res.status(200).json({ user, session });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get data of the current user' })
  async me(@Auth() user: UserWithoutPassword) {
    // req.user contains the user object directly from JWT strategy validation
    return user;
  }

  @Get('ws-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get token for WebSocket authentication' })
  async getWsToken(@Req() req: RequestWithCookies) {
    // Extract token from request for WebSocket auth
    const authHeader = req.headers['authorization'] as string;
    let token: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies?.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      throw new BadRequestException('No token available');
    }

    return { token };
  }

  private getClientIp(req: Request): string {
    // Try different ways to get IP address
    const forwarded = req.headers['x-forwarded-for'] as string;
    const real_ip = req.headers['x-real-ip'] as string;
    const client_ip = req.headers['cf-connecting-ip'] as string;

    let ip =
      req.ip ||
      (forwarded ? forwarded.split(',')[0].trim() : null) ||
      real_ip ||
      client_ip ||
      '127.0.0.1';

    // Convert IPv6 localhost to IPv4 for readability
    if (ip === '::1' || ip === '::ffff:127.0.0.1') ip = '127.0.0.1';

    return ip;
  }

  private setTokenCookies(
    res: Response,
    tokens: { access_token: string; refresh_token: string },
  ) {
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      maxAge: ms(
        this.config.get<string>('ACCESS_TOKEN_EXPIRES_IN') as StringValue,
      ), // 15m in milliseconds
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: ms(
        this.config.get<string>('REFRESH_TOKEN_EXPIRES_IN') as StringValue,
      ), // 7d in milliseconds
    });
  }

  private clearTokenCookies(res: Response) {
    res.cookie('access_token', '', { httpOnly: true, maxAge: 0 });
    res.cookie('refresh_token', '', { httpOnly: true, maxAge: 0 });
  }
}
