import {Injectable, Logger} from "@nestjs/common";
import {Client} from "discord.js";
import {ConfigService} from "@nestjs/config";
import commands from "./commands";

@Injectable()
export class BotBootstraperService {
    constructor(private configService: ConfigService) {
    }

    private logger = new Logger("BotBootstrapService");

    async seedCommandsForAllServers(client: Client) {
        client.guilds.cache.forEach(guild => {
            commands.forEach(command => guild.commands.create(command.toJSON()));
        });
        this.logger.log("Commands seeded");
    }
}
