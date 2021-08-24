import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { UserEntity } from "@/users/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userReposiory: Repository<UserEntity>
  ) {
  }

  findByUsername(username: string) {
    return this.userReposiory.findOne({ where: { username } });
  }
}
