import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { BotModule } from './bot/bot.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [AuthModule, PrismaModule, ConfigModule, BotModule, SettingsModule],
})
export class AppModule {}
