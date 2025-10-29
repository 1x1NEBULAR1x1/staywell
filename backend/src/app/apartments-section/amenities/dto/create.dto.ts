import { ToString, ToUrl } from 'src/lib/common/decorators/dto';
import { CreateAmenity } from '@shared/src/types/apartments-section';

export class CreateAmenityDto implements CreateAmenity {
  @ToString({
    required: true,
    description: 'Name',
    example: 'Swimming Pool',
    min: 1,
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
    description: 'Description',
    example: 'A swimming pool for guests to enjoy',
    min: 1,
    max: 8192,
  })
  description!: string;
}
