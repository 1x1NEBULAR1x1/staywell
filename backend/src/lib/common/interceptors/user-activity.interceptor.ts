import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserActivityService } from '../services';
import { AuthenticatedRequest } from '@shared/src';

@Injectable()
export class UserActivityInterceptor implements NestInterceptor {
  constructor(private readonly userActivityService: UserActivityService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();

    return next.handle().pipe(
      tap(async () => {
        // Update last seen time for authenticated users
        if (user?.id) {
          try {
            await this.userActivityService.updateLastSeen(user.id);
          } catch (error) {
            // Log error but don't fail the request
            console.error('Failed to update user activity:', error);
          }
        }
      }),
    );
  }
}
