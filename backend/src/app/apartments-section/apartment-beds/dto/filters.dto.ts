import { ToInt, BaseFiltersDto, ToUUID } from "src/lib/common";
import { ApartmentBedsFilters } from "@shared/src/types/apartments-section";
import { ApartmentBed } from "@shared/src/database";

export class ApartmentBedsFiltersDto extends BaseFiltersDto<ApartmentBed> implements ApartmentBedsFilters {
  @ToUUID({ required: false, description: "Apartment ID", example: "550e8400-e29b-41d4-a716-446655440000" })
  apartment_id?: string;

  @ToUUID({ required: false, description: "Bed type ID", example: "550e8400-e29b-41d4-a716-446655440001" })
  bed_type_id?: string;

  @ToInt({ required: false, min: 1, description: "Minimum beds count", example: 1 })
  min_count?: number;

  @ToInt({ required: false, min: 1, description: "Maximum beds count", example: 1 })
  max_count?: number;
}
