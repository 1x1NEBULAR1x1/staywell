import { ToString, ToUrl, ToDecimal } from 'src/lib/common';
import { CreateAdditionalOption } from '@shared/src/types/bookings-section';

export class CreateAdditionalOptionDto implements CreateAdditionalOption {
  @ToString({
    required: true,
    description: 'Option name',
    example: 'Breakfast',
    min: 3,
    max: 1024,
  })
  name!: string;

  @ToString({
    required: true,
    description: 'Option description',
    example: 'Continental breakfast served from 7am to 10am',
    min: 3,
    max: 4096,
  })
  description!: string;

  @ToUrl({
    required: false,
    description: 'Option image URL',
    example: 'https://example.com/images/breakfast.jpg',
  })
  image?: string;

  @ToDecimal({
    required: true,
    min: 0,
    description: 'Option price',
    example: 15.99,
    precision: 2,
    positive: true,
  })
  price!: number;
}
