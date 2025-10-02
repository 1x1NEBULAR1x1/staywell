import { ToInt, ToUUID } from "src/lib/common";
import { CreateApartmentBed } from "@shared/src/types/apartments-section";

export class CreateApartmentBedDto implements CreateApartmentBed {
  @ToUUID({ required: true, description: "Apartment ID", example: "550e8400-e29b-41d4-a716-446655440000" })
  apartment_id!: string;

  @ToUUID({ required: true, description: "Bed ID", example: "550e8400-e29b-41d4-a716-446655440001" })
  bed_type_id!: string;

  @ToInt({ required: true, min: 1, description: "Count of beds", example: 1 })
  count!: number;
}
