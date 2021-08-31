import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { SettingsEntity } from "@/settings/entity/settings.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { SaveSettingsDto } from "@/settings/dto/save-settings.dto";
import { Cache } from 'cache-manager';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingsEntity) private settingsRepository: Repository<SettingsEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
  }

  async get(): Promise<SettingsEntity> {
    const cache = await this.cacheManager.get<SettingsEntity>('settings');

    if (!cache) {
      const settings = await this.settingsRepository.findOne({ where: { id: 1 } });
      await this.cacheManager.set('settings', settings, { ttl: 3600 });
      return settings;
    }

    return cache;
  }

  async saveSettings(saveSettingsDto: SaveSettingsDto) {
    await this.settingsRepository.save({
      id: 1,
      ...saveSettingsDto
    })

    await this.cacheManager.del('settings');
    await this.cacheManager.del('bttv-account');
    await this.cacheManager.set('settings', { id: 1, ...saveSettingsDto }, { ttl: 3600 });
    return { id: 1, ...saveSettingsDto };
  }
}
