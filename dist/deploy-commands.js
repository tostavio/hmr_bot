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
const discord_js_1 = require("discord.js");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Carrega as variáveis do arquivo .env
const commands = [];
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
    const command = require(path.join(commandsPath, file));
    commands.push(command.data.toJSON()); // Aqui precisamos do toJSON para serializar corretamente
}
// Inicializando a REST API para registrar os comandos
const rest = new discord_js_1.REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
(async () => {
    try {
        console.log("Atualizando os comandos manualmente.");
        await rest.put(discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID), {
            body: commands,
        });
        console.log("Comandos registrados com sucesso!");
    }
    catch (error) {
        console.error("Erro ao registrar comandos:", error);
    }
})();
