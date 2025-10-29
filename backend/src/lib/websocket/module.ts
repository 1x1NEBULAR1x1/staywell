import { Module } from '@nestjs/common';
import { WebsocketAuthService } from './service';
import { WebsocketAuthGuard } from './guard';
import { PrismaModule } from '../prisma';

@Module({
  imports: [PrismaModule],
  providers: [WebsocketAuthService, WebsocketAuthGuard],
  exports: [WebsocketAuthService, WebsocketAuthGuard],
})
export class WebsocketModule { }
