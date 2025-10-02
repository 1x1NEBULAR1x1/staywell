import { Module } from "@nestjs/common";
import { CrudService, ListService } from "./services";
import { BookingEventsController } from "./controller";

@Module({
  controllers: [BookingEventsController],
  providers: [CrudService, ListService],
  exports: [CrudService, ListService],
})
export class BookingEventsModule { }
