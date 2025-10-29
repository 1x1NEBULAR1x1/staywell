import { ToDecimal, ToString, ToUUID } from 'src/lib/common';
import { CreateReview } from '@shared/src/types/apartments-section';

export class CreateReviewDto implements CreateReview {
  @ToUUID({
    required: true,
    description: 'Apartment ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  apartment_id!: string;

  @ToUUID({
    required: true,
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  user_id!: string;

  @ToUUID({
    required: true,
    description: 'Booking ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  booking_id!: string;

  @ToDecimal({
    required: true,
    description: 'Rating (1-5)',
    example: 4,
    min: 1,
    max: 5,
    precision: 2,
    positive: true,
  })
  rating!: number;

  @ToString({
    required: true,
    description: 'Review comment',
    example: 'Great apartment, excellent service!',
    min: 3,
    max: 4096,
  })
  comment!: string;
}
