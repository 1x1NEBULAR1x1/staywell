import {
  ToDate,
  ToInt,
  ToDecimal,
  ToUrl,
  ToString,
  ToUUID,
} from 'src/lib/common';
import { CreateEvent } from '@shared/src/types/events-section/dto.types';

export class CreateEventDto implements CreateEvent {
  @ToString({
    required: true,
    description: 'Name of the event',
    example: 'Concert of classical music',
    min: 3,
    max: 1024,
  })
  name!: string;

  @ToUrl({
    required: false,
    description: 'Image URL',
    example: 'https://example.com/image.jpg',
  })
  image?: string;

  @ToString({
    required: true,
    description: 'Description of the event',
    example:
      'Great concert of classical music with participation of the best musicians of the city',
    min: 3,
    max: 8192,
  })
  description!: string;

  @ToUUID({
    required: false,
    description: 'Guide ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  guide_id?: string;

  @ToDecimal({
    required: true,
    min: 0,
    description: 'Price of participation in the event',
    example: 1500.5,
  })
  price!: number;

  @ToInt({
    required: true,
    min: 1,
    description: 'Maximum number of participants',
    example: 50,
  })
  capacity!: number;

  @ToDate({
    required: true,
    min_date: new Date(Date.now()),
    description: 'Date and time of the start of the event',
    example: '2023-12-15T18:00:00.000Z',
  })
  start!: Date;

  @ToDate({
    required: true,
    min_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    description: 'Date and time of the end of the event',
    example: '2023-12-15T21:00:00.000Z',
  })
  end!: Date;
}
