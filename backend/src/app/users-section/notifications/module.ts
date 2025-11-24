import { Module } from '@nestjs/common';
import { NotificationsController } from './controller';
import { CrudService, ListService } from './services';

@Module({
  controllers: [NotificationsController],
  providers: [CrudService, ListService],
  exports: [CrudService, ListService],
})
export class NotificationsModule { }
