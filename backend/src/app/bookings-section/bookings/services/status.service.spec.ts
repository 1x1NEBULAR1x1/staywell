import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { StatusService } from './status.service';
import { PrismaService } from 'src/lib/prisma';
import { BookingStatus } from '@shared/src/database';

describe('Bookings StatusService', () => {
  let service: StatusService;
  let prismaService: any;

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
    transaction: {
      id: 'transaction-1',
      transaction_status: 'SUCCESS',
    },
  };

  beforeEach(async () => {
    const mockPrismaService = {
      booking: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatusService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StatusService>(StatusService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('confirmBooking', () => {
    it('should confirm a pending booking with successful transaction', async () => {
      const confirmedBooking = {
        ...mockBooking,
        status: BookingStatus.CONFIRMED,
      };

      prismaService.booking.findUnique.mockResolvedValue(mockBooking as any);
      prismaService.booking.update.mockResolvedValue(confirmedBooking as any);

      const result = await service.confirmBooking('booking-1');

      expect(result).toEqual(confirmedBooking);
      expect(prismaService.booking.update).toHaveBeenCalledWith({
        where: { id: 'booking-1' },
        data: { status: BookingStatus.CONFIRMED },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException when booking is not found', async () => {
      prismaService.booking.findUnique.mockResolvedValue(null);

      await expect(service.confirmBooking('booking-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when booking status is not PENDING', async () => {
      const confirmedBooking = {
        ...mockBooking,
        status: BookingStatus.CONFIRMED,
      };

      prismaService.booking.findUnique.mockResolvedValue(
        confirmedBooking as any,
      );

      await expect(service.confirmBooking('booking-1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.confirmBooking('booking-1')).rejects.toThrow(
        'Cannot confirm booking with status CONFIRMED',
      );
    });

    it('should throw BadRequestException when transaction is not successful', async () => {
      const bookingWithFailedTransaction = {
        ...mockBooking,
        transaction: {
          ...mockBooking.transaction,
          transaction_status: 'FAILED',
        },
      };

      prismaService.booking.findUnique.mockResolvedValue(
        bookingWithFailedTransaction as any,
      );

      await expect(service.confirmBooking('booking-1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.confirmBooking('booking-1')).rejects.toThrow(
        'Cannot confirm booking with unsuccessful transaction',
      );
    });
  });

  describe('completeBooking', () => {
    it('should complete a confirmed booking after end date', async () => {
      const pastEndDateBooking = {
        ...mockBooking,
        status: BookingStatus.CONFIRMED,
        end: new Date('2020-01-05'), // Past date
      };
      const completedBooking = {
        ...pastEndDateBooking,
        status: BookingStatus.COMPLETED,
      };

      prismaService.booking.findUnique.mockResolvedValue(
        pastEndDateBooking as any,
      );
      prismaService.booking.update.mockResolvedValue(completedBooking as any);

      const result = await service.completeBooking('booking-1');

      expect(result).toEqual(completedBooking);
      expect(prismaService.booking.update).toHaveBeenCalledWith({
        where: { id: 'booking-1' },
        data: { status: BookingStatus.COMPLETED },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException when booking is not found', async () => {
      prismaService.booking.findUnique.mockResolvedValue(null);

      await expect(service.completeBooking('booking-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when booking status is not CONFIRMED', async () => {
      const pendingBooking = {
        ...mockBooking,
        status: BookingStatus.PENDING,
      };

      prismaService.booking.findUnique.mockResolvedValue(pendingBooking as any);

      await expect(service.completeBooking('booking-1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.completeBooking('booking-1')).rejects.toThrow(
        'Cannot complete booking with status PENDING',
      );
    });

    it('should throw BadRequestException when trying to complete before end date', async () => {
      const futureBooking = {
        ...mockBooking,
        status: BookingStatus.CONFIRMED,
        end: new Date('2099-01-05'), // Future date
      };

      prismaService.booking.findUnique.mockResolvedValue(futureBooking as any);

      await expect(service.completeBooking('booking-1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.completeBooking('booking-1')).rejects.toThrow(
        'Cannot complete booking before its end date',
      );
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a pending booking', async () => {
      const cancelledBooking = {
        ...mockBooking,
        status: BookingStatus.CANCELLED,
      };

      prismaService.booking.findUnique.mockResolvedValue(mockBooking as any);
      prismaService.booking.update.mockResolvedValue(cancelledBooking as any);

      const result = await service.cancelBooking('booking-1');

      expect(result).toEqual(cancelledBooking);
      expect(prismaService.booking.update).toHaveBeenCalledWith({
        where: { id: 'booking-1' },
        data: { status: BookingStatus.CANCELLED },
        include: expect.any(Object),
      });
    });

    it('should cancel a confirmed booking', async () => {
      const confirmedBooking = {
        ...mockBooking,
        status: BookingStatus.CONFIRMED,
      };
      const cancelledBooking = {
        ...confirmedBooking,
        status: BookingStatus.CANCELLED,
      };

      prismaService.booking.findUnique.mockResolvedValue(
        confirmedBooking as any,
      );
      prismaService.booking.update.mockResolvedValue(cancelledBooking as any);

      const result = await service.cancelBooking('booking-1');

      expect(result).toEqual(cancelledBooking);
    });

    it('should throw NotFoundException when booking is not found', async () => {
      prismaService.booking.findUnique.mockResolvedValue(null);

      await expect(service.cancelBooking('booking-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when trying to cancel completed booking', async () => {
      const completedBooking = {
        ...mockBooking,
        status: BookingStatus.COMPLETED,
      };

      prismaService.booking.findUnique.mockResolvedValue(
        completedBooking as any,
      );

      await expect(service.cancelBooking('booking-1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.cancelBooking('booking-1')).rejects.toThrow(
        'Cannot cancel a completed booking',
      );
    });
  });
});
