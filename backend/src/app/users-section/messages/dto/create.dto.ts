import { ToString, ToUUID } from "src/lib/common";
import { CreateMessage } from "@shared/src/types/users-section";

export class CreateMessageDto implements CreateMessage {
  @ToUUID({ required: true, description: "Receiver ID", example: "123e4567-e89b-12d3-a456-426614174000" })
  receiver_id!: string;

  @ToString({ required: true, description: "Message", example: "Hello, how are you?", min: 1, max: 2000 })
  message!: string;

  @ToUUID({ required: false, description: "Booking ID", example: "123e4567-e89b-12d3-a456-426614174000" })
  booking_id?: string;
}

