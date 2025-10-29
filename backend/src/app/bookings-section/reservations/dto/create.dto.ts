import { ToDate, ToUUID } from 'src/lib/common';
import { CreateReservation } from '@shared/src/types/bookings-section';

export class CreateReservationDto implements CreateReservation {
  @ToUUID({
    required: true,
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user_id!: string;

  @ToUUID({
    required: true,
    description: 'Apartment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  apartment_id!: string;

  @ToDate({
    required: true,
    min_date: new Date(Date.now()),
    description: 'Start date',
    example: '2025-01-01',
  })
  start!: Date;

  @ToDate({
    required: true,
    min_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    description: 'End date',
    example: '2025-01-01',
  }) // Next day from current date
  end!: Date;
}
