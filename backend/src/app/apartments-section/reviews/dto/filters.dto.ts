import { ToDecimal, BaseFiltersDto, ToUUID } from 'src/lib/common';
import { Review } from '@shared/src/database';
import { ReviewsFilters } from '@shared/src/types/apartments-section';

export class ReviewsFiltersDto
  extends BaseFiltersDto<Review>
  implements ReviewsFilters
{
  @ToDecimal({ required: false, min: 1, max: 5, precision: 2, positive: true })
  min_rating?: number;

  @ToUUID({
    required: false,
    description: 'User id',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  user_id?: string;

  @ToUUID({
    required: false,
    description: 'Booking id',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  booking_id?: string;

  @ToUUID({
    required: false,
    description: 'Apartment id',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  apartment_id?: string;
}
