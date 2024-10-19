"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmbed = createEmbed;
const discord_js_1 = require("discord.js");
/**
 * Cria um embed com um título e descrição.
 * Ele adiciona automaticamente os campos, faz a divisão de texto se necessário,
 * e assegura que o embed não exceda 6000 caracteres, adicionando "..." quando necessário.
 */
function createEmbed(title, description, fields, maxLength = 1024) {
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(getRandomColor());
    // Calcula o total de caracteres iniciais (título + descrição)
    let totalLength = title.length + description.length;
    // Função auxiliar para adicionar campos e monitorar o tamanho total
    const addField = (name, value) => {
        totalLength += name.length + value.length;
        embed.addFields({ name, value });
    };
    // Para cada campo, verifica e divide se o valor ultrapassar o limite
    for (const field of fields) {
        const parts = splitText(field.value, maxLength);
        for (let index = 0; index < parts.length; index++) {
            const fieldName = index === 0 ? field.name : `${field.name} [Parte ${index + 1}]`;
            // Se o próximo campo ultrapassar o limite de 6000 caracteres, adiciona "..." e para
            const fieldLength = fieldName.length + parts[index].length;
            if (totalLength + fieldLength > 5800) {
                const remainingSpace = 5800 - totalLength - 3; // Reserva espaço para "..."
                const truncatedValue = parts[index].slice(0, remainingSpace);
                addField(fieldName, `${truncatedValue}...`);
                return embed; // Retorna o embed com o campo truncado
            }
            addField(fieldName, parts[index]);
        }
    }
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
