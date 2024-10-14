import { EmbedBuilder } from "discord.js";

/**
 * Função para gerar uma cor aleatória.
 */
function getRandomColor(): number {
  return Math.floor(Math.random() * 0xffffff);
}

/**
 * Função para criar um embed com título e descrição, com cor aleatória.
 */
export function createEmbed(title: string, description: string) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(getRandomColor()); // Define a cor aleatória

  return embed;
}
