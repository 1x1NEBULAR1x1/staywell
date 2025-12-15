import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './controller';
import { ListService, CrudService } from './services';
import { Role, User } from '@shared/src/database';
import { UsersFiltersDto, UpdateUserDto } from './dto';

describe('UsersController', () => {
  let controller: UsersController;
  let listService: jest.Mocked<ListService>;
  let crudService: jest.Mocked<CrudService>;

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
    const mockListService = {
      findAll: jest.fn(),
    };

    const mockCrudService = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: ListService,
          useValue: mockListService,
        },
        {
          provide: CrudService,
          useValue: mockCrudService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    listService = module.get(ListService);
    crudService = module.get(CrudService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should find a user by unique input', async () => {
      crudService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne({ id: 'user-1' });

      expect(result).toEqual(mockUser);
      expect(crudService.findOne).toHaveBeenCalledWith({ id: 'user-1' });
    });

    it('should find a user by email', async () => {
      crudService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne({ email: 'test@example.com' });

      expect(result).toEqual(mockUser);
      expect(crudService.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const filters: UsersFiltersDto = {
        skip: 0,
        take: 10,
      };

      const expectedResult = {
        items: [mockUser],
        total: 1,
        skip: 0,
        take: 10,
      };

      listService.findAll.mockResolvedValue(expectedResult as any);

      const result = await controller.findAll(filters);

      expect(result).toEqual(expectedResult);
      expect(listService.findAll).toHaveBeenCalledWith(filters);
    });

    it('should filter users by role', async () => {
      const filters: UsersFiltersDto = {
        skip: 0,
        take: 10,
        role: Role.ADMIN,
      };

      listService.findAll.mockResolvedValue({
        items: [mockAdminUser],
        total: 1,
        skip: 0,
        take: 10,
      } as any);

      const result = await controller.findAll(filters);

      expect(result.items).toHaveLength(1);
      expect(listService.findAll).toHaveBeenCalledWith(filters);
    });
  });

  describe('me', () => {
    it('should return the current authenticated user', async () => {
      crudService.findOne.mockResolvedValue(mockUser);

      const result = await controller.me(mockUser);

      expect(result).toEqual(mockUser);
      expect(crudService.findOne).toHaveBeenCalledWith({ id: 'user-1' });
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const updateDto: UpdateUserDto = {
        first_name: 'Updated',
      };

      const updatedUser = { ...mockUser, ...updateDto };

      crudService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(
        mockUser,
        { id: 'user-1' },
        updateDto,
      );

      expect(result).toEqual(updatedUser);
      expect(crudService.update).toHaveBeenCalledWith({
        auth: mockUser,
        data: updateDto,
        where: { id: 'user-1' },
        file: undefined,
      });
    });

    it('should update user with file', async () => {
      const updateDto: UpdateUserDto = {
        first_name: 'Updated',
      };

      const mockFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
      } as Express.Multer.File;

      const updatedUser = {
        ...mockUser,
        ...updateDto,
        image: '/uploads/users/test.jpg',
      };

      crudService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(
        mockUser,
        { id: 'user-1' },
        updateDto,
        mockFile,
      );

      expect(result).toEqual(updatedUser);
      expect(crudService.update).toHaveBeenCalledWith({
        auth: mockUser,
        data: updateDto,
        where: { id: 'user-1' },
        file: mockFile,
      });
    });

    it('should update user by email', async () => {
      const updateDto: UpdateUserDto = {
        first_name: 'Updated',
      };

      const updatedUser = { ...mockUser, ...updateDto };

      crudService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(
        mockUser,
        { email: 'test@example.com' },
        updateDto,
      );

      expect(result).toEqual(updatedUser);
      expect(crudService.update).toHaveBeenCalledWith({
        auth: mockUser,
        data: updateDto,
        where: { email: 'test@example.com' },
        file: undefined,
      });
    });
  });
});
