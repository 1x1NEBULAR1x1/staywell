import { CreateEventImage } from '@shared/src/types/events-section/dto.types';
import { ToString, ToUrl, ToUUID } from 'src/lib/common';

export class CreateEventImageDto implements CreateEventImage {
  @ToString({
    required: true,
    description: 'Name for image',
    example: 'Main photo of the event',
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
    required: false,
    description: 'Description of the image (optional)',
    example: 'Photo of the stage before the event',
    min: 3,
    max: 8192,
  })
  description?: string;

  @ToUUID({
    required: true,
    description: 'Event ID to which the image belongs',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  event_id!: string;
}
