import { UsersModule } from "./users/module";
import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/module";
import { SessionsModule } from "./sessions/module";

@Module({
  imports: [UsersModule, AuthModule, SessionsModule],
  exports: [UsersModule, AuthModule, SessionsModule],
})
export class UsersSectionModule {}
