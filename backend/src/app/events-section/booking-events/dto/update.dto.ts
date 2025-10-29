import { UpdateBookingEvent } from '@shared/src/types/events-section/dto.types';
import { PartialType } from '@nestjs/swagger';
import { CreateBookingEventDto } from './create.dto';
import { ToBoolean } from 'src/lib/common';

export class UpdateBookingEventDto
  extends PartialType(CreateBookingEventDto)
  implements UpdateBookingEvent
{
  @ToBoolean({ required: false, description: 'Is excluded', example: false })
  is_excluded?: boolean;
}
