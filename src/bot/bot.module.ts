import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import {PrismaModule} from "../prisma/prisma.module";
import {ConfigModule} from "../config/config.module";
import {BotBootstraperService} from "./bot-bootstraper.service";

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [BotService, BotBootstraperService]
})
export class BotModule {}
