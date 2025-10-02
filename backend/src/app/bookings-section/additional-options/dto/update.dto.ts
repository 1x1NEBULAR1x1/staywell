import { UpdateAdditionalOption } from "@shared/src/types/bookings-section";
import { CreateAdditionalOptionDto } from "./create.dto";
import { ToBoolean } from "src/lib/common";
import { PartialType } from "@nestjs/swagger";


export class UpdateAdditionalOptionDto extends PartialType(CreateAdditionalOptionDto) implements UpdateAdditionalOption {
  @ToBoolean({ required: false, description: "Is excluded", example: false })
  is_excluded?: boolean;
}
