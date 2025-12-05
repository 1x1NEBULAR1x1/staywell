import { Injectable } from '@nestjs/common';
import { User, Transaction } from '@shared/src';
import { CreateBookingDto } from '../../bookings-section/bookings/dto';
import { StripeService } from '../../../lib/providers/stripe/stripe.service';
import { BookingsCheckoutService } from './bookings.checkout.service';
import { EventsCheckoutService } from './events.checkout.service';
import { CreateBookingEventDto } from 'src/app/events-section/booking-events/dto/create.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CheckoutsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly stripeService: StripeService,
    private readonly bookingsCheckoutService: BookingsCheckoutService,
    private readonly eventsCheckoutService: EventsCheckoutService,
  ) {}

  async event({
    create_booking_event_dtos,
    user,
  }: {
    create_booking_event_dtos: CreateBookingEventDto[];
    user: User;
  }): Promise<{ session_url: string | null; transaction: Transaction }> {
    const { transaction, events } =
      await this.eventsCheckoutService.createEventsCheckout({
        event_checkout_dtos: create_booking_event_dtos,
        user,
      });

    // Create Stripe checkout session
    const session = await this.stripeService.createEventSession({
      create_booking_event_dtos: events,
      user,
      transaction,
      access_url: this.configService.get('FRONTEND_URL') + '/events/membership',
      cancel_url: this.configService.get('FRONTEND_URL') + '/events/pending',
    });

    return {
      session_url: session.url,
      transaction,
    };
  }

  async booking({
    user,
    create_booking_dto,
  }: {
    user: User;
    create_booking_dto: CreateBookingDto;
  }): Promise<{ session_url: string | null; transaction: Transaction }> {
    const { transaction, booking } =
      await this.bookingsCheckoutService.createBookingCheckout({
        create_booking_dto,
        user,
      });

    // Create Stripe checkout session
    const session = await this.stripeService.createBookingSession({
      create_booking_dto,
      booking_id: booking.id,
      user,
      transaction,
      access_url:
        this.configService.get('FRONTEND_URL') +
        `/bookings/${booking.id}/success`,
      cancel_url:
        this.configService.get('FRONTEND_URL') +
        `/bookings/${booking.id}/pending`,
    });

    return {
      session_url: session.url,
      transaction,
    };
  }
}
