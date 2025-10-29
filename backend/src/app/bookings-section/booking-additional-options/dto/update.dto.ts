import { CreateBookingAdditionalOptionDto } from './create.dto';
import { UpdateBookingAdditionalOption } from '@shared/src/types/bookings-section';
import { PartialType } from '@nestjs/swagger';

export class UpdateBookingAdditionalOptionDto
  extends PartialType(CreateBookingAdditionalOptionDto)
  implements UpdateBookingAdditionalOption {}
