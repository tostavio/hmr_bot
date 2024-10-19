"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interactionCreate = {
    name: "interactionCreate",
    async execute(interaction) {
        if (!interaction.isChatInputCommand())
            return;
        const client = interaction.client; // Casting para ExtendedClient
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return;
        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            await interaction.reply({
                content: "Erro ao executar este comando!",
                ephemeral: true,
            });
        }
    },
};
exports.default = interactionCreate;
