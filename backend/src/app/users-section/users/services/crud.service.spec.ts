import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CrudService } from './crud.service';
import { PrismaService } from 'src/lib/prisma';
import { FilesService } from 'src/lib/files';
import { Role, Prisma } from '@shared/src/database';
import { UpdateUserDto, AdminUpdateUserDto } from '../dto';
import * as argon2 from 'argon2';

jest.mock('argon2');

describe('Users CrudService', () => {
  let service: CrudService;
  let prismaService: any;
  let filesService: jest.Mocked<FilesService>;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    role: Role.USER,
    phone_number: '+1234567890',
    image: null,
    password_hash: 'hashed-password',
    date_of_birth: null,
    is_active: true,
    email_verified: false,
    phone_verified: false,
    email_notifications: true,
    created: new Date(),
    updated: new Date(),
  } as any;

  const mockAdminUser = {
    ...mockUser,
    id: 'admin-1',
    email: 'admin@example.com',
    role: Role.ADMIN,
  };

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    } as any;

    const mockFilesService = {
      saveImage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrudService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
      ],
    }).compile();

    service = module.get<CrudService>(CrudService);
    prismaService = module.get(PrismaService);
    filesService = module.get(FilesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne({ id: 'user-1' });

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: expect.any(Object),
      });
    });

    it('should find a user by email', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne({ email: 'test@example.com' });

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: expect.any(Object),
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne({ id: 'user-1' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should not throw error when check_only is true and user not found', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findOne({ id: 'user-1' }, true);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateDto: UpdateUserDto = {
      first_name: 'Updated User',
      last_name: 'Updated User',
      phone_number: '+9876543210',
    };

    it('should update user successfully', async () => {
      const updatedUser = { ...mockUser, ...updateDto };

      prismaService.user.findUnique
        .mockResolvedValueOnce(mockUser) // for findOne check
        .mockResolvedValueOnce(null); // for email uniqueness check
      prismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update({
        auth: mockUser,
        data: updateDto,
        where: { id: 'user-1' },
      });

      expect(result).toEqual(updatedUser);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: expect.objectContaining({
          first_name: 'Updated User',
          last_name: 'Updated User',
          phone_number: '+9876543210',
        }),
        select: expect.any(Object),
      });
    });

    it('should allow admin to update any user', async () => {
      const adminUpdateDto: AdminUpdateUserDto = {
        first_name: 'Updated by Admin',
        last_name: 'Updated by Admin',
        role: Role.ADMIN,
      };

      const updatedUser = { ...mockUser, ...adminUpdateDto };

      prismaService.user.findUnique
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);
      prismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update({
        auth: mockAdminUser,
        data: adminUpdateDto,
        where: { id: 'user-1' },
      });

      expect(result).toEqual(updatedUser);
    });

    it('should throw ForbiddenException when non-admin tries to update another user', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.update({
          auth: mockUser,
          data: updateDto,
          where: { id: 'different-user-id' },
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException when no where parameters provided', async () => {
      await expect(
        service.update({
          auth: mockUser,
          data: updateDto,
          where: {} as Prisma.UserWhereUniqueInput,
        }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.update({
          auth: mockUser,
          data: updateDto,
          where: {} as Prisma.UserWhereUniqueInput,
        }),
      ).rejects.toThrow('No parameters provided for user search for update');
    });

    it('should throw NotFoundException when user to update does not exist', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.update({
          auth: mockUser,
          data: updateDto,
          where: { id: 'user-1' },
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should allow email update if it belongs to the same user', async () => {
      const updateDtoWithEmail: AdminUpdateUserDto = {
        email: 'newemail@example.com',
      };

      const updatedUser = { ...mockUser, email: 'newemail@example.com' };

      prismaService.user.findUnique
        .mockResolvedValueOnce(mockUser) // for findOne check
        .mockResolvedValueOnce(mockUser); // for email uniqueness check (same user)
      prismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update({
        auth: mockUser,
        data: updateDtoWithEmail,
        where: { id: 'user-1' },
      });

      expect(result.email).toBe('newemail@example.com');
    });

    it('should hash password when provided', async () => {
      const updateDtoWithPassword: UpdateUserDto = {
        hashed_password: 'new-password',
      } as any;

      const hashedPassword = 'hashed-new-password';
      (argon2.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const updatedUser = { ...mockUser };

      prismaService.user.findUnique
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);
      prismaService.user.update.mockResolvedValue(updatedUser);

      await service.update({
        auth: mockUser,
        data: updateDtoWithPassword,
        where: { id: 'user-1' },
      });

      expect(argon2.hash).toHaveBeenCalledWith('new-password');
    });

    it('should save image when file is provided', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
      } as Express.Multer.File;

      filesService.saveImage.mockReturnValue('/uploads/users/test.jpg');

      const updatedUser = { ...mockUser, image: '/uploads/users/test.jpg' };

      prismaService.user.findUnique
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);
      prismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update({
        auth: mockUser,
        data: updateDto,
        where: { id: 'user-1' },
        file: mockFile,
      });

      expect(filesService.saveImage).toHaveBeenCalledWith({
        file: mockFile,
        dir_name: 'USERS',
      });
      expect(result.image).toBe('/uploads/users/test.jpg');
    });

    it('should convert date_of_birth to Date object', async () => {
      const updateDtoWithDate: UpdateUserDto = {
        date_of_birth: '1990-01-01' as any,
      };

      const updatedUser = {
        ...mockUser,
        date_of_birth: new Date('1990-01-01'),
      };

      prismaService.user.findUnique
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);
      prismaService.user.update.mockResolvedValue(updatedUser);

      await service.update({
        auth: mockUser,
        data: updateDtoWithDate,
        where: { id: 'user-1' },
      });

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: expect.objectContaining({
          date_of_birth: expect.any(Date),
        }),
        select: expect.any(Object),
      });
    });
  });
});
