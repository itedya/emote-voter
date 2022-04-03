import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../globals/dtos/users/user.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  async checkPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async generateJWTTokenForUser(user: UserDto): Promise<string> {
    return jwt.sign(
      { id: user.id },
      this.configService.get<string>('jwt.secret'),
      {
        expiresIn: this.configService.get<number>('jwt.expires_at'),
      },
    );
  }
}
