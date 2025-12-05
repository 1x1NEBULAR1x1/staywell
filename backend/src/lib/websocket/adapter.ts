import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { ServerOptions } from 'socket.io';
import { ConfigService } from '@nestjs/config';

export class AuthenticatedIoAdapter extends IoAdapter {
  constructor(
    app: INestApplication,
    private readonly configService: ConfigService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    return super.createIOServer(port, {
      ...options,
      cors: {
        origin: this.configService.getOrThrow('FRONTEND_URL'),
        credentials: true,
      },
    });
  }
}
