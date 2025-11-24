import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserActivityService } from '../services';
import { UserWithoutPassword } from '@shared/src';

@Injectable()
export class UserActivityInterceptor implements NestInterceptor {
  constructor(private readonly userActivityService: UserActivityService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserWithoutPassword | undefined;

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
