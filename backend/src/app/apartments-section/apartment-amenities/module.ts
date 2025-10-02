import { Module } from "@nestjs/common";
import { ApartmentAmenitiesController } from "./controller";
import { CrudService, ListService } from "./services";

@Module({
  controllers: [ApartmentAmenitiesController],
  providers: [CrudService, ListService],
  exports: [CrudService, ListService],
})
export class ApartmentAmenitiesModule { }
