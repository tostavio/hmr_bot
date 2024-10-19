"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intents = void 0;
const discord_js_1 = require("discord.js");
exports.intents = [
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
];
