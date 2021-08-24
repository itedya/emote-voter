import { Module } from '@nestjs/common';
import { BttvController } from './bttv.controller';
import { BttvService } from './bttv.service';
import { EmoteChangesModule } from "@/emote-changes/emote-changes.module";

@Module({
  imports: [EmoteChangesModule],
  controllers: [BttvController],
  providers: [BttvService],
  exports: [BttvService]
})
export class BttvModule {}
