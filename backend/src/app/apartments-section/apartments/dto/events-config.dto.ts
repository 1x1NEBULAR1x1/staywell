import { ToDate } from 'src/lib/common';

export class EventsConfigDto {
  @ToDate({
    required: true,
    min_date: new Date(Date.now()),
    description: 'Start date of the booking period',
    example: '2024-11-20',
  })
  start_date!: Date;

  @ToDate({
    required: true,
    min_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    description: 'End date of the booking period',
    example: '2024-11-25',
  })
  end_date!: Date;
}



