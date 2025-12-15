import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CrudService } from './crud.service';
import { PrismaService } from 'src/lib/prisma';
import { CrudService as NotificationsService } from 'src/app/users-section/notifications/services/crud.service';
import { CrudService as BookingVariantsService } from '../../booking-variants/services/crud.service';
import {
  BookingStatus,
  NotificationAction,
  NotificationType,
  Role,
  User,
} from '@shared/src/database';
import { UpdateBookingDto } from '../dto';

describe('Bookings CrudService', () => {
  let service: CrudService;
  let prismaService: any;
  let notificationsService: jest.Mocked<NotificationsService>;
  let bookingVariantsService: jest.Mocked<BookingVariantsService>;

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

  const mockBooking = {
    id: 'booking-1',
    user_id: 'user-1',
    booking_variant_id: 'variant-1',
    transaction_id: 'transaction-1',
    status: BookingStatus.PENDING,
    start: new Date('2025-01-01'),
    end: new Date('2025-01-05'),
    message: 'Test booking',
    created: new Date(),
    updated: new Date(),
    booking_variant: {
      id: 'variant-1',
      apartment: {
        id: 'apartment-1',
        name: 'Test Apartment',
      },
    },
  };

  beforeEach(async () => {
    const mockPrismaService = {
      booking: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    } as any;

    const mockNotificationsService = {
      create: jest.fn(),
    };

    const mockBookingVariantsService = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrudService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
        },
        {
          provide: BookingVariantsService,
          useValue: mockBookingVariantsService,
        },
      ],
    }).compile();

    service = module.get<CrudService>(CrudService);
    prismaService = module.get(PrismaService);
    notificationsService = module.get(NotificationsService);
    bookingVariantsService = module.get(BookingVariantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should find a booking by id for regular user', async () => {
      prismaService.booking.findUnique.mockResolvedValue(mockBooking as any);

      const result = await service.find({
        where: { id: 'booking-1' },
        user: mockUser,
      });

      expect(result).toEqual(mockBooking);
      expect(prismaService.booking.findUnique).toHaveBeenCalledWith({
        where: { id: 'booking-1', user_id: 'user-1' },
        include: expect.any(Object),
      });
    });

    it('should find a booking by id for admin user without user_id filter', async () => {
      prismaService.booking.findUnique.mockResolvedValue(mockBooking as any);

      const result = await service.find({
        where: { id: 'booking-1' },
        user: mockAdminUser,
      });

      expect(result).toEqual(mockBooking);
      expect(prismaService.booking.findUnique).toHaveBeenCalledWith({
        where: { id: 'booking-1' },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException when booking is not found', async () => {
      prismaService.booking.findUnique.mockResolvedValue(null);

      await expect(
        service.find({ where: { id: 'booking-1' }, user: mockUser }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateBookingDto = {
      booking_variant_id: 'variant-2',
      message: 'Updated message',
    };

    it('should update a booking successfully', async () => {
      const updatedBooking = { ...mockBooking, ...updateDto };

      prismaService.booking.findUnique.mockResolvedValue(mockBooking as any);
      bookingVariantsService.find.mockResolvedValue({
        id: 'variant-2',
      } as any);
      prismaService.booking.update.mockResolvedValue(updatedBooking as any);
      notificationsService.create.mockResolvedValue({} as any);

      const result = await service.update({
        id: 'booking-1',
        data: updateDto,
        user: mockUser,
      });

      expect(result).toEqual(updatedBooking);
      expect(prismaService.booking.update).toHaveBeenCalledWith({
        where: { id: 'booking-1' },
        data: updateDto,
        include: expect.any(Object),
      });
    });

    it('should create notification with UPDATE action for regular update', async () => {
      const updatedBooking = { ...mockBooking, message: 'Updated' };

      prismaService.booking.findUnique.mockResolvedValue(mockBooking as any);
      bookingVariantsService.find.mockResolvedValue({
        id: 'variant-1',
      } as any);
      prismaService.booking.update.mockResolvedValue(updatedBooking as any);
      notificationsService.create.mockResolvedValue({} as any);

      await service.update({
        id: 'booking-1',
        data: { booking_variant_id: 'variant-1', message: 'Updated' },
        user: mockUser,
      });

      expect(notificationsService.create).toHaveBeenCalledWith({
        data: {
          type: NotificationType.BOOKING,
          action: NotificationAction.UPDATE,
          message: 'Booking "Test Apartment" updated!',
          user_id: 'user-1',
        },
      });
    });

    it('should create notification with CONFIRM action when status is CONFIRMED', async () => {
      const confirmedBooking = {
        ...mockBooking,
        status: BookingStatus.CONFIRMED,
      };

      prismaService.booking.findUnique.mockResolvedValue(mockBooking as any);
      bookingVariantsService.find.mockResolvedValue({
        id: 'variant-1',
      } as any);
      prismaService.booking.update.mockResolvedValue(confirmedBooking as any);
      notificationsService.create.mockResolvedValue({} as any);

      await service.update({
        id: 'booking-1',
        data: {
          booking_variant_id: 'variant-1',
          status: BookingStatus.CONFIRMED,
        },
        user: mockUser,
      });

      expect(notificationsService.create).toHaveBeenCalledWith({
        data: {
          type: NotificationType.BOOKING,
          action: NotificationAction.CONFIRM,
          message: 'Booking "Test Apartment" updated!',
          user_id: 'user-1',
        },
      });
    });

    it('should create notification with COMPLETE action when status is COMPLETED', async () => {
      const completedBooking = {
        ...mockBooking,
        status: BookingStatus.COMPLETED,
      };

      prismaService.booking.findUnique.mockResolvedValue(mockBooking as any);
      bookingVariantsService.find.mockResolvedValue({
        id: 'variant-1',
      } as any);
      prismaService.booking.update.mockResolvedValue(completedBooking as any);
      notificationsService.create.mockResolvedValue({} as any);

      await service.update({
        id: 'booking-1',
        data: {
          booking_variant_id: 'variant-1',
          status: BookingStatus.COMPLETED,
        },
        user: mockUser,
      });

      expect(notificationsService.create).toHaveBeenCalledWith({
        data: {
          type: NotificationType.BOOKING,
          action: NotificationAction.COMPLETE,
          message: 'Booking "Test Apartment" updated!',
          user_id: 'user-1',
        },
      });
    });

    it('should throw error when booking is not found during update', async () => {
      prismaService.booking.findUnique.mockResolvedValue(null);

      await expect(
        service.update({
          id: 'booking-1',
          data: updateDto,
          user: mockUser,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
