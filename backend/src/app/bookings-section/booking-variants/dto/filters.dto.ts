import { ToBoolean, ToInt, BaseFiltersDto, ToUUID, ToDecimal } from "src/lib/common";
import { BookingVariant } from "@shared/src/database";
import { BookingVariantsFilters } from "@shared/src/types/bookings-section";

export class BookingVariantsFiltersDto extends BaseFiltersDto<BookingVariant> implements BookingVariantsFilters {
  @ToUUID({ required: false, description: "Apartment ID", example: "550e8400-e29b-41d4-a716-446655440000" })
  apartment_id?: string;

  @ToDecimal({ required: false, description: "Minimum price", example: 100, precision: 2, positive: true })
  min_price?: number;

  @ToDecimal({ required: false, description: "Maximum price", example: 100, precision: 2, positive: true })
  max_price?: number;

  @ToInt({ required: false, min: 1, description: "Minimum capacity", example: 1, positive: true })
  min_capacity?: number;

  @ToInt({ required: false, min: 1, description: "Maximum capacity", example: 1, positive: true })
  max_capacity?: number;

  @ToBoolean({ required: false, description: "Is available", example: true })
  is_available?: boolean;
}
