import { ToUrl, ToString, ToUUID } from "src/lib/common";
import { CreateApartmentImage } from "@shared/src/types/apartments-section";

export class CreateApartmentImageDto implements CreateApartmentImage {
  @ToUrl({ required: false, description: "Image URL", example: "https://example.com/image.jpg" })
  image?: string;

  @ToString({ required: true, description: "Name for image", example: "Main photo of the apartment", min: 3, max: 1024 })
  name!: string;

  @ToString({ required: false, description: "Description for image", example: "Main photo of the apartment", min: 3, max: 4096 })
  description: string | null = null;

  @ToUUID({ required: true, description: "Apartment ID image for" })
  apartment_id!: string;
}
