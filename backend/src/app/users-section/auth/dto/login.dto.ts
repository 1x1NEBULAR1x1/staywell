import { ToString } from 'src/lib/common';
import { Login } from '@shared/src/types/users-section';

export class LoginDto implements Login {
  @ToString({
    required: true,
    description: 'Email',
    example: 'user@example.com',
    min: 3,
    max: 255,
    matches: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  })
  email!: string;

  @ToString({
    required: true,
    description: 'Password',
    example: 'P@ssword123',
    min: 8,
    max: 1024,
    is_strong_password: true,
  })
  password!: string;
}
