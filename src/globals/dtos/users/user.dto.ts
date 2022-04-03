import { Exclude } from 'class-transformer';

export class UserDto {
  constructor(data: Partial<UserDto>) {
    Object.assign(this, data);
  }

  id: number;
  username: string;
  email: string;
  @Exclude()
  password: string;
  createdAt: Date;
}
