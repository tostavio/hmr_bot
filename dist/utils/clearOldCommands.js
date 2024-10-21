"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearOldCommands = clearOldCommands;
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Carrega as variáveis de ambiente do arquivo .env
// Função para limpar os comandos antigos da API do Discord
async function clearOldCommands() {
    const rest = new discord_js_1.REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
    try {
        console.log("Buscando comandos antigos...");
        // Obtém todos os comandos globais registrados
        const oldCommands = await rest.get(discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID));
        if (Array.isArray(oldCommands)) {
            for (const command of oldCommands) {
                console.log(`Excluindo comando: ${command.name}`);
                await rest.delete(`${discord_js_1.Routes.applicationCommands(process.env.CLIENT_ID)}/${command.id}`);
            }
        }
        console.log("Todos os comandos antigos foram excluídos!");
    }
    catch (error) {
        console.error("Erro ao excluir comandos antigos:", error);
    }
}
