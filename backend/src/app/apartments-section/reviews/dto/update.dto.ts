import { PartialType } from '@nestjs/swagger';
import { UpdateReview } from '@shared/src/types/apartments-section';
import { CreateReviewDto } from './create.dto';
import { ToBoolean } from 'src/lib/common';

export class UpdateReviewDto
  extends PartialType(CreateReviewDto)
  implements UpdateReview
{
  @ToBoolean({ required: false, description: 'Is excluded', example: false })
  is_excluded?: boolean;
}
