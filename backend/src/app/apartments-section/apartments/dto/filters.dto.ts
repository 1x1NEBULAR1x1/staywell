import {
  BaseFiltersDto,
  ToBoolean,
  ToDate,
  ToDecimal,
  ToEnum,
  ToInt,
} from 'src/lib/common';
import { ApartmentsFilters } from '@shared/src/types/apartments-section';
import { ApartmentType, Apartment } from '@shared/src/database';

export class ApartmentsFiltersDto
  extends BaseFiltersDto<Apartment>
  implements ApartmentsFilters {
  @ToDecimal({
    required: false,
    description: 'Minimum price',
    example: 100,
    precision: 2,
  })
  min_price?: number;

  @ToDecimal({
    required: false,
    description: 'Maximum price',
    example: 100,
    precision: 2,
  })
  max_price?: number;

  @ToInt({
    required: false,
    min: 1,
    description: 'Minimum capacity',
    example: 1,
  })
  min_capacity?: number;

  @ToInt({
    required: false,
    min: 1,
    description: 'Maximum capacity',
    example: 1,
  })
  max_capacity?: number;

  @ToInt({ required: false, min: 1, description: 'Count of rooms', example: 1 })
  rooms_count?: number;

  @ToInt({
    required: false,
    min: 1,
    description: 'Apartment floor',
    example: 1,
  })
  floor?: number;

  @ToInt({
    required: false,
    min: 1,
    description: 'Number of guests',
    example: 1,
  })
  guests?: number;

  @ToBoolean({
    required: false,
    description: 'Is apartment active',
    example: true,
  })
  is_available?: boolean;

  @ToBoolean({
    required: false,
    description: 'Is apartment smoking allowed',
    example: true,
  })
  is_smoking?: boolean;

  @ToBoolean({
    required: false,
    description: 'Is apartment pet friendly',
    example: true,
  })
  is_pet_friendly?: boolean;

  @ToEnum({
    required: false,
    description: 'Apartment type',
    example: ApartmentType.BUDGET,
    enum: ApartmentType,
    enumName: 'ApartmentType',
  })
  type?: ApartmentType;

  @ToDate({
    required: false,
    min_date: new Date(Date.now()),
    description: 'Start date',
    example: '2025-01-01',
  })
  start?: Date;

  @ToDate({
    required: false,
    min_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    description: 'End date',
    example: '2025-01-01',
  })
  end?: Date;

  @ToBoolean({
    required: false,
    default: true,
    description: 'Check availability for dates',
    example: true,
  })
  check_availability?: boolean;
}
