import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { SettingsModule } from "./settings/settings.module";
import { BotModule } from "@/bot/bot.module";
import { EmoteChangesModule } from "./emote-changes/emote-changes.module";
import { ScheduleModule } from "@nestjs/schedule";
import { BttvModule } from "@/bttv/bttv.module";
import { QueueModule } from "./queue/queue.module";
import { BullModule } from "@nestjs/bull";
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379
      }
    }),
    AuthModule,
    UsersModule,
    SettingsModule,
    EmoteChangesModule,
    BttvModule,
    BotModule,
    QueueModule,
    CacheModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
}
