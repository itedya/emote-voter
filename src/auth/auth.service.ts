import { Repository } from "typeorm";
import { UserEntity } from "@/users/entities/user.entity";

export class AuthService {
  constructor(private userRepository: Repository<UserEntity>) {
  }
}