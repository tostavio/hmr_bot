import { EmbedBuilder } from "discord.js";

export function createEmbed(
  title: string,
  description: string,
  color = 0x00ae86
) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color);
}
