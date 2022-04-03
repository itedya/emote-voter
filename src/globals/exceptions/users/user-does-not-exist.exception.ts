import { BadRequestException } from '@nestjs/common';

export class UserDoesNotExistException extends BadRequestException {
  constructor() {
    super('Użytkownik nie istnieje!');
  }
}
