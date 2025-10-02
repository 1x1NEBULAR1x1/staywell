import { ToInt, ToBoolean, ToDecimal, ToUUID } from "src/lib/common";
import { CreateBookingVariant } from "@shared/src/types/bookings-section";


export class CreateBookingVariantDto implements CreateBookingVariant {
  @ToUUID({ required: true, description: "Apartment ID", example: "550e8400-e29b-41d4-a716-446655440000" })
  apartment_id!: string;

  @ToDecimal({ required: true, description: "Price per night", example: 150, precision: 2, positive: true })
  price!: number;

  @ToInt({ required: true, description: "Maximum number of guests", example: 2, min: 1 })
  capacity!: number;

  @ToBoolean({ required: true, default: true, description: "Is the booking variant active", example: true })
  is_available!: boolean;
}
