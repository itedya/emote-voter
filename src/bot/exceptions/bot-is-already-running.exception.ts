import { HttpException, HttpStatus } from "@nestjs/common";

export class BotIsAlreadyRunningException extends HttpException {
  constructor() {
    super({
      status: HttpStatus.BAD_REQUEST,
      message: "Discord bot is already running!"
    }, HttpStatus.BAD_REQUEST);
  }
}