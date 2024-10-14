import { EmbedBuilder } from "discord.js";

/**
 * Cria um embed com um título e descrição.
 * Ele adiciona automaticamente os campos e faz a divisão de texto, se necessário.
 */
export function createEmbed(
  title: string,
  description: string,
  fields: { name: string; value: string }[],
  maxLength = 1024
): EmbedBuilder {
  const embed = new EmbedBuilder().setTitle(title).setDescription(description);

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
function splitText(text: string, maxLength = 1024): string[] {
  const parts = [];
  while (text.length > maxLength) {
    const slice = text.slice(0, maxLength);
    parts.push(slice);
    text = text.slice(maxLength);
  }
  parts.push(text);
  return parts;
}
