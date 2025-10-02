import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthenticatedRequest } from "@shared/src/types/users-section";
import { Role } from "@shared/src/database";
export type { AuthenticatedRequest };
export { Role };

interface AuthenticatedUser {
  user_id: string;
  email: string;
  session_id: string;
  role: Role;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  image?: string;
  is_banned: boolean;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    return super.canActivate(context) as boolean | Promise<boolean>;
  }

  handleRequest<T = AuthenticatedUser>(err: Error | null, user: T | false): T {
    if (err || !user)
      throw (
        err ||
        new UnauthorizedException("Доступ запрещен. Пожалуйста, авторизуйтесь.")
      );
    return user;
  }
}
