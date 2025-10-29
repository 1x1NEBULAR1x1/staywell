import { ToUUID } from 'src/lib/common';

export class JoinChatDto {
  @ToUUID({
    required: true,
    description: 'Chat partner ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  chat_partner_id!: string;
}
