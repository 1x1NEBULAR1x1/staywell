import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CrudService } from './crud.service';
import { PrismaService } from 'src/lib/prisma';
import { FilesService } from 'src/lib/files';
import { CheckService } from './check.service';
import { AvailabilityService } from './availability.service';
import { Role, User, ApartmentType } from '@shared/src/database';
import { CreateApartmentDto, UpdateApartmentDto } from '../dto';

describe('Apartments CrudService', () => {
  let service: CrudService;
  let prismaService: any;
  let filesService: jest.Mocked<FilesService>;
  let checkService: jest.Mocked<CheckService>;
  let availabilityService: jest.Mocked<AvailabilityService>;

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

  const mockApartment = {
    id: 'apartment-1',
    name: 'Test Apartment',
    description: 'Test Description',
    number: 101,
    type: ApartmentType.STANDARD,
    max_capacity: 4,
    is_available: true,
    is_smoking: false,
    is_pet_friendly: true,
    is_excluded: false,
    image: '/uploads/apartment.jpg',
    created: new Date(),
    updated: new Date(),
    images: [],
    apartment_beds: [],
    apartment_amenities: [],
  };

  const mockBookingVariant = {
    id: 'variant-1',
    apartment_id: 'apartment-1',
    capacity: 2,
    price: 100,
    is_available: true,
  };

  beforeEach(async () => {
    const mockPrismaService = {
      apartment: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      bookingVariant: {
        findMany: jest.fn(),
      },
      reservation: {
        findMany: jest.fn(),
      },
      booking: {
        findMany: jest.fn(),
      },
      review: {
        findMany: jest.fn(),
      },
    } as any;

    const mockFilesService = {
      saveImage: jest.fn(),
    };

    const mockCheckService = {
      checkConflict: jest.fn(),
      checkNotFound: jest.fn(),
    };

    const mockAvailabilityService = {
      checkApartmentAvailability: jest.fn(),
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
        {
          provide: CheckService,
          useValue: mockCheckService,
        },
        {
          provide: AvailabilityService,
          useValue: mockAvailabilityService,
        },
      ],
    }).compile();

    service = module.get<CrudService>(CrudService);
    prismaService = module.get(PrismaService);
    filesService = module.get(FilesService);
    checkService = module.get(CheckService);
    availabilityService = module.get(AvailabilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateApartmentDto = {
      name: 'Test Apartment',
      description: 'Test Description',
      number: 101,
      type: ApartmentType.STANDARD,
      max_capacity: 4,
      floor: 3,
      rooms_count: 2,
      is_smoking: false,
      is_pet_friendly: true,
      is_available: true,
      rules: 'Test rules',
      deposit: 100,
      image: '/uploads/apartment.jpg',
    };

    it('should create an apartment without file', async () => {
      checkService.checkConflict.mockResolvedValue(undefined);
      prismaService.apartment.create.mockResolvedValue(mockApartment as any);
      prismaService.apartment.findUnique.mockResolvedValue(
        mockApartment as any,
      );
      prismaService.bookingVariant.findMany.mockResolvedValue([]);
      prismaService.reservation.findMany.mockResolvedValue([]);
      prismaService.booking.findMany.mockResolvedValue([]);
      prismaService.review.findMany.mockResolvedValue([]);
      availabilityService.checkApartmentAvailability.mockResolvedValue({
        is_available: true,
      } as any);

      const result = await service.create({ data: createDto });

      expect(checkService.checkConflict).toHaveBeenCalledWith(101);
      expect(prismaService.apartment.create).toHaveBeenCalledWith({
        data: createDto,
      });
      expect(result).toBeDefined();
    });

    it('should create an apartment with file', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
      } as Express.Multer.File;

      checkService.checkConflict.mockResolvedValue(undefined);
      filesService.saveImage.mockReturnValue('/uploads/new-apartment.jpg');
      prismaService.apartment.create.mockResolvedValue({
        ...mockApartment,
        image: '/uploads/new-apartment.jpg',
      } as any);
      prismaService.apartment.findUnique.mockResolvedValue({
        ...mockApartment,
        image: '/uploads/new-apartment.jpg',
      } as any);
      prismaService.bookingVariant.findMany.mockResolvedValue([]);
      prismaService.reservation.findMany.mockResolvedValue([]);
      prismaService.booking.findMany.mockResolvedValue([]);
      prismaService.review.findMany.mockResolvedValue([]);
      availabilityService.checkApartmentAvailability.mockResolvedValue({
        is_available: true,
      } as any);

      await service.create({ data: createDto, file: mockFile });

      expect(filesService.saveImage).toHaveBeenCalledWith({
        file: mockFile,
        dir_name: 'APARTMENTS',
      });
    });

    it('should throw error when image is not provided', async () => {
      const dtoWithoutImage = { ...createDto };
      delete dtoWithoutImage.image;

      checkService.checkConflict.mockResolvedValue(undefined);
      prismaService.apartment.create.mockImplementation(() => {
        throw new Error('Image is required');
      });

      await expect(service.create({ data: dtoWithoutImage })).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('should find an apartment by id', async () => {
      prismaService.apartment.findUnique.mockResolvedValue(
        mockApartment as any,
      );
      prismaService.bookingVariant.findMany.mockResolvedValue([
        mockBookingVariant,
      ] as any);
      prismaService.reservation.findMany.mockResolvedValue([]);
      prismaService.booking.findMany.mockResolvedValue([]);
      prismaService.review.findMany.mockResolvedValue([]);
      availabilityService.checkApartmentAvailability.mockResolvedValue({
        is_available: true,
      } as any);

      const result = await service.findOne({ where: { id: 'apartment-1' } });

      expect(result).toBeDefined();
      expect(result.id).toBe('apartment-1');
      expect(result.price).toBe(100);
      expect(result.capacity).toBe(4);
    });

    it('should calculate correct price from booking variants', async () => {
      prismaService.apartment.findUnique.mockResolvedValue(
        mockApartment as any,
      );
      prismaService.bookingVariant.findMany.mockResolvedValue([
        { ...mockBookingVariant, price: 150 },
        { ...mockBookingVariant, id: 'variant-2', price: 100 },
        { ...mockBookingVariant, id: 'variant-3', price: 200 },
      ] as any);
      prismaService.reservation.findMany.mockResolvedValue([]);
      prismaService.booking.findMany.mockResolvedValue([]);
      prismaService.review.findMany.mockResolvedValue([]);
      availabilityService.checkApartmentAvailability.mockResolvedValue({
        is_available: true,
      } as any);

      const result = await service.findOne({ where: { id: 'apartment-1' } });

      expect(result.price).toBe(100); // Minimum price
    });

    it('should include reservations and bookings for admin user', async () => {
      const mockReservations = [
        { id: 'reservation-1', apartment_id: 'apartment-1' },
      ];
      const mockBookings = [{ id: 'booking-1' }];

      prismaService.apartment.findUnique.mockResolvedValue(
        mockApartment as any,
      );
      prismaService.bookingVariant.findMany.mockResolvedValue([
        mockBookingVariant,
      ] as any);
      prismaService.reservation.findMany.mockResolvedValue(
        mockReservations as any,
      );
      prismaService.booking.findMany.mockResolvedValue(mockBookings as any);
      prismaService.review.findMany.mockResolvedValue([]);
      availabilityService.checkApartmentAvailability.mockResolvedValue({
        is_available: true,
      } as any);

      const result = await service.findOne({
        where: { id: 'apartment-1' },
        user: mockAdminUser,
      });

      expect(result.reservations).toHaveLength(1);
      expect(result.bookings).toHaveLength(1);
    });

    it('should not include reservations and bookings for regular user', async () => {
      prismaService.apartment.findUnique.mockResolvedValue(
        mockApartment as any,
      );
      prismaService.bookingVariant.findMany.mockResolvedValue([
        mockBookingVariant,
      ] as any);
      prismaService.reservation.findMany.mockResolvedValue([]);
      prismaService.booking.findMany.mockResolvedValue([]);
      prismaService.review.findMany.mockResolvedValue([]);
      availabilityService.checkApartmentAvailability.mockResolvedValue({
        is_available: true,
      } as any);

      const result = await service.findOne({
        where: { id: 'apartment-1' },
        user: mockUser,
      });

      expect(result.reservations).toHaveLength(0);
      expect(result.bookings).toHaveLength(0);
    });

    it('should throw NotFoundException when apartment is not found', async () => {
      prismaService.apartment.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne({ where: { id: 'apartment-1' } }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should calculate average rating correctly', async () => {
      const mockReviews = [
        { id: 'review-1', rating: 5, apartment_id: 'apartment-1' },
        { id: 'review-2', rating: 4, apartment_id: 'apartment-1' },
        { id: 'review-3', rating: 3, apartment_id: 'apartment-1' },
      ];

      prismaService.apartment.findUnique.mockResolvedValue(
        mockApartment as any,
      );
      prismaService.bookingVariant.findMany.mockResolvedValue([
        mockBookingVariant,
      ] as any);
      prismaService.reservation.findMany.mockResolvedValue([]);
      prismaService.booking.findMany.mockResolvedValue([]);
      prismaService.review.findMany.mockResolvedValue(mockReviews as any);
      availabilityService.checkApartmentAvailability.mockResolvedValue({
        is_available: true,
      } as any);

      const result = await service.findOne({ where: { id: 'apartment-1' } });

      expect(result.rating).toBe(4); // (5 + 4 + 3) / 3 = 4
    });
  });

  describe('update', () => {
    const updateDto: UpdateApartmentDto = {
      name: 'Updated Apartment',
      max_capacity: 6,
    };

    it('should update an apartment successfully', async () => {
      checkService.checkNotFound.mockResolvedValue(mockApartment as any);
      checkService.checkConflict.mockResolvedValue(undefined);
      prismaService.apartment.update.mockResolvedValue({
        ...mockApartment,
        ...updateDto,
      } as any);
      prismaService.apartment.findUnique.mockResolvedValue({
        ...mockApartment,
        ...updateDto,
      } as any);
      prismaService.bookingVariant.findMany.mockResolvedValue([
        mockBookingVariant,
      ] as any);
      prismaService.reservation.findMany.mockResolvedValue([]);
      prismaService.booking.findMany.mockResolvedValue([]);
      prismaService.review.findMany.mockResolvedValue([]);
      availabilityService.checkApartmentAvailability.mockResolvedValue({
        is_available: true,
      } as any);

      const result = await service.update({
        where: { id: 'apartment-1' },
        data: updateDto,
      });

      expect(result.name).toBe('Updated Apartment');
      expect(result.max_capacity).toBe(6);
    });

    it('should update apartment with file', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        buffer: Buffer.from('test'),
        size: 1024,
      } as Express.Multer.File;

      checkService.checkNotFound.mockResolvedValue(mockApartment as any);
      checkService.checkConflict.mockResolvedValue(undefined);
      filesService.saveImage.mockReturnValue('/uploads/updated-apartment.jpg');
      prismaService.apartment.update.mockResolvedValue({
        ...mockApartment,
        image: '/uploads/updated-apartment.jpg',
      } as any);
      prismaService.apartment.findUnique.mockResolvedValue({
        ...mockApartment,
        image: '/uploads/updated-apartment.jpg',
      } as any);
      prismaService.bookingVariant.findMany.mockResolvedValue([
        mockBookingVariant,
      ] as any);
      prismaService.reservation.findMany.mockResolvedValue([]);
      prismaService.booking.findMany.mockResolvedValue([]);
      prismaService.review.findMany.mockResolvedValue([]);
      availabilityService.checkApartmentAvailability.mockResolvedValue({
        is_available: true,
      } as any);

      await service.update({
        where: { id: 'apartment-1' },
        data: updateDto,
        file: mockFile,
      });

      expect(filesService.saveImage).toHaveBeenCalledWith({
        file: mockFile,
        dir_name: 'APARTMENTS',
      });
    });
  });

  describe('remove', () => {
    it('should soft delete apartment when is_excluded is false', async () => {
      checkService.checkNotFound.mockResolvedValue({
        ...mockApartment,
        is_excluded: false,
      } as any);
      prismaService.apartment.update.mockResolvedValue({
        ...mockApartment,
        is_available: false,
      } as any);
      prismaService.apartment.findUnique.mockResolvedValue({
        ...mockApartment,
        is_available: false,
      } as any);
      prismaService.bookingVariant.findMany.mockResolvedValue([]);
      prismaService.reservation.findMany.mockResolvedValue([]);
      prismaService.booking.findMany.mockResolvedValue([]);
      prismaService.review.findMany.mockResolvedValue([]);
      availabilityService.checkApartmentAvailability.mockResolvedValue({
        is_available: false,
      } as any);

      const result = await service.remove({ id: 'apartment-1' });

      expect(result.is_available).toBe(false);
      expect(prismaService.apartment.delete).not.toHaveBeenCalled();
    });

    it('should hard delete apartment when is_excluded is true', async () => {
      checkService.checkNotFound.mockResolvedValue({
        ...mockApartment,
        is_excluded: true,
      } as any);
      prismaService.apartment.delete.mockResolvedValue(mockApartment as any);

      await service.remove({ id: 'apartment-1' });

      expect(prismaService.apartment.delete).toHaveBeenCalledWith({
        where: {
          id: 'apartment-1',
        },
      });
    });
  });
});
