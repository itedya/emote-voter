import { Injectable } from "@nestjs/common";
import { Client, GuildEmoji, Intents, Interaction, MessageEmbed, TextChannel } from "discord.js";
import { BttvService } from "@/bttv/bttv.service";
import { EmoteDoesntExistException } from "@/emote-changes/exceptions/emote-doesnt-exist.exception";
import { EmoteChangeEntity } from "@/emote-changes/entities/emote-change.entity";
import { SettingsService } from "@/settings/settings.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { EmoteChangesService } from "@/emote-changes/emote-changes.service";
import { BotIsAlreadyNotRunningException } from "@/bot/exceptions/bot-is-already-not-running.exception";
import { BotIsAlreadyRunningException } from "@/bot/exceptions/bot-is-already-running.exception";
import { DiscordBotStatus } from "@/bot/enums/discord-bot-status.enum";
import { AnnouncementsChannelDoesNotExistException } from "@/bot/exceptions/announcements-channel-does-not-exist.exception";
import { RequestsChannelDoesNotExistException } from "@/bot/exceptions/requests-channel-does-not-exist.exception";
import { CompleteSettingsBeforeStartingBotException } from "@/bot/exceptions/complete-settings-before-starting-bot.exception";
import { surrogates } from "@/emote-changes/surrogates";
import { VoteUpEmoteDoesntExistException } from "@/bot/exceptions/vote-up-emote-doesnt-exist.exception";
import { VoteDownEmoteDoesntExistException } from "@/bot/exceptions/vote-down-emote-doesnt-exist.exception";
import requireActual = jest.requireActual;

@Injectable()
export class BotService {
  constructor(
    private emoteChangesService: EmoteChangesService,
    private bttvService: BttvService,
    private settingsService: SettingsService
  ) {
  }

  private discordBot?: Client;
  private announcementsChannel?: TextChannel;
  private requestsChannel?: TextChannel;
  private voteUpEmoteData?: { id: string | null, name: string };
  private voteDownEmoteData?: { id: string | null, name: string };
  private listenForReactionsInMessages: string[] = [];

  async checkIfSettingsAreCompleted() {
    const settings = await this.settingsService.get();

    const payload = {
      1: settings.discordBotToken,
      2: settings.requestChannelId,
      3: settings.announcementsChannelId,
      5: settings.voteUpEmojiResolver,
      6: settings.voteDownEmojiResolver
    };

    let pass = true;
    for (const data in payload) if (payload[data] === null) pass = false;

    return pass;
  }

  checkIfEmojiIsValid(emojiResolver: string) {
    const fromCache = this.discordBot.emojis.cache.find(ele => ele.name === emojiResolver);
    if (fromCache) return {
      id: fromCache.id,
      name: fromCache.name
    };

    const fromDefaults = surrogates.find(ele => ele === emojiResolver);
    if (fromDefaults) return {
      id: null,
      name: fromDefaults
    };

    return false;
  }

  /**
   * Checks if settings are correct,
   * if correct it saves emotes and channels to class properties
   */
  async checkIfSettingsAreCorrect() {
    const settings = await this.settingsService.get();

    let announcementsChannel = await this.discordBot!.channels.fetch(settings.announcementsChannelId);
    if (announcementsChannel === null) {
      this.stop();
      throw new AnnouncementsChannelDoesNotExistException();
    }

    let requestsChannel = await this.discordBot!.channels.fetch(settings.requestChannelId);
    if (requestsChannel === null) {
      this.stop();
      throw new RequestsChannelDoesNotExistException();
    }

    const voteUpEmote = this.checkIfEmojiIsValid(settings.voteUpEmojiResolver);
    if (voteUpEmote === false) {
      this.stop();
      throw new VoteUpEmoteDoesntExistException();
    }

    const voteDownEmote = this.checkIfEmojiIsValid(settings.voteDownEmojiResolver);
    if (voteDownEmote === false) {
      this.stop();
      throw new VoteDownEmoteDoesntExistException();
    }

    this.voteUpEmoteData = voteUpEmote;
    this.voteDownEmoteData = voteDownEmote;
    this.announcementsChannel = await (<TextChannel>announcementsChannel);
    this.requestsChannel = await (<TextChannel>requestsChannel);
  }

  /**
   * Start bot
   */
  async start() {
    // check if bot is running
    if (this.discordBot !== undefined) throw new BotIsAlreadyRunningException();

    // check if settings are complete
    if (!await this.checkIfSettingsAreCompleted()) throw new CompleteSettingsBeforeStartingBotException();

    // start the bot
    this.discordBot = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
      ],
      partials: ["MESSAGE", "CHANNEL", "REACTION"]
    });

    // get settings
    const settings = await this.settingsService.get();

    // login to discord
    await this.discordBot.login(settings.discordBotToken);

    // check if settings are correct
    await this.checkIfSettingsAreCorrect();

    // set event listeners
    await this.setDiscordBotEventListners();

  }

  /**
   * Stop bot
   */
  stop() {
    // if bot is already not running throw exception
    if (this.discordBot === undefined) throw new BotIsAlreadyNotRunningException();

    // destroy discord bot session
    this.discordBot.destroy();

    // remove discord bot client
    this.discordBot = undefined;

    // remove previously assigned channels
    this.announcementsChannel = undefined;
    this.requestsChannel = undefined;
  }

  getStatus() {
    return this.discordBot === undefined ? DiscordBotStatus.NOT_RUNNING : DiscordBotStatus.RUNNING;
  }

  async setDiscordBotEventListners() {
    this.discordBot.on("interactionCreate", async (interaction: Interaction) => {
      if (!interaction.isCommand()) return;

      switch (interaction.commandName) {
        case "requestemotechange":
          await this.handleEmoteChangeRequest(interaction);
          break;
      }
    });

    this.listenForReactionsInMessages = await this.emoteChangesService.getWithVoteMessageAndWithoutEndedVote()
      .then(res => res.map(ele => ele.voteMessageId));

    this.discordBot.on("messageReactionAdd", async (reaction, user) => {
      if (!reaction.partial) await reaction.fetch();
      if (!this.listenForReactionsInMessages.includes(reaction.message.id)) return;

      if (this.voteUpEmoteData.name === reaction.emoji.name) {
        console.log(`Voted Up!`);
        await this.emoteChangesService.addVoteToEmoteChange(reaction.message.id, "up");
      } else if (this.voteDownEmoteData.name === reaction.emoji.name) {
        await this.emoteChangesService.addVoteToEmoteChange(reaction.message.id, "down");
        console.log(`Voted Down!`);
      }
    });

    this.discordBot.on("messageReactionRemove", async (reaction, user) => {
      if (!reaction.partial) await reaction.fetch();
      if (!this.listenForReactionsInMessages.includes(reaction.message.id)) return;

      if (this.voteUpEmoteData.name === reaction.emoji.name) {
        await this.emoteChangesService.removeVoteToEmoteChange(reaction.message.id, "up");
      } else if (this.voteDownEmoteData.name === reaction.emoji.name) {
        await this.emoteChangesService.removeVoteToEmoteChange(reaction.message.id, "down");
      }
    });
  }

  async handleEmoteChangeRequest(interaction: any) {
    const serviceType = interaction.options.get("service_type").value;

    switch (serviceType) {
      case "bttv":
        await this.handleBttvEmoteChangeRequest(interaction);
        break;
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async createPendingDiscordVoteMessages() {
    if (this.discordBot === undefined) return;

    const pendingDiscordVoteMessages = await this.emoteChangesService.getWithoutVoteMessage();

    for (const val of pendingDiscordVoteMessages) {
      await this.createVoteMessage(val);
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async checkForEndedVotes() {
    if (this.discordBot === undefined) return;
    const emoteChanges = await this.emoteChangesService.getWithEndedVotes();

    for (const emoteChange of emoteChanges) {
      if (emoteChange.voteDown >= emoteChange.voteUp) {
        const message = await this.announcementsChannel.messages.fetch(emoteChange.voteMessageId);
        await message.edit({ content: "Głosowanie zakończyło się niepowodzeniem." });
      } else {
        const message = await this.announcementsChannel.messages.fetch(emoteChange.voteMessageId);
        await message.edit({ content: "Głosowanie zakończyło się powodzeniem." });
      }
    }
  }

  async createVoteMessage(emoteChange: EmoteChangeEntity) {
    const embeds = [];
    if (emoteChange.fromEmoteId !== null) {
      const emoteInfo = await this.bttvService.getEmoteInfo(emoteChange.fromEmoteId);

      const embed = new MessageEmbed()
        .setColor("#eb4034")
        .setTitle(`Zmiana z emotki ${emoteInfo.code}`)
        .setThumbnail(`https://cdn.betterttv.net/emote/${emoteInfo.id}/3x.gif`);

      embeds.push(embed);
    }

    const emoteInfo = await this.bttvService.getEmoteInfo(emoteChange.toEmoteId);

    const embed = new MessageEmbed()
      .setColor("#00c700")
      .setTitle(emoteChange.fromEmoteId === null ? `Dodanie emotki ${emoteInfo.code}` : `Zmiana na emotkę ${emoteInfo.code}`)
      .setThumbnail(`https://cdn.betterttv.net/emote/${emoteInfo.id}/3x.gif`);

    embeds.push(embed);

    const message = await this.announcementsChannel.send({
      content: "Rozpoczęto nowe głosowanie nad zmianą emotki!",
      embeds
    });

    await this.emoteChangesService.addVoteMessageIdToEmoteChangeRequest(message.id, emoteChange.id);
    this.listenForReactionsInMessages.push(message.id);

    if (this.voteUpEmoteData.id === null) await message.react(this.voteUpEmoteData.name);
    else await message.react(`<:${this.voteUpEmoteData.id}:${this.voteUpEmoteData.name}>`);

    if (this.voteDownEmoteData.id === null) await message.react(this.voteDownEmoteData.name);
    else await message.react(`<:${this.voteDownEmoteData.id}:${this.voteDownEmoteData.name}>`);
  }

  async handleBttvEmoteChangeRequest(interaction: any) {
    const fromEmoteId = interaction.options.get("from_emote_id").value;
    const toEmoteId = interaction.options.get("to_emote_id").value;

    try {
      await this.bttvService.createBttvEmoteChangeRequest({
        fromEmoteId,
        toEmoteId
      });

      return interaction.reply("Przyjeliśmy twoją propozycję, za chwilę bot wyśle głosowanie na kanał do tego przeznaczony.");
    } catch (e) {
      if (e instanceof EmoteDoesntExistException) {
        return interaction.reply(e.message);
      } else {
        throw e;
      }
    }
  }
}
