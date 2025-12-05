import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateBookingDto } from 'src/app/bookings-section/bookings/dto';
import { Transaction, User, Event } from '@shared/src/database';
import Stripe from 'stripe';
import { CrudService as EventCrudService } from 'src/app/events-section/events/services/crud.service';
import { CrudService as AdditionalOptionCrudService } from 'src/app/bookings-section/additional-options/services/crud.service';
import { CrudService as BookingVariantCrudService } from 'src/app/bookings-section/booking-variants/services/crud.service';
import { ImagePaths } from '@shared/src/common/image-paths.enum';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventService: EventCrudService,
    private readonly additionalOptionService: AdditionalOptionCrudService,
    private readonly bookingVariantService: BookingVariantCrudService,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow('STRIPE_SECRET_KEY'),
    );
  }

  private getProductImageUrl(image: string): string {
    // If the image is an external link, return it as is
    if (image.startsWith('http')) return image;
    // Otherwise it is a local file, so we need to form the full URL
    return `${this.configService.getOrThrow('STATIC_URL')}/${ImagePaths.EVENTS}/${image}`;
  }

  async createEventSession({
    create_booking_event_dtos,
    user,
    transaction,
    access_url,
    cancel_url,
  }: {
    create_booking_event_dtos: { event: Event; number_of_people: number }[];
    user: User;
    transaction: Transaction;
    access_url: string;
    cancel_url: string;
  }) {
    const line_items = this.createEventLineItems({
      create_booking_event_dtos,
    });

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik'],
      metadata: {
        transaction_id: transaction.id,
        user_id: user.id,
        booking_event_ids: create_booking_event_dtos
          .map((event) => event.event.id)
          .join(', '),
      },
      line_items,
      mode: 'payment',
      success_url: access_url,
      cancel_url: cancel_url,
    });

    return session;
  }

  async createBookingSession({
    create_booking_dto,
    booking_id,
    user,
    transaction,
    access_url,
    cancel_url,
  }: {
    create_booking_dto: CreateBookingDto;
    booking_id: string;
    user: User;
    transaction: Transaction;
    access_url: string;
    cancel_url: string;
  }) {
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      await this.createBookingLineItems({ create_booking_dto });

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik'],
      line_items,
      mode: 'payment',
      success_url: access_url,
      cancel_url: cancel_url,
      metadata: {
        transaction_id: transaction.id,
        user_id: user.id,
        booking_id: create_booking_dto.booking_variant_id,
      },
    });

    return session;
  }

  private async createBookingLineItems({
    create_booking_dto,
  }: {
    create_booking_dto: CreateBookingDto;
  }): Promise<Stripe.Checkout.SessionCreateParams.LineItem[]> {
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Add the main booking variant
    const booking_variant = await this.bookingVariantService.find({
      where: { id: create_booking_dto.booking_variant_id },
    });
    const start_date = new Date(create_booking_dto.start);
    const end_date = new Date(create_booking_dto.end);
    const days_count = Math.ceil(
      (end_date.getTime() - start_date.getTime()) / (1000 * 3600 * 24),
    );

    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Booking: ${booking_variant.apartment.name}`,
          images: this.configService.getOrThrow('IS_DEV')
            ? [this.getProductImageUrl(booking_variant.apartment.image)]
            : undefined,
          description: `Accommodation from ${start_date.toDateString()} to ${end_date.toDateString()}`,
          tax_code: 'txcd_20030000',
        },
        unit_amount: booking_variant.price * 100,
      },
      quantity: days_count,
    });

    const booking_events: { event: Event; number_of_people: number }[] = [];
    for (const booking_event of create_booking_dto.events || []) {
      const event = await this.eventService.find({
        id: booking_event.event_id,
      });
      booking_events.push({
        event,
        number_of_people: booking_event.number_of_people,
      });
    }

    line_items.push(
      ...this.createEventLineItems({
        create_booking_event_dtos: booking_events,
      }),
    );

    // Add additional options
    for (const option_data of create_booking_dto.additional_options || []) {
      const option = await this.additionalOptionService.find({
        id: option_data.additional_option_id,
      });

      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: option.name,
            images: this.configService.getOrThrow('IS_DEV')
              ? [this.getProductImageUrl(option.image)]
              : undefined,
            description: option.description,
            tax_code: 'txcd_20030000',
          },
          unit_amount: option.price * 100,
        },
        quantity: option_data.amount,
      });
    }

    return line_items;
  }

  private createEventLineItems({
    create_booking_event_dtos,
  }: {
    create_booking_event_dtos: { event: Event; number_of_people: number }[];
  }): Stripe.Checkout.SessionCreateParams.LineItem[] {
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    // Add events
    for (const booking_event of create_booking_event_dtos || []) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: booking_event.event.name,
            images: this.configService.getOrThrow('IS_DEV')
              ? [this.getProductImageUrl(booking_event.event.image)]
              : undefined,
            description: booking_event.event.description,
            tax_code: 'txcd_20030000',
          },
          unit_amount: booking_event.event.price * 100,
        },
        quantity: booking_event.number_of_people,
      });
    }
    return line_items;
  }

  async parseRawBodyAsync(
    rawBody: Buffer,
    signature: string,
  ): Promise<Stripe.Event> {
    try {
      return await this.stripe.webhooks.constructEventAsync(
        rawBody,
        signature,
        this.configService.getOrThrow('STRIPE_WEBHOOK_SECRET'),
      );
    } catch {
      throw new BadRequestException('Failed to parse raw body');
    }
  }
}
