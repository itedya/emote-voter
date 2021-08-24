import { Module } from "@nestjs/common";
import { BotService } from './bot.service';
import { BotController } from './bot.controller';
import { BttvModule } from "@/bttv/bttv.module";
import { SettingsModule } from "@/settings/settings.module";
import { EmoteChangesModule } from "@/emote-changes/emote-changes.module";

@Module({
  imports: [EmoteChangesModule, BttvModule, SettingsModule],
  controllers: [BotController],
  providers: [BotService],
  exports: [BotService]
})
export class BotModule {
}
