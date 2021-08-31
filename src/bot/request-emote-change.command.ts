import { Injectable } from '@nestjs/common';
import { Client, Interaction } from "discord.js";
import { BttvService } from "@/bttv/bttv.service";
import { EmoteChangesService } from "@/emote-changes/emote-changes.service";
import { ServiceType } from "@/bot/enums/service-type.enum";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class RequestEmoteChangeCommand {
  constructor(
    @InjectQueue("pending-vote-messages") private pendingVoteMessagesQueue: Queue,
    private bttvService: BttvService,
    private emoteChangesService: EmoteChangesService
  ) {
  }

  async initialize(discordBot: Client) {
    discordBot.on('interactionCreate', async (interaction: Interaction) => {
      if (!interaction.isCommand()) return;
      if (interaction.commandName !== "requestemotechange") return;

      const serviceType = ServiceType[interaction.options.getString('service_type')];
      const fromEmoteId = interaction.options.getString('from_emote_id');
      const toEmoteId = interaction.options.getString('to_emote_id');

      const validated = await this.validate(interaction, serviceType, fromEmoteId, toEmoteId);
      if (!validated) return;

      await this.handle(interaction, serviceType, fromEmoteId, toEmoteId);
    })
  }

  protected async validate(interaction: any, serviceType: ServiceType, fromEmoteId: string, toEmoteId: string): Promise<boolean> {
    if (fromEmoteId === toEmoteId) {
      await interaction.reply('Emotka z parametru from_emote_id nie może być taka sama jak z paramteru to_emote_id');
      return false;
    }

    const fromEmoteExists = await this.bttvService.getEmoteInfo(fromEmoteId);
    const toEmoteExists = await this.bttvService.getEmoteInfo(toEmoteId);

    if (!fromEmoteExists) {
      await interaction.reply('Emotka z parametru from_emote_id nie istnieje!');
      return false;
    }

    if (!toEmoteExists) {
      await interaction.reply('Emotka z parametru to_emote_id nie istnieje!');
      return false;
    }

    return true;
  }

  protected async handle(interaction: any, serviceType: ServiceType, fromEmoteId: string, toEmoteId: string) {
    const emoteChange = await this.emoteChangesService.create(serviceType, {
      fromEmoteId,
      toEmoteId
    });

    await interaction.reply('Przyjęto propozycje zmiany emotki, bot za chwilę utworzy głosowanie na kanale do tego przeznaczonym!');
    await this.pendingVoteMessagesQueue.add(emoteChange);
  }
}
