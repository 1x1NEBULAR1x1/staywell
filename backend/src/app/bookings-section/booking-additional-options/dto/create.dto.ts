import { ToInt, ToUUID } from 'src/lib/common';
import { CreateBookingAdditionalOption } from '@shared/src/types/bookings-section';

export class CreateBookingAdditionalOptionDto
  implements CreateBookingAdditionalOption
{
  @ToInt({
    required: true,
    min: 1,
    description: 'Amount of options to add',
    example: 2,
  })
  amount!: number;

  @ToUUID({
    required: true,
    description: 'Additional option ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  option_id!: string;

  @ToUUID({
    required: true,
    description: 'Booking ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  booking_id!: string;
}
