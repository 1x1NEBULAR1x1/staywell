import { ToInt, ToUUID } from 'src/lib/common';
import { BaseFiltersDto } from 'src/lib/common';
import { BookingAdditionalOption } from '@shared/src/database';
import { BookingAdditionalOptionsFilters } from '@shared/src/types/bookings-section';

export class BookingAdditionalOptionsFiltersDto
  extends BaseFiltersDto<BookingAdditionalOption>
  implements BookingAdditionalOptionsFilters
{
  @ToUUID({
    required: false,
    description: 'Booking ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  booking_id?: string;

  @ToUUID({
    required: false,
    description: 'Option ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  option_id?: string;

  @ToInt({
    required: false,
    description: 'Minimum amount',
    example: 1,
    positive: true,
  })
  min_amount?: number;

  @ToInt({
    required: false,
    description: 'Maximum amount',
    example: 10,
    positive: true,
  })
  max_amount?: number;
}
