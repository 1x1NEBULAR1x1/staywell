import { BaseFiltersDto, ToString, ToUUID } from 'src/lib/common';
import { ApartmentImagesFilters } from '@shared/src/types/apartments-section';
import { ApartmentImage } from '@shared/src/database';

export class ApartmentImagesFiltersDto
  extends BaseFiltersDto<ApartmentImage>
  implements ApartmentImagesFilters
{
  @ToUUID({
    required: false,
    description: 'Apartment ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  apartment_id?: string;

  @ToString({
    required: false,
    description: 'Description',
    example: 'Main photo of the apartment',
    min: 3,
    max: 4096,
  })
  description?: string;

  @ToString({
    required: false,
    description: 'Name',
    example: 'Main photo of the apartment',
    min: 3,
    max: 4096,
  })
  name?: string;
}
