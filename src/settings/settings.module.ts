import { Module } from "@nestjs/common";
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { SettingsEntity } from "@/settings/entity/settings.entity";
import { CacheModule } from "@/cache/cache.module";

@Module({
  imports: [TypeOrmModule.forFeature([SettingsEntity]), CacheModule],
  providers: [SettingsService],
  controllers: [SettingsController],
  exports: [SettingsService]
})
export class SettingsModule {}
