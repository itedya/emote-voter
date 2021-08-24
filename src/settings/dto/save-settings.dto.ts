import { IsNotEmpty, IsNumberString, IsString, Length } from "class-validator";

export class SaveSettingsDto {

  @IsNotEmpty()
  @IsNumberString({}, { message: "ID Kanału z requestami głosowań (requestChannelId) musi być numerem!" })
  requestChannelId: string;

  @IsNotEmpty()
  @IsNumberString({}, { message: "ID Kanału z głosowaniami (announcementsChannelId) musi być numerem!" })
  announcementsChannelId: string;

  @IsNotEmpty()
  @IsString({ message: "Auth Token BetterTTV (bttvAuthToken) musi być ciągiem znaków!" })
  @Length(120, 7168, { message: "Auth Token BetterTTV (bttvAuthToken) musi mieć pomiędzy 120 a 7168 znaków!" })
  bttvAuthToken: string;

  @IsNotEmpty({ message: "Token Bota Discordowego (discordBotToken) jest wymagany!" })
  @IsString({ message: "Token Bota Discordowego (discordBotToken) musi być ciągiem znaków!" })
  @Length(30, 100, { message: "Token Bota Discordowego (discordBotToken) musi mieć pomiędzy 30 a 100 znaków!" })
  discordBotToken: string

  @IsNotEmpty()
  @IsString({ message: "Nazwa / ID emotki za zmianą (voteUpEmojiResolver) musi być ciągiem znaków!" })
  @Length(1, 32, { message: "Nazwa / ID emotki za zmianą (voteUpEmojiResolver) musi mieć pomiędzy 1 a 32 znaki!" })
  voteUpEmojiResolver: string;

  @IsNotEmpty()
  @IsString({ message: "Nazwa / ID emotki przeciw zmianie (voteDownEmojiResolver) musi być ciągiem znaków!" })
  @Length(1, 32, { message: "Nazwa / ID emotki przeciw zmianie (voteDownEmojiResolver) musi mieć pomiędzy 1 a 32 znaki!" })
  voteDownEmojiResolver: string;

}