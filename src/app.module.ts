import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from './users/users.module';
import { SettingsModule } from './settings/settings.module';
import { BotModule } from "@/bot/bot.module";
import { EmoteChangesModule } from './emote-changes/emote-changes.module';
import { ScheduleModule } from "@nestjs/schedule";
import { BttvModule } from "@/bttv/bttv.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
    UsersModule,
    SettingsModule,
    BotModule,
    EmoteChangesModule,
    BttvModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
