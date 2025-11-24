import { Module } from '@nestjs/common';
import { ApartmentsController } from './controller';
import {
  CrudService,
  ListService,
  AvailabilityService,
  AvailableListService,
  DatesConfigService,
  EventsConfigService,
} from './services';
import { CheckService } from './services/check.service';

@Module({
  controllers: [ApartmentsController],
  providers: [
    CrudService,
    ListService,
    CheckService,
    AvailabilityService,
    AvailableListService,
    DatesConfigService,
    EventsConfigService,
  ],
  exports: [
    CrudService,
    ListService,
    AvailabilityService,
    AvailableListService,
    DatesConfigService,
    EventsConfigService,
  ],
})
export class ApartmentsModule {}
