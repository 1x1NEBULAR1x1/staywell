import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserWithoutPassword } from '@shared/src';
import { AuthenticatedRequest } from '@shared/src/types/users-section';

/**
 * Декоратор для получения данных текущего пользователя из запроса
 * Использует типизацию для корректного возврата значения в зависимости от параметра
 */
export const Auth = createParamDecorator(
  (
    data: keyof UserWithoutPassword | undefined,
    ctx: ExecutionContext,
  ): UserWithoutPassword | UserWithoutPassword[keyof UserWithoutPassword] => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthenticatedRequest }>();
    const user: UserWithoutPassword = request.user.user;
    return data ? user[data] : user;
  },
);
