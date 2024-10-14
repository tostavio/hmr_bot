import {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} from "discord.js";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

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
    GatewayIntentBits.GuildVoiceStates,
  ],
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
  client.commands.set(command.data.name, command);
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
