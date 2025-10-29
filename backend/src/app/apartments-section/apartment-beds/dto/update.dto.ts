import { PartialType } from '@nestjs/swagger';
import { CreateApartmentBedDto } from './create.dto';
import { UpdateApartmentBed } from '@shared/src/types/apartments-section';
import { ToBoolean } from 'src/lib/common';

export class UpdateApartmentBedDto
  extends PartialType(CreateApartmentBedDto)
  implements UpdateApartmentBed
{
  @ToBoolean({ required: false, description: 'Is excluded', example: false })
  is_excluded?: boolean;
}
