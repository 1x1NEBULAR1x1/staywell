import { BaseFiltersDto, ToDate, ToUUID } from 'src/lib/common';
import { ReservationsFilters } from '@shared/src/types/bookings-section';
import { Reservation } from '@shared/src/database';

export class ReservationsFiltersDto
  extends BaseFiltersDto<Reservation>
  implements ReservationsFilters
{
  @ToUUID({
    required: false,
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user_id?: string;

  @ToUUID({
    required: false,
    description: 'Apartment ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  apartment_id?: string;

  @ToDate({
    required: false,
    description: 'Check-in date start',
    example: '2025-01-01',
  })
  check_in_date_start?: Date;

  @ToDate({
    required: false,
    description: 'Check-in date end',
    example: '2025-01-01',
  })
  check_in_date_end?: Date;

  @ToDate({
    required: false,
    description: 'Check-out date start',
    example: '2025-01-01',
  })
  check_out_date_start?: Date;

  @ToDate({
    required: false,
    description: 'Check-out date end',
    example: '2025-01-01',
  })
  check_out_date_end?: Date;
}
