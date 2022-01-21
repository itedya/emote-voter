import {Injectable} from "@nestjs/common";
import {CommandHandler} from "../../interfaces/bot/command-handler";
import {CommandInteraction} from "discord.js";

@Injectable()
export class RequestEmoteChangeCommand implements CommandHandler {
    executeCommand(interaction: CommandInteraction) {
        const service = interaction.options.get("service", true);
        // switch (service.value) {
        //     case "7tv":
        //
        //         break;
        // }
        
    }

    handle7TVEmoteChange() {

    }
}
