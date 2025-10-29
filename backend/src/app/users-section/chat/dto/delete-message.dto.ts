import { ToUUID } from 'src/lib/common';

export class DeleteMessageDto {
  @ToUUID({
    required: true,
    description: 'Message ID to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  message_id!: string;
}
