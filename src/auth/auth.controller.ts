import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from '../globals/requests/register-dto';
import { CreateUserDto } from '../globals/dtos/users/create-user.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const createUserDto = new CreateUserDto(dto);
    const user = await this.usersService.create(createUserDto);

    return { user };
  }
}
