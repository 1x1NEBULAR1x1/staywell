import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma';
import { UserWithoutPassword } from '@shared/src';
import { Handshake } from 'socket.io/dist/socket-types';

@Injectable()
export class WebsocketAuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Validate JWT token for WebSocket connection
   */
  async validateToken(token: string): Promise<UserWithoutPassword | null> {
    try {
      const payload = this.jwt.verify<{
        user_id: string;
        session_id: string;
        email: string;
      }>(token, {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.user_id },
      });
      if (!user || !user.is_active) return null;
      const { password_hash, ...user_without_password } = user;
      return user_without_password;
    } catch (error) {
      return null;
    }
  }

  /**
   * Extract token from handshake data
   */
  extractTokenFromHandshake(handshake: Handshake): string | null {
    // Check token in authorization headers
    const auth_header = handshake.headers?.authorization;
    if (
      auth_header &&
      typeof auth_header === 'string' &&
      auth_header.startsWith('Bearer ')
    ) {
      return auth_header.substring(7);
    }

    // Check token in cookies (for WebSocket connections)
    const cookie_header = handshake.headers?.cookie;
    if (cookie_header && typeof cookie_header === 'string') {
      const cookies = cookie_header.split(';').reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      );

      if (cookies.access_token) {
        return cookies.access_token;
      }
    }

    // Check token in query parameters
    const query_token = handshake.query?.token;
    const auth_token = handshake.auth?.token;
    const token =
      (typeof query_token === 'string' && query_token) ||
      (typeof auth_token === 'string' && auth_token) ||
      null;

    return token;
  }
}
