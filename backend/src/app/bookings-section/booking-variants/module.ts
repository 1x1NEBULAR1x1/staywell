import { Module } from '@nestjs/common';
import { BookingVariantsController } from './controller';
import { CrudService, ListService } from './services';

@Module({
  controllers: [BookingVariantsController],
  providers: [CrudService, ListService],
  exports: [CrudService, ListService],
})
export class BookingVariantsModule {}
