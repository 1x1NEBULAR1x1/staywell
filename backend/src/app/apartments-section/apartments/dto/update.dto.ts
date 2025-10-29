import { PartialType } from '@nestjs/swagger';
import { UpdateApartment } from '@shared/src/types/apartments-section';
import { CreateApartmentDto } from './create.dto';
import { ToBoolean } from 'src/lib/common';

export class UpdateApartmentDto
  extends PartialType(CreateApartmentDto)
  implements UpdateApartment
{
  @ToBoolean({ required: false, description: 'Is excluded', example: false })
  is_excluded?: boolean;
}
