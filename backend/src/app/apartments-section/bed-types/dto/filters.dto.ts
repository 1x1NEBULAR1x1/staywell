import { ToString } from 'src/lib/common';
import { BaseFiltersDto } from 'src/lib/common';
import { BedType } from '@shared/src/database';
import { BedTypesFilters } from '@shared/src/types/apartments-section';

export class BedTypesFiltersDto
  extends BaseFiltersDto<BedType>
  implements BedTypesFilters
{
  @ToString({ required: false, description: 'Name', example: 'Single Bed' })
  name?: string;
}
