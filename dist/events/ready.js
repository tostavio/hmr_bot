"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../database/config");
const commandHandler_1 = require("../handlers/commandHandler");
const ready = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(`Bot logado como ${client.user?.tag}`);
        // Sincronizar banco de dados
        await (0, config_1.syncDatabase)();
        // Registrar os comandos
        await (0, commandHandler_1.deployCommands)(client);
    },
};
exports.default = ready;
