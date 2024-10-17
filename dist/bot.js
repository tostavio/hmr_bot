"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userVoiceTimes = void 0;
const discord_js_1 = require("discord.js");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("./database/config");
dotenv_1.default.config(); // Carrega as variáveis do arquivo .env
// Subclasse do Client para adicionar a propriedade `commands`
class ExtendedClient extends discord_js_1.Client {
    commands = new discord_js_1.Collection();
}
// Instancia o cliente usando a nova subclasse
const client = new ExtendedClient({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildModeration,
        discord_js_1.GatewayIntentBits.GuildEmojisAndStickers,
        discord_js_1.GatewayIntentBits.GuildIntegrations,
        discord_js_1.GatewayIntentBits.GuildWebhooks,
        discord_js_1.GatewayIntentBits.GuildInvites,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.GuildPresences,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.GuildMessageTyping,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.DirectMessageReactions,
        discord_js_1.GatewayIntentBits.DirectMessageTyping,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
// Mapa para armazenar quando um usuário entrou no canal de voz
exports.userVoiceTimes = new Map();
// Listener para trackear entrada e saída de canais de voz
client.on("voiceStateUpdate", (oldState, newState) => {
    const memberId = newState.id;
    // Se o usuário entrou no canal de voz
    if (!oldState.channel && newState.channel) {
        exports.userVoiceTimes.set(memberId, Date.now()); // Armazena o timestamp de entrada
        console.log(`Usuário ${memberId} entrou no canal de voz às ${new Date().toLocaleString()}`);
    }
    // Se o usuário saiu do canal de voz
    if (oldState.channel && !newState.channel) {
        const joinedTime = exports.userVoiceTimes.get(memberId);
        if (joinedTime) {
            const duration = (Date.now() - joinedTime) / 1000; // Duração em segundos
            console.log(`${newState.member?.user.tag} ficou ${duration} segundos no canal.`);
            exports.userVoiceTimes.delete(memberId); // Remove o usuário do mapa após sair do canal
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
    const command = require(filePath);
    // Verificação adicional para garantir que o comando tenha a estrutura esperada
    if (command && command.data && command.data.name) {
        client.commands.set(command.data.name, command);
    }
    else {
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
    const rest = new discord_js_1.REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
    try {
        console.log("Atualizando os comandos na API do Discord.");
        await rest.put(discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID), {
            body: commands,
        });
        console.log("Comandos registrados com sucesso!");
    }
    catch (error) {
        console.error("Erro ao registrar comandos:", error);
    }
}
// Quando o bot estiver pronto
client.once("ready", async () => {
    console.log(`Bot logado como ${client.user?.tag}`);
    (0, config_1.syncDatabase)();
    await deployCommands(); // Chama a função de atualização de comandos ao iniciar o bot
});
// Listener para interações
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    const command = client.commands.get(interaction.commandName);
    if (!command)
        return;
    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        await interaction.reply({
            content: "Houve um erro ao executar este comando!",
            ephemeral: true,
        });
    }
});
client.login(process.env.BOT_TOKEN); // Login do bot usando a variável do .env
