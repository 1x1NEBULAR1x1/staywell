import { CreateTransactionDto } from "./create.dto";
import { UpdateTransaction } from "@shared/src/types/transactions-section/dto.types";
import { ToBoolean } from "src/lib/common";
import { PartialType } from "@nestjs/swagger";


export class UpdateTransactionDto extends PartialType(CreateTransactionDto) implements UpdateTransaction {
  @ToBoolean({ required: false, description: "Is excluded", example: false })
  is_excluded?: boolean;
}