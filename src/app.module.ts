import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [BotModule, PrismaModule],
})
export class AppModule {}
