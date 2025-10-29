import { PartialType } from '@nestjs/swagger';
import { CreateApartmentImageDto } from './create.dto';
import { UpdateApartmentImage } from '@shared/src/types/apartments-section';
import { ToBoolean } from 'src/lib/common';

export class UpdateApartmentImageDto
  extends PartialType(CreateApartmentImageDto)
  implements UpdateApartmentImage
{
  @ToBoolean({ required: false, description: 'Is excluded', example: false })
  is_excluded?: boolean;
}
