import { ToString } from 'src/lib/common';

export class ChangePasswordDto {
  @ToString({
    required: true,
    description: 'Current password',
    min: 8,
    max: 1024,
  })
  current_password!: string;

  @ToString({
    required: true,
    description: 'New password',
    min: 8,
    max: 1024,
    is_strong_password: true
  })
  new_password!: string;
}
