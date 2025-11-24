import { ToBoolean, ToDate, ToInt, ToEnum, ToString } from './decorators';
import { SortDirection, BaseFiltersOptions } from '@shared/src/common';

/**
 * Base class for all DTO filters
 * Contains common pagination and sorting parameters
 */
export class BaseFiltersDto<T extends { id: string }>
  implements BaseFiltersOptions<T>
{
  @ToInt({
    required: false,
    min: 0,
    description: 'Number of items to skip',
    example: 0,
  })
  skip: number = 0;

  @ToInt({
    required: false,
    min: 1,
    description: 'Number of items to take',
    example: 10,
  })
  take: number = 10;

  @ToString({ required: false, description: 'Sort field', example: 'id' })
  sort_field?: keyof T;

  @ToEnum({
    enum: SortDirection,
    required: false,
    description: 'Sort direction',
    example: SortDirection.desc,
    default: SortDirection.desc,
    enumName: 'SortDirection',
  })
  sort_direction?: SortDirection = SortDirection.desc;

  @ToDate({
    required: false,
    description: 'Start date',
    example: '2023-12-01T12:00:00Z',
  })
  start_date?: Date;

  @ToDate({
    required: false,
    description: 'End date',
    example: '2023-12-01T12:00:00Z',
  })
  end_date?: Date;

  @ToBoolean({
    required: false,
    default: false,
    description: 'Is excluded item',
    example: false,
  })
  is_excluded?: boolean = false;

  @ToString({
    required: false,
    description: 'Search',
    example: 'Search by name',
    max: 8192,
  })
  search?: string;
}
