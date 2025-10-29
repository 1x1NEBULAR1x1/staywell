import { Module } from '@nestjs/common';
import { EventsModule } from './events/module';
import { EventImagesModule } from './event-images/module';
import { BookingEventsModule } from './booking-events/module';

@Module({
  imports: [BookingEventsModule, EventImagesModule, EventsModule],
  exports: [EventsModule, BookingEventsModule, EventImagesModule],
})
export class EventsSectionModule {}
