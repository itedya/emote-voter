import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { BotController } from "./bot.controller";
import { BttvModule } from "@/bttv/bttv.module";
import { SettingsModule } from "@/settings/settings.module";
import { EmoteChangesModule } from "@/emote-changes/emote-changes.module";
import { RequestEmoteChangeCommand } from "@/bot/request-emote-change.command";
import { BullModule } from "@nestjs/bull";
import { PendingVoteMessagesProcessor } from "@/bot/pending-vote-messages.processor";
import { VoteChangeListener } from "@/bot/vote-change.listener";
import { VoteEndProcessor } from "@/bot/vote-end.processor";

@Module({
  imports: [
    BullModule.registerQueue({ name: "pending-vote-messages" }),
    BullModule.registerQueue({ name: "pending-ended-votes" }),
    EmoteChangesModule,
    BttvModule,
    SettingsModule
  ],
  controllers: [BotController],
  providers: [
    PendingVoteMessagesProcessor,
    VoteEndProcessor,
    RequestEmoteChangeCommand,
    BotService,
    VoteChangeListener,
  ],
  exports: [BotService, BullModule]
})
export class BotModule {
}
