"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmbed = createEmbed;
const discord_js_1 = require("discord.js");
/**
 * Cria um embed com um título e descrição.
 * Ele adiciona automaticamente os campos, faz a divisão de texto, se necessário, e atribui uma cor aleatória.
 */
function createEmbed(title, description, fields, maxLength = 1024) {
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(getRandomColor()); // Atribui uma cor aleatória
    // Para cada campo, verifica e divide se o valor ultrapassar o limite
    fields.forEach((field) => {
        const parts = splitText(field.value, maxLength);
        parts.forEach((part, index) => {
            embed.addFields({
                name: index === 0 ? field.name : `${field.name} [Parte ${index + 1}]`,
                value: part,
            });
        });
    });
    return embed;
}
/**
 * Divide um texto em partes menores para evitar ultrapassar o limite de caracteres.
 */
function splitText(text, maxLength = 1024) {
    const parts = [];
    while (text.length > maxLength) {
        const slice = text.slice(0, maxLength);
        parts.push(slice);
        text = text.slice(maxLength);
    }
    parts.push(text);
    return parts;
}
/**
 * Gera uma cor aleatória para o embed.
 */
function getRandomColor() {
    // Gera uma cor hexadecimal aleatória
    return Math.floor(Math.random() * 0xffffff);
}
