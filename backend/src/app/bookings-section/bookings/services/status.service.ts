import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "src/lib/prisma";
import { BookingStatus } from "@shared/src/database";
import { ExtendedBooking } from "@shared/src/types/bookings-section";

@Injectable()
export class StatusService {
  constructor(private readonly prisma: PrismaService) { }
  /**
   * Confirms a booking
   * @param id Booking ID
   * @returns Updated booking with relations
   */
  async confirmBooking(id: string): Promise<ExtendedBooking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { transaction: true },
    });

    if (!booking) throw new NotFoundException("Booking not found");

    if (booking.status !== BookingStatus.PENDING)
      throw new BadRequestException(
        `Cannot confirm booking with status ${booking.status}`,
      );
    // Check transaction status
    if (booking.transaction.transaction_status !== "SUCCESS")
      throw new BadRequestException(
        "Cannot confirm booking with unsuccessful transaction",
      );
    // Update booking status
    return await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CONFIRMED },
      include: {
        user: true,
        booking_variant: { include: { apartment: true } },
        transaction: true,
        booking_additional_options: true,
      },
    }) as unknown as ExtendedBooking; //TODO TYPE ERROR HERE
  }

  /**
   * Completes a booking
   * @param id Booking ID
   * @returns Updated booking with relations
   */
  async completeBooking(id: string): Promise<ExtendedBooking> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });

    if (!booking) throw new NotFoundException("Booking not found");

    if (booking.status !== BookingStatus.CONFIRMED)
      throw new BadRequestException(
        `Cannot complete booking with status ${booking.status}`,
      );
    // Check if the booking's end date is in the past
    if (booking.end > new Date())
      throw new BadRequestException(
        "Cannot complete booking before its end date",
      );
    // Update booking status
    return await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.COMPLETED },
      include: {
        user: true,
        booking_variant: { include: { apartment: true } },
        transaction: true,
        booking_additional_options: true,
      },
    }) as unknown as ExtendedBooking; //TODO TYPE ERROR HERE
  }

  /**
   * Cancels a booking
   * @param id Booking ID
   * @returns Updated booking with relations
   */
  async cancelBooking(id: string): Promise<ExtendedBooking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { transaction: true },
    });

    if (!booking) throw new NotFoundException("Booking not found");

    if (booking.status === BookingStatus.COMPLETED)
      throw new BadRequestException("Cannot cancel a completed booking");

    // Update booking status
    return await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
      include: {
        user: true,
        booking_variant: { include: { apartment: true } },
        transaction: true,
        booking_additional_options: true,
      },
    }) as unknown as ExtendedBooking; //TODO TYPE ERROR HERE
  }

  /**
   * Updates booking status
   * @param id Booking ID
   * @param status New booking status
   * @returns Updated booking with relations
   */
  async updateStatus(
    id: string,
    status: BookingStatus,
  ): Promise<ExtendedBooking> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });

    if (!booking) throw new NotFoundException("Booking not found");
    // Validate status transition
    this.validateStatusTransition(booking.status, status);
    // Update booking status
    return await this.prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        booking_variant: { include: { apartment: true } },
        transaction: true,
        booking_additional_options: true,
      },
    }) as unknown as ExtendedBooking; //TODO TYPE ERROR HERE
  }

  /**
   * Validates if a booking status transition is allowed
   * @param currentStatus Current booking status
   * @param newStatus New booking status
   */
  private validateStatusTransition(
    current_status: BookingStatus,
    new_status: BookingStatus,
  ): void {
    const allowed_transitions: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [
        BookingStatus.CONFIRMED,
        BookingStatus.CANCELLED,
      ],
      [BookingStatus.CONFIRMED]: [
        BookingStatus.COMPLETED,
        BookingStatus.CANCELLED,
      ],
      [BookingStatus.COMPLETED]: [],
      [BookingStatus.CANCELLED]: [],
    };

    if (!allowed_transitions[current_status].includes(new_status))
      throw new BadRequestException(
        `Cannot change status from ${current_status} to ${new_status}`,
      );
  }
}
