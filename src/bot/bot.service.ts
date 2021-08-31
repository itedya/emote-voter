import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { Client, GuildEmoji, Intents } from "discord.js";
import { BttvService } from "@/bttv/bttv.service";
import { SettingsService } from "@/settings/settings.service";
import { EmoteChangesService } from "@/emote-changes/emote-changes.service";
import { BotIsAlreadyNotRunningException } from "@/bot/exceptions/bot-is-already-not-running.exception";
import { BotIsAlreadyRunningException } from "@/bot/exceptions/bot-is-already-running.exception";
import { RequestEmoteChangeCommand } from "@/bot/request-emote-change.command";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { surrogates } from "@/emote-changes/surrogates";
import { VoteChangeListener } from "@/bot/vote-change.listener";
import { VoteEndProcessor } from "@/bot/vote-end.processor";

@Injectable()
export class BotService {
  constructor(
    // queues
    @InjectQueue('pending-vote-messages') private pendingVoteMessagesQueue: Queue,
    @InjectQueue('pending-ended-votes') private pendingEndedVotesQueue: Queue,
    private emoteChangesService: EmoteChangesService,
    private bttvService: BttvService,
    private settingsService: SettingsService,

    // commands
    private requestEmoteChangeCommand: RequestEmoteChangeCommand,

    // listeners
    @Inject(forwardRef(() => VoteChangeListener))
    private voteChangeListener: VoteChangeListener,
  ) {
  }

  private readonly logger = new Logger("BotService");
  public discordBot?: Client;

  /**
   * Start bot
   */
  async start() {
    if (this.discordBot !== undefined) throw new BotIsAlreadyRunningException();

    this.logger.log("Starting...");
    this.discordBot = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
      ],
      partials: ["MESSAGE", "CHANNEL", "REACTION"]
    });

    const settings = await this.settingsService.get();

    await this.discordBot.login(settings.discordBotToken);

    await this.requestEmoteChangeCommand.initialize(this.discordBot);
    await this.voteChangeListener.initialize(this.discordBot);

    await this.pendingVoteMessagesQueue.resume();
    await this.pendingEndedVotesQueue.resume();
    this.logger.log("Started!");
  }

  /**
   * Stop bot
   */
  async stop() {
    if (this.discordBot === undefined) throw new BotIsAlreadyNotRunningException();

    this.logger.log("Stopping...");
    await this.pendingVoteMessagesQueue.pause();
    this.discordBot.destroy();
    this.discordBot = undefined;
    this.logger.log("Stopped!");
  }

  async getEmoteData(emoteResolver: string): Promise<GuildEmoji | string | false> {
    if (this.discordBot === undefined) throw new BotIsAlreadyRunningException();

    const discordResult = this.discordBot.emojis.cache.find(ele => ele.id === emoteResolver || ele.name === emoteResolver);
    if (discordResult) {
      return discordResult;
    }

    const defaultsResult = surrogates.find(ele => ele === emoteResolver);
    if (defaultsResult) return defaultsResult;

    return false;
  }
}
