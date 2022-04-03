import { BadRequestException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export class UsernameAlreadyTakenException extends BadRequestException {
  constructor() {
    super('Użytkownik z taką nazwą użytkownika już istnieje.');
  }

  static isInstanceOf(ex: Error): boolean {
    if (!(ex instanceof PrismaClientKnownRequestError)) return false;
    if (ex.code !== 'P2002') return false;
    return ex.message.includes('username');
  }
}
