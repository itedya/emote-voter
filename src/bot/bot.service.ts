import {Injectable, Logger} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {Client, Intents} from "discord.js";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class BotService {
    constructor(private prismaService: PrismaService,
                private configService: ConfigService) {
    }

    private logger = new Logger("BotService");
    private client: Client;

    async onApplicationBootstrap() {
        this.client = new Client({ intents: [Intents.FLAGS.GUILDS] });

        this.client.once('ready', () => {
            this.logger.log("Discord client ready!");
        });

        await this.client.login(this.configService.get<string>("discord.token"));
    }
}
