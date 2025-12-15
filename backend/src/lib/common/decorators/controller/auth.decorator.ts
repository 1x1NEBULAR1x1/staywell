import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserWithoutPassword } from '@shared/src';
import { AuthenticatedRequest } from '@shared/src/types/users-section';

/**
 * Decorator to get current user data from request
 * Uses typing for correct return value depending on parameter
 */
export const Auth = createParamDecorator(
  (
    data: keyof UserWithoutPassword | undefined,
    ctx: ExecutionContext,
  ):
    | UserWithoutPassword
    | UserWithoutPassword[keyof UserWithoutPassword]
    | undefined => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user?: AuthenticatedRequest }>();
    const user: UserWithoutPassword | undefined = request.user?.user;
    if (!user) return undefined;
    return data ? user[data] : user;
  },
);
