import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [BotModule, PrismaModule, ConfigModule],
})
export class AppModule {}
