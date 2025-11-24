import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@shared/src/database';
import { ROLES_KEY } from '../decorators/controller/roles.decorator';
import { AuthenticatedRequest } from '@shared/src/types/users-section';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required_roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required_roles) return true;

    const { user } = context
      .switchToHttp()
      .getRequest<{ user: AuthenticatedRequest }>();

    if (!user) throw new ForbiddenException('Доступ запрещен');

    const hasRole = required_roles.some((role) => user.user.role === role);

    if (!hasRole)
      throw new ForbiddenException(
        'У вас нет прав для выполнения этого действия',
      );

    return true;
  }
}
