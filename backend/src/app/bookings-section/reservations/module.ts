import { Module } from '@nestjs/common';
import { ReservationsController } from './controller';
import { CrudService, ListService } from './services';

@Module({
  controllers: [ReservationsController],
  providers: [CrudService, ListService],
  exports: [CrudService, ListService],
})
export class ReservationsModule {}
