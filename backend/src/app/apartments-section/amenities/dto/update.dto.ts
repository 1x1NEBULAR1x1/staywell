import { UpdateAmenity } from '@shared/src/types/apartments-section';
import { PartialType } from '@nestjs/swagger';
import { CreateAmenityDto } from './create.dto';
import { ToBoolean } from 'src/lib/common';

export class UpdateAmenityDto
  extends PartialType(CreateAmenityDto)
  implements UpdateAmenity
{
  @ToBoolean({
    required: false,
    description: 'Is Amenity excluded',
    example: false,
  })
  is_excluded?: boolean;
}
