import { CreateEventImageDto } from "./create.dto";
import { UpdateEventImage } from "@shared/src/types/events-section/dto.types";
import { ToBoolean } from "src/lib/common";
import { PartialType } from "@nestjs/swagger";


export class UpdateEventImageDto extends PartialType(CreateEventImageDto) implements UpdateEventImage {
  @ToBoolean({ required: false, description: "Is excluded", example: false })
  is_excluded?: boolean;
}