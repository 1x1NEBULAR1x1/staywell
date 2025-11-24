import { ToInt } from 'src/lib/common';

export class DatesConfigDto {
  @ToInt({
    required: true,
    min: 2020,
    max: 2030,
    description: 'Year for which to get dates configuration',
    example: 2024,
  })
  year!: number;

  @ToInt({
    required: true,
    min: 1,
    max: 12,
    description: 'Month (1-12) for which to get dates configuration',
    example: 11,
  })
  month!: number;
}



