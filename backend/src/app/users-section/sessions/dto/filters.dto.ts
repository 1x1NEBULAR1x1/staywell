import { BaseFiltersDto, ToString, ToBoolean } from "src/lib/common";
import { BaseFiltersOptions } from "@shared/src/common";
import { SessionData } from "@shared/src/types/users-section";

export interface SessionFilters extends BaseFiltersOptions<SessionData> {
  user_id?: string;
  is_active?: boolean;
  ip_address?: string;
  user_agent?: string;
}

export class SessionFiltersDto extends BaseFiltersDto<SessionData> implements SessionFilters {
  @ToString({ required: false, description: "By user ID", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  user_id?: string;

  @ToBoolean({ required: false, description: "By 'is_active' status", example: false })
  is_active?: boolean;

  @ToString({ required: false, description: "By ip address", example: "192.168.1.1" })
  ip_address?: string;

  @ToString({ required: false, description: "By browser User Agent", example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" })
  user_agent?: string;
}
