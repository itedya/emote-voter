import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { SettingsService } from "@/settings/settings.service";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { SaveSettingsDto } from "@/settings/dto/save-settings.dto";

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {
  }

  @UseGuards(JwtAuthGuard)
  @Get("/")
  async get() {
    return this.settingsService.get();
  }

  @UseGuards(JwtAuthGuard)
  @Put("/")
  async save(@Body() saveSettingsBody: SaveSettingsDto) {
    return this.settingsService.saveSettings(saveSettingsBody);
  }
}
