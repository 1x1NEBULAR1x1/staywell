import { Module } from "@nestjs/common";
import { UsersController } from "./controller";
import { ListService, CrudService } from "./services";

@Module({
  controllers: [UsersController],
  providers: [ListService, CrudService],
  exports: [ListService, CrudService],
})
export class UsersModule { }
