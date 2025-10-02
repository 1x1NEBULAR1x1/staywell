import { Module } from "@nestjs/common";
import { CrudService, ListService } from "./services";
import { EventsController } from "./controller";

@Module({
  controllers: [EventsController],
  providers: [CrudService, ListService],
  exports: [CrudService, ListService],
})
export class EventsModule { }
