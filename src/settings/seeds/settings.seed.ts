import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { SettingsEntity } from "@/settings/entity/settings.entity";

export default class SettingsSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection.getRepository(SettingsEntity)
      .insert({
        id: 1,
        bttvAuthToken: null,
        requestChannelId: null,
        announcementsChannelId: null
      })
  }
}