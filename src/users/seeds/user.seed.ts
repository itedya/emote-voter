import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { UserEntity } from "./../entities/user.entity";
import * as bcrypt from 'bcrypt';

export default class UserSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection.getRepository(UserEntity)
      .insert({
        username: "localadmin",
        password: bcrypt.hashSync('localadmin123', 10)
      })
  }
}