import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma';
import { CreateBookingDto } from '../../bookings-section/bookings/dto';
import { BookingVariant } from '@shared/src/database';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { EventsCheckoutService } from './events.checkout.service';
import {
  User,
  TransactionType,
  TransactionStatus,
  PaymentMethod,
} from '@shared/src/database';

@Injectable()
export class BookingsCheckoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsCheckoutService: EventsCheckoutService,
  ) {}

  async createBookingCheckout({
    create_booking_dto,
    user,
  }: {
    create_booking_dto: CreateBookingDto;
    user: User;
  }) {
    const amount = await this.calculateAmount({ create_booking_dto });

    const booking_variant = await this.prisma.bookingVariant.findUnique({
      where: { id: create_booking_dto.booking_variant_id },
      include: { apartment: true },
    });

    if (!booking_variant)
      throw new NotFoundException('Booking variant not found');

    // Create transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        amount,
        user_id: user.id,
        description: `Booking payment for ${booking_variant.apartment.name}`,
        transaction_type: TransactionType.PAYMENT,
        transaction_status: TransactionStatus.PENDING,
        payment_method: PaymentMethod.CARD,
      },
    });

    // Create booking with events and additional options
    const booking = await this.prisma.booking.create({
      data: {
        start: create_booking_dto.start,
        end: create_booking_dto.end,
        user_id: user.id,
        transaction_id: transaction.id,
        booking_variant_id: booking_variant.id,
        booking_events: {
          createMany: {
            data: create_booking_dto.events.map((event) => ({
              event_id: event.event_id,
              number_of_people: event.number_of_people,
            })),
          },
        },
        booking_additional_options: {
          createMany: {
            data: create_booking_dto.additional_options,
          },
        },
      },
    });

    return {
      transaction,
      booking,
    };
  }

  private async calculateAmount({
    create_booking_dto,
  }: {
    create_booking_dto: CreateBookingDto;
  }): Promise<number> {
    const booking_variant = await this.prisma.bookingVariant.findUnique({
      where: { id: create_booking_dto.booking_variant_id },
      include: { apartment: true },
    });

    if (!booking_variant)
      throw new NotFoundException('Booking variant not found');
    if (!booking_variant.is_available || booking_variant.is_excluded)
      throw new BadRequestException('Booking variant is not available');

    const additional_options = await this.prisma.additionalOption.findMany({
      where: {
        id: {
          in: create_booking_dto.additional_options?.map(
            (option) => option.additional_option_id,
          ),
        },
      },
    });

    if (additional_options.some((option) => option.is_excluded))
      throw new BadRequestException(
        'Some additional options are not available',
      );

    const events = await this.eventsCheckoutService.validateEventsCheckout({
      event_checkout_dtos: create_booking_dto.events,
    });

    // Calculate the total price
    const booking_price = this.calculateBookingPrice({
      booking_variant,
      create_booking_dto,
    });

    const additional_options_price = additional_options.reduce(
      (total, option) => {
        const booking_option = create_booking_dto.additional_options?.find(
          (bo) => bo.additional_option_id === option.id,
        );
        return total + option.price * (booking_option?.amount || 0);
      },
      0,
    );

    const events_price = events.reduce((total, event) => {
      const booking_event = create_booking_dto.events?.find(
        (be) => be.event_id === event.id,
      );
      return total + event.price * (booking_event?.number_of_people || 0);
    }, 0);

    return booking_price + additional_options_price + events_price;
  }

  private calculateBookingPrice({
    booking_variant,
    create_booking_dto,
  }: {
    booking_variant: BookingVariant;
    create_booking_dto: CreateBookingDto;
  }): number {
    // Calculate the number of days of stay
    const start_date = new Date(create_booking_dto.start);
    const end_date = new Date(create_booking_dto.end);
    const time_diff = end_date.getTime() - start_date.getTime();
    const days_count = Math.ceil(time_diff / (1000 * 3600 * 24)); // Number of days

    return booking_variant.price * days_count;
  }
}
