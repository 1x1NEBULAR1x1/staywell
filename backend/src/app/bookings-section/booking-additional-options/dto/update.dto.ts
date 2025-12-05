import { CreateBookingAdditionalOptionDto } from './create.dto';
import { UpdateBookingAdditionalOption } from '@shared/src/types/bookings-section';
import { PartialType } from '@nestjs/swagger';
import { ToUUID } from 'src/lib/common';

export class UpdateBookingAdditionalOptionDto
  extends PartialType(CreateBookingAdditionalOptionDto)
  implements UpdateBookingAdditionalOption
{
  @ToUUID({
    required: true,
    description: 'Booking ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  booking_id?: string;
}
