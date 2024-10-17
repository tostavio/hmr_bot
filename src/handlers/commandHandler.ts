import { REST, Routes } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";
import { ExtendedClient } from "../types/ExtendedClient";

dotenv.config(); // Carrega as variáveis do arquivo .env

// Função para carregar comandos dinamicamente
export function loadCommands(client: ExtendedClient) {
  const commandsPath = path.join(__dirname, "../commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(isDist() ? ".js" : ".ts"));

  const commands = [];
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file)).default;
    client.commands.set(command.data.name, command); // Agora reconhece `client.commands`
    commands.push(command.data.toJSON()); // Serializa o comando para registrar na API do Discord
  }

  return commands;
}

// Função para registrar os comandos na API do Discord
export async function deployCommands(client: ExtendedClient) {
  const commands = loadCommands(client); // Carrega os comandos dinamicamente

  const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);

  try {
    console.log("Atualizando os comandos na API do Discord.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      body: commands,
    });

    console.log("Comandos registrados com sucesso!");
  } catch (error) {
    console.error("Erro ao registrar comandos:", error);
  }
}

// Verifica se está no ambiente de produção (dist)
function isDist(): boolean {
  return __dirname.includes("dist");
}
