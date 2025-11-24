import { CreateBookingDto } from './create.dto';
import { UpdateBooking } from '@shared/src/types/bookings-section';
import { PartialType } from '@nestjs/swagger';
import { ToEnum } from 'src/lib/common';
import { BookingStatus } from '@shared/src/database';

export class UpdateBookingDto
  extends PartialType(CreateBookingDto)
  implements UpdateBooking
{
  @ToEnum({
    required: false,
    description: 'Status',
    example: BookingStatus.PENDING,
    enum: BookingStatus,
    enumName: 'BookingStatus',
  })
  status?: BookingStatus;
}
