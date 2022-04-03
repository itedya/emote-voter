import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../globals/dtos/users/create-user.dto';
import { UserDto } from '../globals/dtos/users/user.dto';
import { UsernameAlreadyTakenException } from '../globals/exceptions/users/username-already-taken.exception';
import { EmailAlreadyTakenException } from '../globals/exceptions/users/email-already-taken.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateUserDto): Promise<UserDto> {
    dto.password = await bcrypt.hash(dto.password, 10);

    const result = await this.prismaService.user
      .create({ data: dto })
      .catch((err) => {
        if (UsernameAlreadyTakenException.isInstanceOf(err))
          throw new UsernameAlreadyTakenException();
        if (EmailAlreadyTakenException.isInstanceOf(err))
          throw new EmailAlreadyTakenException();

        throw err;
      });

    if (result === null) {
      return null;
    }

    return new UserDto(result);
  }

  async getByUsername(username: string) {
    const result = await this.prismaService.user.findFirst({
      where: { username },
    });

    return result === null ? null : new UserDto(result);
  }
}
