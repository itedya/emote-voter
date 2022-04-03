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
import { LoginDto } from '../globals/requests/login.dto';
import { AuthService } from './auth.service';
import { UserDoesNotExistException } from '../globals/exceptions/users/user-does-not-exist.exception';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<UserDto> {
    const createUserDto = new CreateUserDto(dto);
    return await this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.usersService.getByUsername(dto.username);

    if (!user) {
      throw new UserDoesNotExistException();
    }

    const comparePassword = await this.authService.checkPassword(
      dto.password,
      user.password,
    );

    if (!comparePassword) {
      throw new UserDoesNotExistException();
    }

    return {
      token: await this.authService.generateJWTTokenForUser(user),
      user,
    };
  }
}
