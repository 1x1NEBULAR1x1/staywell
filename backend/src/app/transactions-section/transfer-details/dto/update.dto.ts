import { ToBoolean } from "src/lib/common";
import { UpdateTransferDetail } from "@shared/src/types/transactions-section/dto.types";
import { CreateTransferDetailDto } from "./create.dto";
import { PartialType } from "@nestjs/swagger";


export class UpdateTransferDetailDto extends PartialType(CreateTransferDetailDto) implements UpdateTransferDetail {
  @ToBoolean({ required: false, description: "Is transfer detail excluded", example: false })
  is_excluded?: boolean;
}