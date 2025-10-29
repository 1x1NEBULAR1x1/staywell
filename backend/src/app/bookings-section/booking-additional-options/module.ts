import { Module } from '@nestjs/common';
import { BookingAdditionalOptionsController } from './controller';
import { CheckService, CrudService, ListService } from './services';

@Module({
  controllers: [BookingAdditionalOptionsController],
  providers: [CheckService, CrudService, ListService],
  exports: [CheckService, CrudService, ListService],
})
export class BookingAdditionalOptionsModule {}
