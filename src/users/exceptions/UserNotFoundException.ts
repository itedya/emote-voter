import { HttpException, HttpStatus } from "@nestjs/common";

export class UserNotFoundException extends HttpException {
  constructor() {
    super({
      status: HttpStatus.BAD_REQUEST,
      message: ["User not found."]
    }, HttpStatus.BAD_REQUEST);
  }
}