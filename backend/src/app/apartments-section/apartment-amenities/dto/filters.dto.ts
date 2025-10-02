import { BaseFiltersDto, ToUUID } from "src/lib/common";
import { ApartmentAmenitiesFilters } from "@shared/src/types/apartments-section";
import { ApartmentAmenity } from "@shared/src/database";


export class ApartmentAmenitiesFiltersDto extends BaseFiltersDto<ApartmentAmenity> implements ApartmentAmenitiesFilters {
  @ToUUID({ required: false, description: "Apartment ID", example: "550e8400-e29b-41d4-a716-446655440000" })
  apartment_id?: string;

  @ToUUID({ required: false, description: "Amenity ID", example: "550e8400-e29b-41d4-a716-446655440001" })
  amenity_id?: string;
}
