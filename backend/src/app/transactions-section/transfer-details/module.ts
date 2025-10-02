import { Module } from "@nestjs/common";
import { CrudService, ListService } from "./services";
import { TransferDetailsController } from "./controller";

@Module({
  controllers: [TransferDetailsController],
  providers: [CrudService, ListService],
  exports: [CrudService, ListService],
})
export class TransferDetailsModule { }
