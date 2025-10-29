import { ToString, ToUUID } from 'src/lib/common';

export class EditMessageDto {
  @ToUUID({
    required: true,
    description: 'Message ID to edit',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  message_id!: string;

  @ToString({
    required: true,
    description: 'New message content',
    example: 'Hello, how are you? (edited)',
    min: 1,
    max: 2000,
  })
  message!: string;
}
