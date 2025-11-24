import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { ServerOptions, Server } from 'socket.io';
import { WebsocketAuthService } from './service';

export class AuthenticatedIoAdapter extends IoAdapter {
  private authService: WebsocketAuthService;

  constructor(
    app: INestApplication,
    private readonly corsOrigin: string = (() => {
      const origin = process.env.FRONTEND_URL;
      if (!origin) {
        throw new Error(
          'FRONTEND_URL is not defined in the environment variables',
        );
      }
      return origin;
    })(),
  ) {
    super(app);
    this.authService = app.get(WebsocketAuthService);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: this.corsOrigin,
        credentials: true,
      },
    });

    // Authentication middleware is now applied in the ChatGateway afterInit method

    return server;
  }
}
