import { Exclude } from "class-transformer";

export class UserDto {
  id: string;

  username: string;

  @Exclude()
  password: string;
}