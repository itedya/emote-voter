import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { BotService } from "@/bot/bot.service";

@Controller("discord-bot")
export class BotController {
  constructor(private botService: BotService) {
  }

  @Get("/start")
  @HttpCode(HttpStatus.NO_CONTENT)
  async start() {
    await this.botService.start();

    return [];
  }

  @Get("/stop")
  @HttpCode(HttpStatus.NO_CONTENT)
  async stop() {
    await this.botService.stop();

    return [];
  }
}
