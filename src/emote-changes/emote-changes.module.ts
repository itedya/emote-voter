import { forwardRef, Module } from "@nestjs/common";
import { EmoteChangesService } from './emote-changes.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmoteChangeEntity } from "@/emote-changes/entities/emote-change.entity";
import { BttvModule } from "@/bttv/bttv.module";
import { BotModule } from "@/bot/bot.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([EmoteChangeEntity])
  ],
  providers: [EmoteChangesService],
  exports: [EmoteChangesService]
})
export class EmoteChangesModule {}
