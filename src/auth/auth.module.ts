import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { AuthService } from "./auth.service";
import config from "~/config";
import { AuthController } from "@/auth/auth.controller";
import { UsersModule } from "@/users/users.module";

@Module({
  imports: [
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: '3600s' },
    }),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
