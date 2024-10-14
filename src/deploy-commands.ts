import { REST, Routes } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config(); // Carrega as variáveis do arquivo .env

const commands: any[] = [];

// Carregar comandos dinamicamente da pasta commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  commands.push(command.data.toJSON());
}

// Inicializando a REST API para registrar os comandos
const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);

(async () => {
  try {
    console.log("Atualizando os comandos manualmente.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      body: commands,
    });

    console.log("Comandos registrados com sucesso!");
  } catch (error) {
    console.error(error);
  }
})();
