import { IsString, IsNotEmpty } from 'class-validator';
import { ToUUID, ToString } from 'src/lib/common';

export class CreateSessionDto {
  @ToUUID({
    required: true,
    description: 'User ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  user_id!: string;

  @ToString({
    required: true,
    description: 'IP address',
    example: '127.0.0.1',
  })
  ip_address!: string;

  @ToString({
    required: true,
    description: 'User agent',
    example:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  })
  user_agent!: string;
}
