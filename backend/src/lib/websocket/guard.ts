import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WebsocketAuthService } from './service';
import { Socket } from 'socket.io';
import { UserWithoutPassword } from '@shared/src';

@Injectable()
export class WebsocketAuthGuard implements CanActivate {
  constructor(private readonly auth: WebsocketAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();

    try {
      const token = this.auth.extractTokenFromHandshake(client.handshake);

      if (!token) {
        client.disconnect();
        return false;
      }

      const user = await this.auth.validateToken(token);

      if (!user) {
        client.disconnect();
        return false;
      }

      (client.data as { user: UserWithoutPassword }).user = user;

      return true;
    } catch {
      client.disconnect();
      return false;
    }
  }
}
