import { Client, GatewayIntentBits, Collection } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config(); // Carrega as variáveis do arquivo .env

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Collection<string, any>();

// Carregar comandos dinamicamente da pasta commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

// Quando o bot estiver pronto
client.once("ready", () => {
  console.log(`Bot logado como ${client.user?.tag}`);
});

// Listener para interações
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Houve um erro ao executar este comando!",
      ephemeral: true,
    });
  }
});

client.login(process.env.BOT_TOKEN); // Login do bot usando a variável do .env
