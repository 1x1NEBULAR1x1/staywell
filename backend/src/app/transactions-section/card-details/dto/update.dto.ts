import { PartialType } from "@nestjs/swagger";
import { CreateCardDetailDto } from "./create.dto";
import { UpdateCardDetail } from "@shared/src/types/transactions-section/dto.types";
import { ToBoolean } from "src/lib/common";


export class UpdateCardDetailDto extends PartialType(CreateCardDetailDto) implements UpdateCardDetail {
  @ToBoolean({ required: false, description: "Is card detail excluded", example: false })
  is_excluded?: boolean;
}
