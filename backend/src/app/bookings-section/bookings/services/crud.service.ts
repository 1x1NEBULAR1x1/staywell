import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import {
  BookingStatus,
  NotificationAction,
  NotificationType,
  Prisma,
  Role,
  User,
} from '@shared/src/database';
import { CreateBookingDto, UpdateBookingDto } from '../dto';
import {
  EXTENDED_BOOKING_INCLUDE,
  ExtendedBooking,
} from '@shared/src/types/bookings-section';

@Injectable()
export class CrudService {
  constructor(private readonly prisma: PrismaService) { }

  notification_type = NotificationType.BOOKING;

  private async checkBookingVariant(id?: string) {
    if (id && !(await this.prisma.bookingVariant.findUnique({ where: { id } })))
      throw new NotFoundException('Booking variant not found');
  }

  private async checkTransaction(id?: string, conflict: boolean = false) {
    if (id && !(await this.prisma.transaction.findUnique({ where: { id } })))
      throw new NotFoundException('Transaction not found');
    if (id && conflict) {
      const bookingWithTransaction = await this.findOne({ transaction_id: id });
      if (bookingWithTransaction && bookingWithTransaction.id !== id)
        throw new ConflictException(
          'Transaction is already used by another booking',
        );
    }
  }

  private async checkUser(id?: string) {
    if (id && !(await this.prisma.user.findUnique({ where: { id } })))
      throw new NotFoundException('User not found');
  }
  /**
   * Creates a new booking
   * @param createBookingDto Booking creation data
   * @returns Created booking with relations
   */
  async create({
    user,
    data,
  }: {
    user: User;
    data: CreateBookingDto;
  }): Promise<ExtendedBooking> {
    const user_id = user.role === Role.ADMIN ? data.user_id : user.id;
    await Promise.all([
      this.checkBookingVariant(data.booking_variant_id),
      this.checkTransaction(data.transaction_id),
      this.checkUser(user_id),
    ]);
    // Create booking
    const booking = await this.prisma.booking.create({
      data: { ...data, user_id },
      include: EXTENDED_BOOKING_INCLUDE,
    });
    // Create notifications: one for user, one global
    const notification = {
      type: this.notification_type,
      action: NotificationAction.NEW,
      message: `New booking created for ${booking.user.email}`,
    };

    await this.prisma.notification.createMany({ data: [{ ...notification, user_id }, { ...notification }] });
    return booking;
  }
  /**
   * Finds a booking by ID
   * @param id Booking ID
   * @returns Booking with relations
   */
  async findOne(
    where: Prisma.BookingWhereUniqueInput,
  ): Promise<ExtendedBooking> {
    const booking = await this.prisma.booking.findUnique({
      where,
      include: EXTENDED_BOOKING_INCLUDE,
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }
  /**
   * Updates a booking
   * @param id Booking ID
   * @param updateBookingDto Update booking data
   * @returns Updated booking with relations
   */
  async update(id: string, data: UpdateBookingDto): Promise<ExtendedBooking> {
    await Promise.all([
      this.findOne({ id }),
      this.checkBookingVariant(data.booking_variant_id),
      this.checkTransaction(data.transaction_id, true),
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

    const notification = {
      type: this.notification_type,
      action,
      message: `Booking updated for ${booking.id}`,
    };
    // Create notifications: one for user, one global
    await this.prisma.notification.createMany({ data: [{ ...notification, user_id: booking.user_id }, { ...notification }] });
    return booking;
  }
  /**
   * Deletes a booking
   * @param id Booking ID
   * @returns Success message
   */
  async remove(id: string): Promise<{ message: string }> {
    const booking = await this.findOne({ id });
    await this.prisma.booking.delete({ where: { id } });
    const notification = {
      type: this.notification_type,
      action: NotificationAction.CANCEL,
      message: `Booking cancelled`,
    };
    await this.prisma.notification.createMany({ data: [{ ...notification, user_id: booking.user_id }, { ...notification }] });
    return { message: 'Booking has been removed successfully' };
  }
}
