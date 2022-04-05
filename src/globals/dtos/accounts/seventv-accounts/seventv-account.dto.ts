import { UserDto } from '../../users/user.dto';

export class SevenTVAccountDto {
  id: number;
  token: string;
  userId: number;
  user: UserDto;
  createdAt: Date;
  updatedAt: Date;
}
