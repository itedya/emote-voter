import { BadRequestException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export class EmailAlreadyTakenException extends BadRequestException {
  constructor() {
    super('Użytkownik z takim emailem już istnieje.');
  }

  static isInstanceOf(ex: Error): boolean {
    if (!(ex instanceof PrismaClientKnownRequestError)) return false;
    if (ex.code !== 'P2002') return false;
    return ex.message.includes('email');
  }
}
