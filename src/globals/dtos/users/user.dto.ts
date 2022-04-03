export class UserDto {
  constructor(data: Partial<UserDto>) {
    Object.assign(this, data);
  }

  id: number;
  username: string;
  password: string;
  createdAt: Date;
}
