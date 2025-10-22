import { ToBoolean, ToUUID } from "src/lib/common";
import { MessagesFilters } from "@shared/src/types/users-section";
import { BaseFiltersDto } from "src/lib/common/base-filters.dto";
import { Message } from "@shared/src";

export class MessagesFiltersDto extends BaseFiltersDto<Message> implements MessagesFilters {
  @ToUUID({ required: false, description: "Sender ID", example: "123e4567-e89b-12d3-a456-426614174000" })
  sender_id?: string;

  @ToUUID({ required: false, description: "Receiver ID", example: "123e4567-e89b-12d3-a456-426614174000" })
  receiver_id?: string;

  @ToUUID({ required: false, description: "Chat partner ID (sender or receiver)", example: "123e4567-e89b-12d3-a456-426614174000" })
  chat_partner_id?: string;

  @ToBoolean({ required: false, description: "Is read", example: true })
  is_read?: boolean;

  @ToUUID({ required: false, description: "Booking ID", example: "123e4567-e89b-12d3-a456-426614174000" })
  booking_id?: string;
}


