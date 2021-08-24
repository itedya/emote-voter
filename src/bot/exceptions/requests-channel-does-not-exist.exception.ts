import { HttpException, HttpStatus } from "@nestjs/common";

export class RequestsChannelDoesNotExistException extends HttpException {
  constructor() {
    super({
      status: HttpStatus.BAD_REQUEST,
      message: "Kanał do requestowania nie istnieje! Sprawdź ID które podałeś!"
    }, HttpStatus.BAD_REQUEST);
  }
}