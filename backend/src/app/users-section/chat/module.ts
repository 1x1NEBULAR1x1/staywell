import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './gateway';
import {
  ChatWebsocketService,
  ChatConnectionService,
  ChatMessagingService,
  ChatNotificationService,
  ChatRoomService,
  ChatHistoryService
} from './services';
import { RedisModule } from 'src/lib/redis';
import { WebsocketModule } from 'src/lib/websocket';

@Module({
  imports: [ConfigModule, RedisModule, WebsocketModule],
  providers: [
    ChatGateway,
    ChatWebsocketService,
    ChatConnectionService,
    ChatMessagingService,
    ChatNotificationService,
    ChatRoomService,
    ChatHistoryService
  ],
  exports: [ChatWebsocketService],
})
export class ChatModule { }
