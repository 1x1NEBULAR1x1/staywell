import { Module } from "@nestjs/common";
import { MessagesController } from "./controller";
import { CrudService, ListService } from "./services";

@Module({
  controllers: [MessagesController],
  providers: [CrudService, ListService],
})
export class MessagesModule { }


