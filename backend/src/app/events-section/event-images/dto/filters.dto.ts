import { EventImage } from "@shared/src/database";
import { EventImagesFilters } from "@shared/src/types/events-section/dto.types";
import { BaseFiltersDto, ToString, ToUUID } from "src/lib/common";

export class EventImagesFiltersDto extends BaseFiltersDto<EventImage> implements EventImagesFilters {
  @ToUUID({ required: false, description: "Event ID", example: "550e8400-e29b-41d4-a716-446655440000" })
  event_id?: string;

  @ToString({ required: false, description: "Name", example: "Main photo of the apartment", min: 3, max: 1024 })
  name?: string;

  @ToString({ required: false, description: "Description", example: "Main photo of the apartment", min: 3, max: 8192 })
  description?: string;
}
