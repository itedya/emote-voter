import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { SettingsEntity } from "@/settings/entity/settings.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { SaveSettingsDto } from "@/settings/dto/save-settings.dto";

@Injectable()
export class SettingsService {
  constructor(@InjectRepository(SettingsEntity) private settingsRepository: Repository<SettingsEntity>) {
  }

  get() {
    return this.settingsRepository.findOne({ where: { id: 1 } });
  }

  saveSettings(saveSettingsDto: SaveSettingsDto) {
    return this.settingsRepository.save({
      id: 1,
      ...saveSettingsDto
    })
  }
}
