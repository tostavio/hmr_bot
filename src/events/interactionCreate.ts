import { Interaction } from "discord.js";
import { ExtendedClient } from "../types/ExtendedClient"; // Usando ExtendedClient

const interactionCreate = {
  name: "interactionCreate",
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const client = interaction.client as ExtendedClient; // Casting para ExtendedClient
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Erro ao executar este comando!",
        ephemeral: true,
      });
    }
  },
};

export default interactionCreate;
