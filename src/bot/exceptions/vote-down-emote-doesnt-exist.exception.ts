import { HttpException, HttpStatus } from "@nestjs/common";

export class VoteDownEmoteDoesntExistException extends HttpException {
  constructor() {
    super({
      status: HttpStatus.BAD_REQUEST,
      message: "Emotka \"przeciw głosowaniu\" nie istnieje, sprawdź ustawienia."
    }, HttpStatus.BAD_REQUEST);
  }
}