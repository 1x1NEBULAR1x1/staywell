import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/lib/prisma';
import { LoginDto, RegisterDto } from '../dto';
import { CrudService } from '../../users/services';
import { SessionsService } from '.';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly crud: CrudService,
    private readonly sessions: SessionsService,
  ) { }

  async register(data: RegisterDto, ip_address: string, user_agent: string) {
    const { email, password } = data;
    // Check if user with this email exists
    if (await this.crud.findOne({ email }, true))
      throw new ConflictException('User with this email already exists');
    // Hash password
    const hash = await argon2.hash(password);
    // Create new user
    const user = await this.prisma.user.create({
      data: { ...data, password_hash: hash },
    });
    // Create session for user in Redis
    const session_result = await this.sessions.create({
      user_id: user.id,
      ip_address,
      user_agent,
    });
    // Create tokens
    const tokens = this.generateTokens({
      user_id: user.id,
      email: user.email,
      session_id: session_result.id,
    });
    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...user_without_password } = user;
    return {
      user: user_without_password,
      tokens,
      session: session_result,
    };
  }

  async login(loginDto: LoginDto, ip_address: string, user_agent: string) {
    const { email, password } = loginDto;
    // Find user by email
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');
    // Check password
    if (!(await this.comparePasswords(password, user.password_hash)))
      throw new UnauthorizedException('Invalid email or password');
    // Create session for user in Redis
    const session_result = await this.sessions.create({
      user_id: user.id,
      ip_address,
      user_agent,
    });
    // Create tokens
    const tokens = this.generateTokens({
      user_id: user.id,
      email: user.email,
      session_id: session_result.id,
    });
    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...user_without_password } = user;
    return {
      user: user_without_password,
      tokens,
      session: session_result,
    };
  }

  async refresh(refresh_token: string) {
    try {
      // Verify refresh token
      const payload = this.jwt.verify<{
        user_id: string;
        session_id: string;
        email: string;
      }>(refresh_token, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      });
      // CRITICAL: Validate session in Redis
      const session_data = await this.sessions.validate(payload.session_id);

      if (!session_data)
        throw new UnauthorizedException('Session is not active or deleted');

      // Find user by id
      const user = await this.prisma.user.findUnique({
        where: { id: payload.user_id },
      });
      if (!user) throw new UnauthorizedException('User not found');
      if (!user.is_active) throw new UnauthorizedException('Account blocked');
      // generate
      const tokens = this.generateTokens({
        user_id: user.id,
        email: user.email,
        session_id: payload.session_id,
      });
      // Return user without password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...user_without_password } = user;
      return {
        user: user_without_password,
        tokens,
        session: session_data,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(user_id: string, session_id?: string) {
    if (session_id) {
      // Deactivate specific session in Redis
      await this.sessions.deactivate(session_id);
      return { message: 'Session deactivated successfully' };
    } else {
      // Deactivate all user sessions in Redis
      await this.sessions.deactivateAll(user_id);
      return { message: 'All sessions deactivated successfully' };
    }
  }

  // --------------- Utils ---------------
  async validateUser(user_id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: user_id } });
    if (!user) throw new UnauthorizedException('User not found');
    if (!user.is_active) throw new UnauthorizedException('Account blocked');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...user_without_password } = user;
    return user_without_password;
  }

  private generateTokens(payload: {
    user_id: string;
    email: string;
    session_id: string;
  }) {
    const access_token = this.jwt.sign(payload, {
      secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.config.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
    });

    const refresh_token = this.jwt.sign(payload, {
      secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.config.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
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
