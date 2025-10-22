import { CreateMessageDto } from "./create.dto";
import { PartialType } from "@nestjs/swagger";
import { UpdateMessage } from "@shared/src";
import { ToBoolean } from "src/lib/common";

export class UpdateMessageDto extends PartialType(CreateMessageDto) implements UpdateMessage {
  @ToBoolean({ description: 'Is message read', required: false })
  is_read?: boolean
}