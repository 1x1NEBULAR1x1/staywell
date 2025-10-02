import { Module } from "@nestjs/common";
import { SessionsController } from "./controller";
import { RedisSessionService } from "./service";
import { RedisModule } from "src/lib/redis";

@Module({
  imports: [RedisModule],
  controllers: [SessionsController],
  providers: [RedisSessionService],
  exports: [RedisSessionService],
})
export class SessionsModule { }
