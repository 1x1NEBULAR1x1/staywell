import { PartialType } from "@nestjs/swagger";
import { CreateBedTypeDto } from "./create.dto";
import { UpdateBedType } from "@shared/src/types/apartments-section";
import { ToBoolean } from "src/lib/common";


export class UpdateBedTypeDto extends PartialType(CreateBedTypeDto) implements UpdateBedType {
  @ToBoolean({ required: false, description: "Is excluded", example: false })
  is_excluded?: boolean;
}