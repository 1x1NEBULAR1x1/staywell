import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import {
  BookingStatus,
  NotificationAction,
  NotificationType,
  Prisma,
  Role,
  User,
} from '@shared/src/database';
import { UpdateBookingDto } from '../dto';
import {
  EXTENDED_BOOKING_INCLUDE,
  ExtendedBooking,
} from '@shared/src/types/bookings-section';
import { CrudService as NotificationsService } from 'src/app/users-section/notifications/services/crud.service';
import { CrudService as BookingVariantsService } from '../../booking-variants/services/crud.service';

@Injectable()
export class CrudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly bookingVariantsService: BookingVariantsService,
  ) {}

  notification_type = NotificationType.BOOKING;

  /**
   * Finds a booking by ID
   * @param id Booking ID
   * @returns Booking with relations
   */
  async find({
    where,
    user,
  }: {
    where: Prisma.BookingWhereUniqueInput;
    user: User;
  }): Promise<ExtendedBooking> {
    return (
      (await this.prisma.booking.findUnique({
        where: {
          ...where,
          ...(user.role !== Role.ADMIN && { user_id: user.id }),
        },
        include: EXTENDED_BOOKING_INCLUDE,
      })) ??
      (() => {
        throw new NotFoundException('Booking not found');
      })()
    );
  }
  /**
   * Updates a booking
   * @param id Booking ID
   * @param updateBookingDto Update booking data
   * @returns Updated booking with relations
   */
  async update({
    id,
    data,
    user,
  }: {
    id: string;
    data: UpdateBookingDto;
    user: User;
  }): Promise<ExtendedBooking> {
    await Promise.all([
      // Check if the booking exists
      this.find({ where: { id }, user }),
      // Check if the booking variant exists
      this.bookingVariantsService.find({
        where: { id: data.booking_variant_id },
      }),
    ]);

    const booking = await this.prisma.booking.update({
      where: { id },
      data,
      include: EXTENDED_BOOKING_INCLUDE,
    });

    // Determine notification action
    let action: NotificationAction = NotificationAction.UPDATE;
    if (data.status === BookingStatus.CONFIRMED)
      action = NotificationAction.CONFIRM;
    if (data.status === BookingStatus.COMPLETED)
      action = NotificationAction.COMPLETE;

    // Create notification
    await this.notificationsService.create({
      data: {
        type: this.notification_type,
        action,
        message: `Booking "${booking.booking_variant.apartment.name}" updated!`,
        user_id: booking.user_id,
      },
    });

    return booking;
  }
}
