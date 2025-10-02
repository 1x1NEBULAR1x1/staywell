import { CreateApartmentAmenity } from "@shared/src/types/apartments-section";
import { ToUUID } from "src/lib/common";


export class CreateApartmentAmenityDto implements CreateApartmentAmenity {
  @ToUUID({ required: true, description: "Amenity ID", example: "550e8400-e29b-41d4-a716-446655440000" })
  amenity_id!: string;

  @ToUUID({ required: true, description: "Apartment ID", example: "550e8400-e29b-41d4-a716-446655440001" })
  apartment_id!: string;
}
