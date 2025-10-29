import { UsersModule } from './users/module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/module';
import { ChatModule } from './chat/module';

@Module({
  imports: [AuthModule, UsersModule, ChatModule], // AuthModule первым, т.к. регистрирует глобальный JwtModule
  exports: [UsersModule, AuthModule, ChatModule],
})
export class UsersSectionModule { }
