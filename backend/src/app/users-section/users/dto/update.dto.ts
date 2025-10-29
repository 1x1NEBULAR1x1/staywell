import { Role } from '@shared/src/database';
import { ToBoolean, ToEnum, ToString, ToUrl } from 'src/lib/common';
import { UpdateUser, AdminUpdateUser } from '@shared/src/types/users-section';

export class UpdateUserDto implements UpdateUser {
  @ToString({
    required: false,
    description: 'New password',
    example: 'newpassword123',
    min: 8,
    max: 1024,
    matches:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  })
  password?: string;

  @ToString({
    required: false,
    description: 'First name',
    example: 'Иван',
    min: 1,
    max: 255,
  })
  first_name?: string;

  @ToString({
    required: false,
    description: 'Last name',
    example: 'Иванов',
    min: 1,
    max: 255,
  })
  last_name?: string;

  @ToString({
    required: false,
    description: 'Phone number',
    example: '+79001234567',
    min: 1,
    max: 1024,
    matches: /^\+[1-9]\d{1,14}$/,
  })
  phone_number?: string;

  @ToUrl({
    required: false,
    description: 'Image',
    example: 'https://example.com/avatar.jpg',
  })
  image?: string;
}

export class AdminUpdateUserDto
  extends UpdateUserDto
  implements AdminUpdateUser {
  @ToString({
    required: false,
    description: 'Email',
    example: 'user@example.com',
    min: 3,
    max: 255,
    matches: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  })
  email?: string;

  @ToEnum({
    required: false,
    description: 'Role',
    example: Role.ADMIN,
    enum: Role,
    enumName: 'Role',
  })
  role?: Role;

  @ToBoolean({ required: false, description: 'Is active', example: true })
  is_active?: boolean;

  @ToBoolean({ required: false, description: 'Phone verified', example: true })
  phone_verified?: boolean;

  @ToBoolean({ required: false, description: 'Email verified', example: true })
  email_verified?: boolean;
}
