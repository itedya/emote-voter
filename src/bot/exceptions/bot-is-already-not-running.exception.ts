import { HttpException, HttpStatus } from "@nestjs/common";

export class BotIsAlreadyNotRunningException extends HttpException {
  constructor() {
    super({
      status: HttpStatus.BAD_REQUEST,
      message: "Discord bot is already not running!"
    }, HttpStatus.BAD_REQUEST);
  }
}