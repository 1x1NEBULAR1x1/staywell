import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/lib/prisma';
import { CrudService } from '../../users/services';
import { SessionsService } from './sessions.service';
import { LoginDto, RegisterDto, ChangePasswordDto } from '../dto';
import * as argon2 from 'argon2';

jest.mock('argon2');
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: any;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let crudService: jest.Mocked<CrudService>;
  let sessionsService: jest.Mocked<SessionsService>;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    password_hash: 'hashed-password',
    first_name: 'Test',
    last_name: 'User',
    role: 'USER',
    phone_number: '+1234567890',
    image: null,
    date_of_birth: null,
    is_active: true,
    email_verified: false,
    phone_verified: false,
    email_notifications: true,
    created: new Date(),
    updated: new Date(),
  } as any;

  const mockSession = {
    id: 'session-1',
    user_id: 'user-1',
    ip_address: '127.0.0.1',
    user_agent: 'test-agent',
    is_active: true,
  };

  const mockTokens = {
    access_token: 'access-token',
    refresh_token: 'refresh-token',
  };

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn().mockReturnValue({
          then: jest.fn(),
        }),
        create: jest.fn().mockReturnValue({
          then: jest.fn(),
        }),
        update: jest.fn().mockReturnValue({
          then: jest.fn(),
        }),
      },
    } as any;

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const mockCrudService = {
      findOne: jest.fn(),
    };

    const mockSessionsService = {
      create: jest.fn(),
      validate: jest.fn(),
      deactivate: jest.fn(),
      deactivateAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: CrudService,
          useValue: mockCrudService,
        },
        {
          provide: SessionsService,
          useValue: mockSessionsService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    crudService = module.get(CrudService);
    sessionsService = module.get(SessionsService);

    // Setup default config mocks
    configService.get.mockImplementation((key: string) => {
      const config: Record<string, string> = {
        ACCESS_TOKEN_SECRET: 'access-secret',
        REFRESH_TOKEN_SECRET: 'refresh-secret',
        ACCESS_TOKEN_EXPIRES_IN: '15m',
        REFRESH_TOKEN_EXPIRES_IN: '7d',
      };
      return config[key];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      first_name: 'Test',
      last_name: 'User',
      phone_number: '+1234567890',
    };

    it('should register a new user successfully', async () => {
      crudService.findOne.mockResolvedValue(null);
      (argon2.hash as jest.Mock).mockResolvedValue('hashed-password');
      (prismaService.user.create as jest.Mock).mockResolvedValue(mockUser);
      sessionsService.create.mockResolvedValue(mockSession as any);
      jwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await service.register(
        registerDto,
        '127.0.0.1',
        'test-agent',
      );

      expect(result).toEqual({
        user: expect.not.objectContaining({ password_hash: expect.anything() }),
        tokens: mockTokens,
        session: mockSession,
      });

      expect(crudService.findOne).toHaveBeenCalledWith(
        { email: registerDto.email },
        true,
      );
      expect(argon2.hash).toHaveBeenCalledWith(registerDto.password);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          password_hash: 'hashed-password',
          first_name: registerDto.first_name,
          last_name: registerDto.last_name,
          phone_number: registerDto.phone_number,
        },
      });
      expect(sessionsService.create).toHaveBeenCalledWith({
        user_id: mockUser.id,
        ip_address: '127.0.0.1',
        user_agent: 'test-agent',
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      crudService.findOne.mockResolvedValue(mockUser);

      await expect(
        service.register(registerDto, '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.register(registerDto, '127.0.0.1', 'test-agent'),
      ).rejects.toThrow('User with this email already exists');
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      sessionsService.create.mockResolvedValue(mockSession as any);
      jwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await service.login(loginDto, '127.0.0.1', 'test-agent');

      expect(result).toEqual({
        user: expect.not.objectContaining({ password_hash: expect.anything() }),
        tokens: mockTokens,
        session: mockSession,
      });

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login(loginDto, '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.login(loginDto, '127.0.0.1', 'test-agent'),
      ).rejects.toThrow('Invalid email or password');
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login(loginDto, '127.0.0.1', 'test-agent'),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.login(loginDto, '127.0.0.1', 'test-agent'),
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('refresh', () => {
    const refreshToken = 'valid-refresh-token';
    const payload = {
      user_id: 'user-1',
      email: 'test@example.com',
      session_id: 'session-1',
    };

    it('should refresh tokens successfully', async () => {
      jwtService.verify.mockReturnValue(payload as any);
      sessionsService.validate.mockResolvedValue(mockSession as any);
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      jwtService.sign
        .mockReturnValueOnce('new-access-token')
        .mockReturnValueOnce('new-refresh-token');

      const result = await service.refresh(refreshToken);

      expect(result).toEqual({
        user: expect.not.objectContaining({ password_hash: expect.anything() }),
        tokens: {
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
        },
        session: mockSession,
      });

      expect(jwtService.verify).toHaveBeenCalledWith(
        refreshToken,
        expect.objectContaining({ secret: 'refresh-secret' }),
      );
      expect(sessionsService.validate).toHaveBeenCalledWith('session-1');
    });

    it('should throw UnauthorizedException if session is not active', async () => {
      jwtService.verify.mockReturnValue(payload as any);
      sessionsService.validate.mockResolvedValue(null);

      await expect(service.refresh(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refresh(refreshToken)).rejects.toThrow(
        'Session is not active or deleted',
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jwtService.verify.mockReturnValue(payload as any);
      sessionsService.validate.mockResolvedValue(mockSession as any);
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.refresh(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refresh(refreshToken)).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw UnauthorizedException if account is blocked', async () => {
      jwtService.verify.mockReturnValue(payload as any);
      sessionsService.validate.mockResolvedValue(mockSession as any);
      prismaService.user.findUnique.mockResolvedValue({
        ...mockUser,
        is_active: false,
      });

      await expect(service.refresh(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refresh(refreshToken)).rejects.toThrow(
        'Account blocked',
      );
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refresh(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refresh(refreshToken)).rejects.toThrow(
        'Invalid refresh token',
      );
    });
  });

  describe('logout', () => {
    it('should deactivate specific session', async () => {
      sessionsService.deactivate.mockResolvedValue(undefined);

      const result = await service.logout('user-1', 'session-1');

      expect(result).toEqual({ message: 'Session deactivated successfully' });
      expect(sessionsService.deactivate).toHaveBeenCalledWith('session-1');
    });

    it('should deactivate all user sessions', async () => {
      (sessionsService.deactivateAll as jest.Mock).mockResolvedValue(1);

      const result = await service.logout('user-1');

      expect(result).toEqual({
        message: 'All sessions deactivated successfully',
      });
      expect(sessionsService.deactivateAll).toHaveBeenCalledWith('user-1');
    });
  });

  describe('validateUser', () => {
    it('should validate and return user without password', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.validateUser('user-1');

      expect(result).not.toHaveProperty('password_hash');
      expect(result.id).toBe('user-1');
      expect(result.email).toBe('test@example.com');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.validateUser('user-1')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateUser('user-1')).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw UnauthorizedException if account is blocked', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue({
        ...mockUser,
        is_active: false,
      });

      await expect(service.validateUser('user-1')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateUser('user-1')).rejects.toThrow(
        'Account blocked',
      );
    });
  });

  describe('changePassword', () => {
    const changePasswordDto: ChangePasswordDto = {
      current_password: 'oldPassword123',
      new_password: 'newPassword123',
    };

    it('should change password successfully', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      (argon2.hash as jest.Mock).mockResolvedValue('new-hashed-password');
      (prismaService.user.update as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.changePassword('user-1', changePasswordDto);

      expect(result).toEqual({ message: 'Password changed successfully' });
      expect(argon2.verify).toHaveBeenCalledWith(
        mockUser.password_hash,
        changePasswordDto.current_password,
      );
      expect(argon2.hash).toHaveBeenCalledWith(changePasswordDto.new_password);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { password_hash: 'new-hashed-password' },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.changePassword('user-1', changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.changePassword('user-1', changePasswordDto),
      ).rejects.toThrow('User not found');
    });

    it('should throw UnauthorizedException if current password is incorrect', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword('user-1', changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.changePassword('user-1', changePasswordDto),
      ).rejects.toThrow('Current password is incorrect');
    });
  });
});
