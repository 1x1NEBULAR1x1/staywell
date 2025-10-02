import { Module } from "@nestjs/common";
import { AmenitiesController } from "./controller";
import { CrudService, ListService } from "./services";
import { PrismaModule } from "src/lib/prisma";

@Module({
  controllers: [AmenitiesController],
  providers: [CrudService, ListService],
  exports: [CrudService, ListService],
})
export class AmenitiesModule { }
