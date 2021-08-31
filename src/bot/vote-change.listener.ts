import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { Client, GuildEmoji, MessageReaction, PartialMessageReaction } from "discord.js";
import { SettingsService } from "@/settings/settings.service";
import { BotService } from "@/bot/bot.service";
import { VoteUpEmoteDoesntExistException } from "@/bot/exceptions/vote-up-emote-doesnt-exist.exception";
import { VoteDownEmoteDoesntExistException } from "@/bot/exceptions/vote-down-emote-doesnt-exist.exception";
import { EmoteChangesService } from "@/emote-changes/emote-changes.service";

@Injectable()
export class VoteChangeListener {
  constructor(
    private settingsService: SettingsService,
    private emoteChangesService: EmoteChangesService,

    @Inject(forwardRef(() => BotService))
    private botService: BotService,
  ) {
  }

  private readonly logger = new Logger("VoteChangeListener");

  async initialize(discordBot: Client) {
    this.logger.log(`Initialized!`);
    discordBot.on("messageReactionAdd", async (reaction) => {
      if (!reaction.partial) await reaction.fetch();
      if (reaction.me) return;

      const validated = await this.validate(reaction);
      if (!validated) return;

      await this.handle(reaction, "add", validated.vote);
    });

    discordBot.on("messageReactionRemove", async (reaction) => {
      if (!reaction.partial) await reaction.fetch();
      if (reaction.me) return;

      const validated = await this.validate(reaction);
      if (!validated) return;

      await this.handle(reaction, "remove", validated.vote);
    });
  }

  protected async validate(reaction: MessageReaction | PartialMessageReaction): Promise<{ vote: "up" | "down" } | false> {
    const emoji = reaction.emoji;
    const settings = await this.settingsService.get();

    const voteUpEmoji = await this.botService.getEmoteData(settings.voteUpEmojiResolver);
    if (!voteUpEmoji) throw new VoteUpEmoteDoesntExistException();

    const voteDownEmoji = await this.botService.getEmoteData(settings.voteDownEmojiResolver);
    if (!voteDownEmoji) throw new VoteDownEmoteDoesntExistException();

    const exists = await this.emoteChangesService.findByMessageId(reaction.message.id);
    if (!(!!exists)) return false;

    if ((typeof voteUpEmoji === "string" && voteUpEmoji === emoji.name) ||
      (voteUpEmoji instanceof GuildEmoji && voteUpEmoji.name === emoji.name)) {
      return { vote: "up" };
    } else if ((typeof voteDownEmoji === "string" && voteDownEmoji === emoji.name) ||
      (voteDownEmoji instanceof GuildEmoji && voteDownEmoji.name === emoji.name)) {
      return { vote: "down" };
    }

    return false;
  }

  protected async handle(reaction: MessageReaction | PartialMessageReaction, action: "add" | "remove", vote: "up" | "down") {
    this.logger.log(`Vote up detected for message ID ${reaction.message.id}`);
    await this.emoteChangesService.changeVote(reaction.message.id, action, vote);
  }

}