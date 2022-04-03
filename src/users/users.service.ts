import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../globals/dtos/users/create-user.dto';
import { UserDto } from '../globals/dtos/users/user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(dto: CreateUserDto): Promise<UserDto> {
    const result = await this.prismaService.user.create({ data: dto });

    if (result === null) {
      return null;
    }

    return new UserDto(result);
  }
}
