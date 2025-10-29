import { ToInt } from 'src/lib/common';

export class GetChatsDto {
  @ToInt({
    required: false,
    description: 'Skip chats count for pagination',
    example: 0,
    min: 0,
  })
  skip?: number = 0;

  @ToInt({
    required: false,
    description: 'Take chats count for pagination',
    example: 50,
    min: 1,
    max: 100,
  })
  take?: number = 50;
}
