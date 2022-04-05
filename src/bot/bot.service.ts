import { Injectable, Logger } from '@nestjs/common';
import { Client, Intents } from 'discord.js';
import { ConfigService } from '@nestjs/config';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

@Injectable()
export class BotService {
  constructor(private configService: ConfigService) {}

  async onApplicationBootstrap() {
    await this.initializeClient();
  }

  private client: Client;
  private logger: Logger = new Logger('BotService');

  async initializeClient() {
    this.client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });

    this.client.once('ready', async () => {
      this.logger.log('Bot Ready');
    });

    await this.client.login(this.configService.get<string>('discord.token'));
  }
}
