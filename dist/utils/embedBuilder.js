"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmbed = createEmbed;
const discord_js_1 = require("discord.js");
/**
 * Função para gerar uma cor aleatória.
 */
function getRandomColor() {
    return Math.floor(Math.random() * 0xffffff);
}
/**
 * Função para criar um embed com título e descrição, com cor aleatória.
 */
function createEmbed(title, description) {
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(getRandomColor()); // Define a cor aleatória
    return embed;
}
