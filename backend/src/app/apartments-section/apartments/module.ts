import { Module } from "@nestjs/common";
import { ApartmentsController } from "./controller";
import {
  CrudService,
  ListService,
  AvailabilityService,
  AvailableListService,
} from "./services";
import { CheckService } from "./services/check.service";

@Module({
  controllers: [ApartmentsController],
  providers: [
    CrudService,
    ListService,
    CheckService,
    AvailabilityService,
    AvailableListService,
  ],
  exports: [
    CrudService,
    ListService,
    AvailabilityService,
    AvailableListService,
  ],
})
export class ApartmentsModule { }
