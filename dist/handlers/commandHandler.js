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
exports.loadCommands = loadCommands;
exports.deployCommands = deployCommands;
const discord_js_1 = require("discord.js");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Carrega as variáveis do arquivo .env
// Função para carregar comandos dinamicamente
function loadCommands(client) {
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
async function deployCommands(client) {
    const commands = loadCommands(client); // Carrega os comandos dinamicamente
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
// Verifica se está no ambiente de produção (dist)
function isDist() {
    return __dirname.includes("dist");
}
