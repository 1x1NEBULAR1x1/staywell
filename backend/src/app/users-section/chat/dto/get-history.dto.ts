import { ToInt, ToUUID } from 'src/lib/common';

export class GetHistoryDto {
  @ToUUID({
    required: true,
    description: 'Chat partner ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  chat_partner_id!: string;

  @ToInt({
    required: false,
    description: 'Skip messages count for pagination',
    example: 0,
    min: 0,
  })
  skip?: number = 0;

  @ToInt({
    required: false,
    description: 'Take messages count for pagination',
    example: 50,
    min: 1,
    max: 100,
  })
  take?: number = 50;
}
