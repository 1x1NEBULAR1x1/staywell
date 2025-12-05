import { Module } from '@nestjs/common';
import { CrudService, StatusService, ListService } from './services';
import { BookingsController } from './controller';
import { NotificationsModule } from 'src/app/users-section/notifications/module';
import { BookingVariantsModule } from '../booking-variants/module';

@Module({
  imports: [NotificationsModule, BookingVariantsModule],
  controllers: [BookingsController],
  providers: [CrudService, StatusService, ListService],
  exports: [CrudService, StatusService, ListService],
})
export class BookingsModule {}
