import { HttpException, HttpStatus } from "@nestjs/common";

export class CompleteSettingsBeforeStartingBotException extends HttpException {
  constructor() {
    super({
      status: HttpStatus.BAD_REQUEST,
      message: "Dokończ ustawienia przed wystartowaniem bota!"
    }, HttpStatus.BAD_REQUEST);
  }
}