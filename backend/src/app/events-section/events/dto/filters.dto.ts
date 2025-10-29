import {
  ToDate,
  ToInt,
  BaseFiltersDto,
  ToUUID,
  ToDecimal,
  ToString,
} from 'src/lib/common';
import { Event } from '@shared/src/database';
import { EventsFilters } from '@shared/src/types/events-section/dto.types';

export class EventsFiltersDto
  extends BaseFiltersDto<Event>
  implements EventsFilters
{
  @ToString({
    required: false,
    description: 'Name',
    example: 'Concert of classical music',
    min: 3,
    max: 1024,
  })
  name?: string;

  @ToString({
    required: false,
    description: 'Description',
    example: 'Concert of classical music',
    min: 3,
    max: 8192,
  })
  description?: string;

  @ToUUID({
    required: false,
    description: 'Guide ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  guide_id?: string;

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

  @ToDate({
    required: false,
    min_date: new Date(Date.now()),
    description: 'Event start date',
    example: '2023-12-15T18:00:00.000Z',
  })
  max_start?: Date;

  @ToDate({
    required: false,
    min_date: new Date(Date.now() + 1000 * 60 * 60 * 24),
    description: 'Event end date',
    example: '2023-12-15T21:00:00.000Z',
  })
  max_end?: Date;

  @ToDate({
    required: false,
    min_date: new Date(Date.now()),
    description: 'Event end date',
    example: '2023-12-15T21:00:00.000Z',
  })
  min_start?: Date;

  @ToDate({
    required: false,
    min_date: new Date(Date.now() + 1000 * 60 * 60 * 24),
    description: 'Event end date',
    example: '2023-12-15T21:00:00.000Z',
  })
  min_end?: Date;
}
