import { Module } from "@nestjs/common";
import { CrudService, StatusService, ListService } from "./services";
import { BookingsController } from "./controller";

@Module({
  controllers: [BookingsController],
  providers: [CrudService, StatusService, ListService],
  exports: [CrudService, StatusService, ListService],
})
export class BookingsModule { }
