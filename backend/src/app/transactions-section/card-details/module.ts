import { Module } from '@nestjs/common';
import { CardDetailsController } from './controller';
import { CrudService, ListService } from './services';

@Module({
  controllers: [CardDetailsController],
  providers: [CrudService, ListService],
  exports: [CrudService, ListService],
})
export class CardDetailsModule {}
