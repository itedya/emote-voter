import { forwardRef, Inject, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { EmoteChangesService } from "@/emote-changes/emote-changes.service";
import { SettingsService } from "@/settings/settings.service";
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
import { EmoteChangeEntity } from "@/emote-changes/entities/emote-change.entity";
import { BttvService } from "@/bttv/bttv.service";
import { BotService } from "@/bot/bot.service";

@Processor("pending-ended-votes")
export class VoteEndProcessor {

  constructor(
    @InjectQueue("pending-ended-votes") private pendingEndedVotesQueue: Queue,
    private emoteChangesService: EmoteChangesService,
    private settingsService: SettingsService,
    private bttvService: BttvService,
    @Inject(forwardRef(() => BotService)) private botService: BotService
  ) {
  }

  private discordBot?: any;
  private readonly logger = new Logger("VoteEndListener");

  @OnQueueResumed()
  async onResumed() {
    this.logger.log(`Initialized!`);
    this.discordBot = this.botService.discordBot;
  }

  @OnQueuePaused()
  async onPaused() {
    this.logger.log(`Paused!`);
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

  @Cron(CronExpression.EVERY_10_SECONDS)
  protected async handleCron() {
    if (this.discordBot === undefined) return;
    this.logger.debug('CRON PING');
    const jobsInQueue = await this.pendingEndedVotesQueue.getJobs(["active", "waiting"])
      .then(res => res.map(ele => ele.id));

    const notInQueue = await this.emoteChangesService.getWithEndedVote()
      .then(res => res.filter(ele => !jobsInQueue.includes(ele.id)));

    this.logger.debug(jobsInQueue);
    this.logger.debug(notInQueue.map(ele => ele.id));

    if (notInQueue.length === 0) return;
    notInQueue.forEach(ele => this.pendingEndedVotesQueue.add(ele));
  }

  @Process()
  protected async handle(job: Job<EmoteChangeEntity>) {
    const settings = await this.settingsService.get();
    const channel = this.discordBot.channels.cache.get(settings.announcementsChannelId);
    const message = await channel.messages.fetch(job.data.voteMessageId);

    if (job.data.voteUp > job.data.voteDown) {
      await this.bttvService.removeEmote(job.data.fromEmoteId);
      await this.bttvService.addEmote(job.data.toEmoteId);

      this.logger.log(`Ended vote of Emote Change ID ${job.data.id} | VOTE ACCEPTED`);
      await message.edit({ content: `Głosowanie ID ${job.data.id} | STATUS: Zmieniono emotkę ${job.data.voteUp} / ${job.data.voteDown}` });
    } else if (job.data.voteUp === job.data.voteDown) {
      this.logger.log(`Ended vote of Emote Change ID ${job.data.id} | DRAW`);
      await message.edit({ content: `Głosowanie ID ${job.data.id} | STATUS: Remis, odrzucono emotkę ${job.data.voteUp} / ${job.data.voteDown}` });
    } else {
      this.logger.log(`Ended vote of Emote Change ID ${job.data.id} | VOTE REJECTED`);
      await message.edit({ content: `Głosowanie ID ${job.data.id} | STATUS: Odrzucono emotkę ${job.data.voteUp} / ${job.data.voteDown}` });
    }

    await this.emoteChangesService.switchCompleted(job.data.id);
  }
}