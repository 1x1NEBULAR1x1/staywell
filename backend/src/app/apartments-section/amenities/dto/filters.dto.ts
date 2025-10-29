import { AmenitiesFilters } from '@shared/src/types/apartments-section';
import { BaseFiltersDto, ToString } from 'src/lib/common';
import { Amenity } from '@shared/src/database';

export class AmenitiesFiltersDto
  extends BaseFiltersDto<Amenity>
  implements AmenitiesFilters
{
  @ToString({ required: false, description: 'Name', example: 'Swimming Pool' })
  name?: string;

  @ToString({
    required: false,
    description: 'Description',
    example: 'A swimming pool for guests to enjoy',
  })
  description?: string;
}
