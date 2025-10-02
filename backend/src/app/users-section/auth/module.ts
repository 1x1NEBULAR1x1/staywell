import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./controller";
import { AuthService } from "./service";
import { SessionsModule } from "../sessions/module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UsersModule } from "../users/module";
import { CrudService } from "../users/services";
import { RedisSessionService } from "../sessions/service";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>("ACCESS_TOKEN_SECRET") ||
          "access-token-secret-key",
        signOptions: {
          expiresIn:
            configService.get<string>("ACCESS_TOKEN_EXPIRES_IN") || "15m",
        },
      }),
    }),
    UsersModule,
    SessionsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, CrudService, RedisSessionService],
  exports: [AuthService, JwtModule],
})
export class AuthModule { }
