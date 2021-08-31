import { MessageEmbed } from "discord.js";
import { EmoteChangesService } from "@/emote-changes/emote-changes.service";
import {
  InjectQueue,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueuePaused,
  OnQueueResumed,
  Process,
  Processor
} from "@nestjs/bull";
import { Job, Queue } from "bull";
import { SettingsService } from "@/settings/settings.service";
import { BttvService } from "@/bttv/bttv.service";
import { BotService } from "@/bot/bot.service";
import { Logger } from "@nestjs/common";
import { EmoteChangeEntity } from "@/emote-changes/entities/emote-change.entity";
import { EmoteDoesntExistException } from "@/emote-changes/exceptions/emote-doesnt-exist.exception";
import { UserDoestHaveEmoteException } from "@/bot/exceptions/user-doest-have-emote.exception";
import { VoteUpEmoteDoesntExistException } from "@/bot/exceptions/vote-up-emote-doesnt-exist.exception";
import { VoteDownEmoteDoesntExistException } from "@/bot/exceptions/vote-down-emote-doesnt-exist.exception";


@Processor('pending-vote-messages')
export class PendingVoteMessagesProcessor {
  constructor(
    @InjectQueue('pending-vote-messages') private pendingVoteMessagesQueue: Queue,
    private botService: BotService,
    private emoteChangesService: EmoteChangesService,
    private settingsService: SettingsService,
    private bttvService: BttvService
  ) {
  }

  private readonly logger = new Logger("PendingVoteMessagesProcessor");

  protected discordBot: any

  @OnQueueResumed()
  async initialize() {
    this.logger.log(`Resumed!`);
    const withoutMessage = await this.emoteChangesService.getWithoutVoteMessage();
    withoutMessage.forEach(ele => {
      this.logger.log(`Adding to queue emoteChange ID ${ele.id}`);
      this.pendingVoteMessagesQueue.add(ele);
    });
    this.discordBot = this.botService.discordBot;
  }

  @OnQueuePaused()
  async destroy() {
    this.logger.log(`Paused!`);
    await this.pendingVoteMessagesQueue.empty();
    this.discordBot = undefined;
  }

  @OnQueueCompleted()
  onQueueCompleted(job: Job, result: any) {
    this.logger.log(`EmoteChange ID ${job.data.id} completed successfully!`);
  }

  @OnQueueFailed()
  onQueueFailed(job: Job, err: Error) {
    this.logger.error(`EmoteChange ID ${job.data.id} failed! ${err.message}`);
    console.error(err);
  }

  @Process()
  async handle(job: Job<EmoteChangeEntity>) {
    this.logger.log(`Handling emoteChange ID ${job.data.id}`);
    const settings = await this.settingsService.get();
    const emoteChange = await this.emoteChangesService.findById(job.data.id);
    if (emoteChange === null) return job.discard();

    const channel = await this.discordBot.channels.cache.get(settings.announcementsChannelId);

    if (!await this.bttvService.checkIfUserHasEmote(emoteChange.fromEmoteId)) {
      throw new UserDoestHaveEmoteException(emoteChange.fromEmoteId);
    }

    const fromEmoteData = await this.bttvService.getEmoteInfo(emoteChange.fromEmoteId);
    const toEmoteData = await this.bttvService.getEmoteInfo(emoteChange.toEmoteId);
    if (fromEmoteData === false) throw new EmoteDoesntExistException(`from_emote_id`);
    if (toEmoteData === false) throw new EmoteDoesntExistException(`to_emote_id`);

    const embeds = [];
    embeds.push(new MessageEmbed()
      .setTitle(`Zmiana z emotki ${fromEmoteData.code}`)
      .setImage(`https://cdn.betterttv.net/emote/${fromEmoteData.id}/3x.gif`));
    embeds.push(new MessageEmbed()
      .setTitle(`Zmiana na emotkę ${toEmoteData.code}`)
      .setImage(`https://cdn.betterttv.net/emote/${toEmoteData.id}/3x.gif`));

    const emoteUp = await this.botService.getEmoteData(settings.voteUpEmojiResolver);
    if (emoteUp === false) throw new VoteUpEmoteDoesntExistException();
    const emoteDown = await this.botService.getEmoteData(settings.voteDownEmojiResolver);
    if (emoteDown === false) throw new VoteDownEmoteDoesntExistException();

    const message = await channel.send({ content: `Głosowanie ID ${emoteChange.id} | STATUS: TRWA`, embeds });
    await message.react(emoteUp);
    await message.react(emoteDown);
    await this.emoteChangesService.addVoteMessageId(message.id, emoteChange.id);
  }
}