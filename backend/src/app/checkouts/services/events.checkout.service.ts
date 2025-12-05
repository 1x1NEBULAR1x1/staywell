import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import {
  TransactionType,
  TransactionStatus,
  PaymentMethod,
  User,
} from '@shared/src/database';
import { CreateBookingEventDto } from 'src/app/events-section/booking-events/dto/create.dto';
import { EXTENDED_EVENT_INCLUDE, ExtendedEvent } from '@shared/src';

@Injectable()
export class EventsCheckoutService {
  constructor(private readonly prisma: PrismaService) {}

  async createEventsCheckout({
    event_checkout_dtos,
    user,
  }: {
    event_checkout_dtos: CreateBookingEventDto[];
    user: User;
  }) {
    const events = await this.validateEventsCheckout({ event_checkout_dtos });

    let amount = 0;
    const create_booking_events_data: {
      event: ExtendedEvent;
      number_of_people: number;
    }[] = [];

    for (const event of events) {
      const event_checkout_dto = event_checkout_dtos.find(
        (event_checkout_dto) => event_checkout_dto.event_id === event.id,
      );
      if (!event_checkout_dto)
        throw new NotFoundException(
          `Event checkout dto for event "${event.name}" not found`,
        );

      create_booking_events_data.push({
        event,
        number_of_people: event_checkout_dto.number_of_people,
      });

      amount +=
        event.price *
        create_booking_events_data[create_booking_events_data.length - 1]
          .number_of_people;
    }

    // Create transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        amount,
        user_id: user.id,
        description: `Events payment for ${events.map((event) => event.name).join(', ')}`,
        transaction_type: TransactionType.PAYMENT,
        transaction_status: TransactionStatus.PENDING,
        payment_method: PaymentMethod.CARD,
      },
    });

    // Create booking_events
    await this.prisma.bookingEvent.createMany({
      data: create_booking_events_data.map((data) => ({
        transaction_id: transaction.id,
        event_id: data.event.id,
        number_of_people: data.number_of_people,
      })),
    });

    return {
      transaction,
      events: create_booking_events_data,
    };
  }

  async validateEventsCheckout({
    event_checkout_dtos,
  }: {
    event_checkout_dtos: CreateBookingEventDto[];
  }): Promise<ExtendedEvent[]> {
    const events = await this.prisma.event.findMany({
      where: {
        id: {
          in: event_checkout_dtos.map(
            (event_checkout_dto) => event_checkout_dto.event_id,
          ),
        },
      },
      include: EXTENDED_EVENT_INCLUDE,
    });
    // Check if all events exist
    if (events.length !== event_checkout_dtos.length)
      throw new NotFoundException('Some events are not found');

    // Check if any event is excluded
    if (events.some((event) => event.is_excluded))
      throw new BadRequestException('Some events are not available');

    for (const event of events) {
      // Check if the number of people is enough for the all events
      const free_spots =
        event.capacity -
        event.booking_events.reduce(
          (total, booking_event) => total + booking_event.number_of_people,
          0,
        );
      const event_checkout_dto = event_checkout_dtos.find(
        (event_checkout_dto) => event_checkout_dto.event_id === event.id,
      );

      if (!event_checkout_dto)
        throw new NotFoundException(
          `Event checkout dto for event "${event.name}" not found`,
        );

      if (free_spots < event_checkout_dto.number_of_people)
        throw new BadRequestException(
          `Event "${event.name}" capacity is not enough for ${event_checkout_dto.number_of_people} people`,
        );
    }
    return events.map((event) => ({
      ...event,
      available_spots: Math.max(
        0,
        event.capacity -
          event.booking_events.reduce(
            (total, booking_event) => total + booking_event.number_of_people,
            0,
          ),
      ),
    }));
  }
}
