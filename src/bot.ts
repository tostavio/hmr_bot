import { Client, Collection } from "discord.js";
import * as dotenv from "dotenv";
import { intents } from "./config/intents";
import { loadEvents } from "./handlers/eventHandler";
import { ExtendedClient } from "./types/ExtendedClient"; // Importa a interface personalizada

dotenv.config();

// Instanciar o cliente usando Client, mas tipar como ExtendedClient
const client = new Client({
  intents: intents,
}) as ExtendedClient; // Faz o casting para ExtendedClient

// Inicializar a coleção de comandos no cliente
client.commands = new Collection();

// Carregar eventos dinamicamente
loadEvents(client);

// Login do bot
client.login(process.env.BOT_TOKEN);
