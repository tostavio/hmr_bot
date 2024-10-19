import {
  ChannelType,
  CommandInteraction,
  TextChannel,
  VoiceChannel,
} from "discord.js";

// Função para validar se o canal é de voz
export async function validateVoiceChannel(interaction: CommandInteraction) {
  const channel = interaction.options.get("canal")?.channel;

  if (
    !channel ||
    !(channel instanceof VoiceChannel || channel instanceof TextChannel)
  ) {
    await interaction.reply({
      content: "Por favor, selecione um canal de voz ou texto válido.",
      ephemeral: true,
    });
    return null;
  }

  if (channel instanceof TextChannel && channel.parent) {
    const voiceChannel = channel.parent.children.cache.find(
      (ch): ch is VoiceChannel => ch.type === ChannelType.GuildVoice
    );
    return voiceChannel || null;
  }

  return channel instanceof VoiceChannel ? channel : null;
}
