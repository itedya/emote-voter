import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [BotService]
})
export class BotModule {}
