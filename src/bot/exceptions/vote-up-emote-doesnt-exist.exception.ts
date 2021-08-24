import { HttpException, HttpStatus } from "@nestjs/common";

export class VoteUpEmoteDoesntExistException extends HttpException {
  constructor() {
    super({
      status: HttpStatus.BAD_REQUEST,
      message: "Emotka \"za głosowaniem\" nie istnieje, sprawdź ustawienia."
    }, HttpStatus.BAD_REQUEST);
  }
}