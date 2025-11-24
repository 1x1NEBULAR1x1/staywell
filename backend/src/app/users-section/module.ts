import { UsersModule } from './users/module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/module';
import { ChatModule } from './chat/module';
import { NotificationsModule } from './notifications/module';

@Module({
  imports: [AuthModule, UsersModule, ChatModule, NotificationsModule],
  exports: [UsersModule, AuthModule, ChatModule, NotificationsModule],
})
export class UsersSectionModule { }
