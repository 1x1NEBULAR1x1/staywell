import { Module } from "@nestjs/common";
import { CrudService, ListService } from "./services";
import { EventImagesController } from "./controller";

@Module({
  controllers: [EventImagesController],
  providers: [CrudService, ListService],
  exports: [CrudService, ListService],
})
export class EventImagesModule { }
