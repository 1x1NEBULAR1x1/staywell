import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { Prisma, User } from '@shared/src/database';
import { CreateBookingDto, UpdateBookingDto } from '../dto';
import { ExtendedBooking } from '@shared/src/types/bookings-section';

@Injectable()
export class CrudService {
  constructor(private readonly prisma: PrismaService) {}

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
    await Promise.all([
      this.checkBookingVariant(data.booking_variant_id),
      this.checkTransaction(data.transaction_id),
      this.checkUser(user.id),
    ]);
    // Create booking
    const booking = await this.prisma.booking.create({
      data: { ...data, user_id: user.id },
      include: {
        user: true,
        transaction: true,
        booking_additional_options: true,
        booking_variant: { include: { apartment: true } },
      },
    });
    return booking as unknown as ExtendedBooking; //TODO TYPE ERROR HERE
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
      include: {
        user: true,
        booking_variant: { include: { apartment: true } },
        transaction: true,
        booking_additional_options: { include: { additional_option: true } },
        reviews: true,
      },
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
    return (await this.prisma.booking.update({
      where: { id },
      data,
      include: {
        user: true,
        booking_variant: { include: { apartment: true } },
        transaction: true,
        booking_additional_options: true,
      },
    })) as unknown as ExtendedBooking; //TODO TYPE ERROR HERE
  }
  /**
   * Deletes a booking
   * @param id Booking ID
   * @returns Success message
   */
  async remove(id: string): Promise<{ message: string }> {
    await this.findOne({ id });
    await this.prisma.booking.delete({ where: { id } });
    return { message: 'Booking has been removed successfully' };
  }
}
