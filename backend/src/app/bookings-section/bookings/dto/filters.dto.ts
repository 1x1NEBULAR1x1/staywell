import { ToDate, BaseFiltersDto, ToEnum, ToUUID } from 'src/lib/common';
import { Booking, BookingStatus } from '@shared/src/database';
import { BookingsFilters } from '@shared/src/types/bookings-section';

export class BookingsFiltersDto
  extends BaseFiltersDto<Booking>
  implements BookingsFilters {
  @ToEnum({
    required: false,
    description: 'Booking status',
    example: BookingStatus.PENDING,
    enum: BookingStatus,
    enumName: 'BookingStatus',
  })
  status?: BookingStatus;

  @ToUUID({
    required: false,
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user_id?: string;

  @ToUUID({
    required: false,
    description: 'Booking variant ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  booking_variant_id?: string;

  @ToUUID({
    required: false,
    description: 'Transaction ID',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  transaction_id?: string;

  @ToDate({
    required: false,
    description: 'Check-in minimum date',
    example: '2025-01-01',
  })
  min_start?: Date;

  @ToDate({
    required: false,
    description: 'Check-in maximum date',
    example: '2025-01-01',
  })
  max_start?: Date;

  @ToDate({
    required: false,
    description: 'Check-out minimum date',
    example: '2025-01-01',
  })
  min_end?: Date;

  @ToDate({
    required: false,
    description: 'Check-out maximum date',
    example: '2025-01-01',
  })
  max_end?: Date;
}
