export class UserDto {
  constructor(data: Partial<UserDto>) {
    Object.assign(this, data);
  }

  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}
