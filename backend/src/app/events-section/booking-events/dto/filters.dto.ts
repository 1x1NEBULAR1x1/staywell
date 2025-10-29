import { BookingEvent } from '@shared/src/database';
import { BookingEventsFilters } from '@shared/src/types/events-section/dto.types';
import { BaseFiltersDto, ToDate, ToInt, ToUUID } from 'src/lib/common';

export class BookingEventsFiltersDto
  extends BaseFiltersDto<BookingEvent>
  implements BookingEventsFilters
{
  @ToUUID({
    required: false,
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  user_id?: string;

  @ToUUID({
    required: false,
    description: 'Booking ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  booking_id?: string;

  @ToUUID({
    required: false,
    description: 'Event ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  event_id?: string;

  @ToUUID({
    required: false,
    description: 'Transaction ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  transaction_id?: string;

  @ToInt({
    required: false,
    description: 'Minimum number of people',
    example: 1,
  })
  min_number_of_people?: number;

  @ToInt({
    required: false,
    description: 'Maximum number of people',
    example: 10,
  })
  max_number_of_people?: number;

  @ToDate({
    required: false,
    description: 'Minimum start date',
    example: '2025-01-01',
  })
  min_start?: Date;

  @ToDate({
    required: false,
    description: 'Maximum start date',
    example: '2025-01-01',
  })
  max_start?: Date;

  @ToDate({
    required: false,
    description: 'Minimum end date',
    example: '2025-01-01',
  })
  min_end?: Date;

  @ToDate({
    required: false,
    description: 'Maximum end date',
    example: '2025-01-01',
  })
  max_end?: Date;
}
