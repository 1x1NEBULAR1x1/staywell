import {
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "src/lib/prisma";
import { Prisma, User } from "@shared/src/database";
import { CreateBookingEventDto, UpdateBookingEventDto } from "../dto";

/**
 * Service for performing CRUD operations on event bookings
 */
@Injectable()
export class CrudService {
  constructor(private readonly prisma: PrismaService) { }

  private async checkBooking({ id, user }: { id?: string; user: User }) {
    if (id) {
      const booking = await this.prisma.booking.findUnique({ where: { id } });
      if (!booking) throw new NotFoundException("Booking not found");
      if (booking.user_id !== user.id)
        throw new ForbiddenException(
          "You don't have an access to use this action",
        );
    }
  }

  private async checkEvent(id?: string) {
    if (id && !(await this.prisma.event.findUnique({ where: { id } })))
      throw new NotFoundException("Event not found");
  }

  private async checkBookingEvent({
    booking_id,
    event_id,
  }: {
    booking_id?: string;
    event_id?: string;
  }) {
    if (
      booking_id &&
      event_id &&
      (await this.prisma.bookingEvent.findFirst({
        where: { booking_id, event_id },
      }))
    )
      throw new ConflictException("Event extsts in booking");
  }
  /**
   * Create a new event booking
   * @param createBookingEventDto - DTO with booking event properties
   * @returns The created booking event
   */
  async create({ data, user }: { data: CreateBookingEventDto; user: User }) {
    await Promise.all([
      this.checkBooking({ user, id: data.booking_id }),
      this.checkEvent(data.event_id),
      this.checkBookingEvent(data),
    ]);
    return this.prisma.bookingEvent.create({
      data,
      include: {
        booking: true,
        event: true,
        transaction: true,
      },
    });
  }
  /**
   * Find a specific event booking by ID
   * @param id - Event booking ID
   * @returns Event booking with related booking, event, and transaction
   */
  async findOne({
    where,
    user,
  }: {
    where: Prisma.BookingEventWhereUniqueInput;
    user: User;
  }) {
    const booking_event = await this.prisma.bookingEvent.findUnique({
      where,
      include: {
        booking: true,
        event: true,
        transaction: true,
      },
    });
    if (!booking_event) throw new NotFoundException("Booking event not found");
    await this.checkBooking({ id: booking_event.booking_id, user });
    return booking_event;
  }
  /**
   * Update an existing event booking
   * @param id - Event booking ID
   * @param updateBookingEventDto - DTO with updated booking event properties
   * @returns The updated booking event
   */
  async update({
    id,
    data,
    user,
  }: {
    id: string;
    data: UpdateBookingEventDto;
    user: User;
  }) {
    await Promise.all([
      this.checkBooking({ id: data.booking_id, user }),
      this.checkEvent(data.event_id),
      this.checkBookingEvent(data),
    ]);
    return this.prisma.bookingEvent.update({
      where: { id },
      data,
      include: {
        booking: true,
        event: true,
        transaction: true,
      },
    });
  }
  /**
   * Remove an event booking
   * @param id - Event booking ID
   * @returns The deleted booking event
   */
  async remove({ user, id }: { id: string; user: User }) {
    await this.findOne({ where: { id }, user });
    return this.prisma.bookingEvent.delete({ where: { id } });
  }
}
