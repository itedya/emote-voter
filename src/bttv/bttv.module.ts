import { Module } from '@nestjs/common';
import { BttvController } from './bttv.controller';
import { BttvService } from './bttv.service';
import { SettingsModule } from "@/settings/settings.module";
import { CacheModule } from "@/cache/cache.module";

@Module({
  imports: [SettingsModule, CacheModule],
  controllers: [BttvController],
  providers: [BttvService],
  exports: [BttvService]
})
export class BttvModule {}
