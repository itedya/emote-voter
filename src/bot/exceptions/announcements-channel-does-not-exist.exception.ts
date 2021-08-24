import { HttpException, HttpStatus } from "@nestjs/common";

export class AnnouncementsChannelDoesNotExistException extends HttpException {
  constructor() {
    super({
      status: HttpStatus.BAD_REQUEST,
      message: "Kanał z głosowaniami nie istnieje! Sprawdź ID które podałeś!"
    }, HttpStatus.BAD_REQUEST);
  }
}