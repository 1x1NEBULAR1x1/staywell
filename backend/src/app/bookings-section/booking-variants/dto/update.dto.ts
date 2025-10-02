import { PartialType } from "@nestjs/swagger";
import { CreateBookingVariantDto } from "./create.dto";
import { UpdateBookingVariant } from "@shared/src/types/bookings-section";
import { ToBoolean } from "src/lib/common";


export class UpdateBookingVariantDto extends PartialType(CreateBookingVariantDto) implements UpdateBookingVariant {
  @ToBoolean({ required: false, description: "Is excluded", example: false })
  is_excluded?: boolean;
}