import { Module, Global } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisService } from "./redis.service";
import { Redis, RedisOptions } from "ioredis";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: "REDIS_CONNECTION",
      useFactory: (configService: ConfigService) => {
        const redis: Redis = new Redis({
          host: configService.get("REDIS_HOST", "localhost"),
          port: configService.get("REDIS_PORT", 6379),
          password: configService.get("REDIS_PASSWORD"),
          db: configService.get("REDIS_DB", 0),
          retryDelayOnFailover: 100,
          maxRetriesPerRequest: 3,
          lazyConnect: true,
          keepAlive: 30000,
          connectTimeout: 10000,
          commandTimeout: 5000,
          family: 4,
        } as RedisOptions);

        redis.on("connect", () => {
          console.log("✅ Redis подключен успешно");
        });

        redis.on("error", (err: Error) => {
          console.error("❌ Ошибка подключения к Redis:", err.message);
        });

        redis.on("reconnecting", () => {
          console.log("🔄 Переподключение к Redis...");
        });

        return redis;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: ["REDIS_CONNECTION", RedisService],
})
export class RedisModule {}
