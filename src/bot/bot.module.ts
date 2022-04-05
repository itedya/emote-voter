import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [BotService],
})
export class BotModule {}
