import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { SessionsService } from '../services/sessions.service';
import { SessionData, UserWithoutPassword } from '@shared/src/types/users-section';

export interface RequestWithCookies extends Request {
  cookies: {
    refresh_token?: string;
    access_token?: string;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly auth: AuthService,
    private readonly sessions: SessionsService,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: (request: Request) => {
        const req = request as RequestWithCookies;
        // Try to get token from cookies first
        if (req?.cookies?.access_token) {
          return req.cookies.access_token;
        }
        // Fallback to Authorization header
        const authHeader = req?.headers?.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          return authHeader.substring(7);
        }
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: config.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: {
    user_id: string;
    session_id: string;
    email: string;
  }): Promise<{
    user: UserWithoutPassword;
    session: SessionData;
    user_id: string;
    session_id: string;
    email: string;
  }> {
    try {
      // 1. Validate user by id from payload
      const user = await this.auth.validateUser(payload.user_id);
      if (!user) throw new UnauthorizedException('User is not found');
      // 2. CRITICAL: Validate session in Redis
      const session = await this.sessions.validate(payload.session_id);
      // If session is not found, inactive or deleted
      if (!session)
        throw new UnauthorizedException(
          'Session is not active or deleted. Please log in again.',
        );

      // 3. Return object with user data and valid session
      return {
        user,
        session,
        user_id: payload.user_id,
        session_id: payload.session_id,
        email: payload.email,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('User is not authorized');
    }
  }
}
