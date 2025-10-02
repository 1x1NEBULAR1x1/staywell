import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "@shared/src/database";
import { AuthenticatedRequest } from "@shared/src/types/users-section";

/**
 * Декоратор для получения данных текущего пользователя из запроса
 * Использует типизацию для корректного возврата значения в зависимости от параметра
 */
export const Auth = createParamDecorator(
  (
    data: keyof User | undefined,
    ctx: ExecutionContext,
  ): User | User[keyof User] => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user: User = request.user;
    return data ? user[data] : user;
  },
);
