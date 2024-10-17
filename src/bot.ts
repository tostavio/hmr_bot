import {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
  VoiceState,
} from "discord.js";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

import { syncDatabase } from "./database/config";

dotenv.config(); // Carrega as variáveis do arquivo .env

// Definição do tipo para o comando
interface Command {
  data: {
    name: string;
    toJSON: () => any; // Adiciona o método toJSON para os comandos
  };
  execute: (interaction: any) => Promise<void>;
}

// Subclasse do Client para adicionar a propriedade `commands`
class ExtendedClient extends Client {
  public commands: Collection<string, Command> = new Collection();
}

// Instancia o cliente usando a nova subclasse
const client = new ExtendedClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
});

// Mapa para armazenar quando um usuário entrou no canal de voz
export const userVoiceTimes = new Map<string, number>();

// Listener para trackear entrada e saída de canais de voz
client.on("voiceStateUpdate", (oldState: VoiceState, newState: VoiceState) => {
  const memberId = newState.id;

  // Se o usuário entrou no canal de voz
  if (!oldState.channel && newState.channel) {
    userVoiceTimes.set(memberId, Date.now()); // Armazena o timestamp de entrada
    console.log(
      `Usuário ${memberId} entrou no canal de voz às ${new Date().toLocaleString()}`
    );
  }

  // Se o usuário saiu do canal de voz
  if (oldState.channel && !newState.channel) {
    const joinedTime = userVoiceTimes.get(memberId);
    if (joinedTime) {
      const duration = (Date.now() - joinedTime) / 1000; // Duração em segundos
      console.log(
        `${newState.member?.user.tag} ficou ${duration} segundos no canal.`
      );
      userVoiceTimes.delete(memberId); // Remove o usuário do mapa após sair do canal
    }
  }
});

// Função para ajustar caminho dependendo do ambiente (src ou dist)
const getCommandsPath = () => {
  const isDist = __dirname.includes("dist");
  return isDist
    ? path.join(__dirname, "commands") // Usar a pasta 'commands' dentro de 'dist' em produção
    : path.join(__dirname, "commands"); // Usar 'commands' no desenvolvimento com ts-node
};

// Carregar comandos dinamicamente da pasta commands
const commandsPath = getCommandsPath();
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(__dirname.includes("dist") ? ".js" : ".ts"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command: Command = require(filePath);

  // Verificação adicional para garantir que o comando tenha a estrutura esperada
  if (command && command.data && command.data.name) {
    client.commands.set(command.data.name, command);
  } else {
    console.error(`Erro ao carregar o comando no arquivo ${file}.`);
  }
}

// Função para atualizar os comandos na API do Discord
async function deployCommands() {
  const commands = [];
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    commands.push(command.data.toJSON());
  }

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

// Quando o bot estiver pronto
client.once("ready", async () => {
  console.log(`Bot logado como ${client.user?.tag}`);

  syncDatabase();

  await deployCommands(); // Chama a função de atualização de comandos ao iniciar o bot
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
