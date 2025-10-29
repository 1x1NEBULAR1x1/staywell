import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from './create.dto';
import { UpdateEvent } from '@shared/src/types/events-section/dto.types';
import { ToBoolean } from 'src/lib/common';

export class UpdateEventDto
  extends PartialType(CreateEventDto)
  implements UpdateEvent
{
  @ToBoolean({
    required: false,
    description: 'Is event excluded',
    example: false,
  })
  is_excluded?: boolean;
}
