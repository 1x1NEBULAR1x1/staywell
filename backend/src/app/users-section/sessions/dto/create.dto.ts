import { CreativeOmit } from "@shared/src/common";
import { SessionData } from "@shared/src/types/users-section";
import { ToString, ToUUID } from "src/lib/common";

export interface CreateSession extends Omit<CreativeOmit<SessionData>, "first_name" | "last_name" | "phone_number" | "email" | "is_active" | "email_verified" | "phone_verified" | "role" | "is_excluded" | "created_at" | "expires_at"> { }

export class CreateSessionDto implements CreateSession {
  @ToString({ required: true, description: "User's IP address", example: "192.168.1.1" })
  ip_address!: string;

  @ToString({ required: true, description: "User's borwser User Agent", example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" })
  user_agent!: string;

  @ToUUID({ required: true, description: "User ID", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  user_id!: string;
}
