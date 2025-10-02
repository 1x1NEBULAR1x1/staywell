import { ToString, ToUrl } from "src/lib/common";
import { CreateBedType } from "@shared/src/types/apartments-section";

export class CreateBedTypeDto implements CreateBedType {
  @ToString({ required: true, description: "Name", example: "Single Bed", min: 1, max: 1024 })
  name!: string;

  @ToUrl({ required: false, description: "Image", example: "https://example.com/image.jpg" })
  image?: string;
}
