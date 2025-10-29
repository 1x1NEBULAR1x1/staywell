import { Module } from '@nestjs/common';
import { ReviewsController } from './controller';
import { ListService, CrudService } from './services';

@Module({
  controllers: [ReviewsController],
  providers: [ListService, CrudService],
  exports: [ListService, CrudService],
})
export class ReviewsModule {}
