import {CommandInteraction} from "discord.js";

export interface CommandHandler {
    executeCommand: (interaction: CommandInteraction) => void
}
