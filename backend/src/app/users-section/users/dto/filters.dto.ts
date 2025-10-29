import { ToBoolean, BaseFiltersDto } from 'src/lib/common';
import { Role, User } from '@shared/src/database';
import { ToEnum, ToString } from 'src/lib/common';
import {
  UserWithoutPassword,
  UsersFilters,
} from '@shared/src/types/users-section';

export class UsersFiltersDto
  extends BaseFiltersDto<UserWithoutPassword>
  implements UsersFilters {
  @ToEnum({
    required: false,
    description: 'By role',
    example: Role.ADMIN,
    enum: Role,
    enumName: 'Role',
  })
  role?: Role;

  @ToBoolean({
    required: false,
    description: 'By phone verified',
    example: false,
  })
  phone_verified?: boolean;

  @ToBoolean({
    required: false,
    description: 'By email verified',
    example: false,
  })
  email_verified?: boolean;

  @ToString({
    required: false,
    description: 'By email',
    example: 'user@example.com',
    min: 3,
    max: 1024,
    matches: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  })
  email?: string;

  @ToString({
    required: false,
    description: 'By phone number',
    example: '+12345678901',
    min: 1,
    max: 1024,
  })
  phone_number?: string;

  @ToBoolean({ required: false, description: 'By is active', example: false })
  is_active?: boolean = true;
}
