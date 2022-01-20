import {SlashCommandBuilder} from "@discordjs/builders";

const commands = [
    new SlashCommandBuilder()
        .setName("request-emote-change")
        .addStringOption(option => option.setName("service")
                .setDescription("Service name")
                .setRequired(true)
                .addChoice("7tv", "7tv"))
        .setDescription("Request emote change!")
];

export default commands;
