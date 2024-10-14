import { REST, Routes, SlashCommandBuilder } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID || "";
const TOKEN = process.env.BOT_TOKEN || "";

const commands = [
  new SlashCommandBuilder()
    .setName("checkraid")
    .setDescription(
      "Compara usuários no canal de voz com inscritos em um evento do Raid Helper."
    )
    .addChannelOption((option) =>
      option
        .setName("canal")
        .setDescription("Selecione um canal.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("evento_id")
        .setDescription("ID do evento no Raid Helper.")
        .setRequired(true)
    )
    .toJSON(),
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Registrando comandos de aplicação...");

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log("Comandos registrados com sucesso.");
  } catch (error) {
    console.error("Erro ao registrar comandos:", error);
  }
})();
