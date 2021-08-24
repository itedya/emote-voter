import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { LoginDto } from "@/auth/dto/login.dto";
import { AuthService } from "@/auth/auth.service";
import { UsersService } from "@/users/users.service";
import { UserNotFoundException } from "@/users/exceptions/UserNotFoundException";
import { JwtService } from "@nestjs/jwt";
import { plainToClass } from "class-transformer";
import { UserDto } from "@/users/dto/user.dto";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Get("user")
  async user(@Req() request) {
    return request.user
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.findByUsername(loginDto.username);

    if (user === undefined) throw new UserNotFoundException();

    const token = this.jwtService.sign({
      userId: user!.id,
      username: user!.username
    });

    return {
      token,
      user: plainToClass(UserDto, user)
    }
  }
}