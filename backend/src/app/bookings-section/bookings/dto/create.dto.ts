import { CreateBooking } from '@shared/src/types/bookings-section';
import { CreateBookingEventDto } from 'src/app/events-section/booking-events/dto';
import { ToDate, ToNested, ToString, ToUUID } from 'src/lib/common';
import { CreateBookingAdditionalOptionDto } from '../../booking-additional-options/dto';

export class CreateBookingDto implements CreateBooking {
  @ToUUID({
    required: false,
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user_id?: string;

  @ToUUID({
    required: true,
    description: 'Booking variant ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  booking_variant_id!: string;

  @ToString({
    required: false,
    description: 'Message',
    example: 'Example message',
  })
  message?: string;

  @ToDate({
    required: true,
    min_date: new Date(Date.now()),
    description: 'Check-in date',
    example: '2025-01-01',
  })
  start!: Date;

  @ToDate({
    required: true,
    min_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    description: 'Check-out date',
    example: '2025-01-01',
  })
  end!: Date;

  @ToNested({
    type: CreateBookingEventDto,
    required: false,
    description: 'Booking events',
    each: true,
  })
  events: CreateBookingEventDto[] = [];

  @ToNested({
    type: CreateBookingAdditionalOptionDto,
    required: false,
    description: 'Booking additional options',
    each: true,
  })
  additional_options: CreateBookingAdditionalOptionDto[] = [];
}
