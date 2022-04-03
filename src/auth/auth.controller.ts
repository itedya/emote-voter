import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RegisterDto } from '../globals/requests/register-dto';
import { CreateUserDto } from '../globals/dtos/users/create-user.dto';
import { UsersService } from '../users/users.service';
import { UserDto } from '../globals/dtos/users/user.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<UserDto> {
    const createUserDto = new CreateUserDto(dto);
    return await this.usersService.create(createUserDto);
  }
}
