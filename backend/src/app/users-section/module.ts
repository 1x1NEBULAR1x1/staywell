import { UsersModule } from "./users/module";
import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/module";
import { SessionsModule } from "./sessions/module";
import { MessagesModule } from "./messages/module";

@Module({
  imports: [UsersModule, AuthModule, SessionsModule, MessagesModule],
  exports: [UsersModule, AuthModule, SessionsModule, MessagesModule],
})
export class UsersSectionModule { }
