import { ToDate } from 'src/lib/common';
import { DateRange } from '@shared/src/types/apartments-section';

export class DateRangeDto implements DateRange {
  @ToDate({
    required: true,
    min_date: new Date(Date.now()),
    description: 'Start date of the date range',
    example: '2023-01-01',
  })
  start_date!: Date;

  @ToDate({
    required: true,
    min_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    description: 'End date of the date range',
    example: '2023-01-05',
  })
  end_date!: Date;
}
