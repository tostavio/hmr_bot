import {
  SlashCommandBuilder,
  CommandInteraction,
  ChannelType,
  VoiceChannel,
  TextChannel,
} from "discord.js";
import { getRaidHelperEventData } from "../service/raidHelperAPI";
import { createEmbed } from "../utils/embedBuilder";

export const data = new SlashCommandBuilder()
  .setName("checkraid")
  .setDescription(
    "Compara usuários no canal de voz com inscritos em um evento do Raid Helper."
  )
  .addChannelOption((option) =>
    option
      .setName("canal")
      .setDescription("Selecione um canal.")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("evento_id")
      .setDescription("ID do evento no Raid Helper.")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  const channel = interaction.options.get("canal")?.channel; // Usando get() para recuperar a opção de canal
  const eventId = interaction.options.get("evento_id")?.value as string; // Garantindo que evento_id é string

  // Verificar se o canal existe e é um canal de voz ou texto
  if (
    !channel ||
    !(channel instanceof TextChannel || channel instanceof VoiceChannel)
  ) {
    await interaction.reply({
      content: "Por favor, selecione um canal de voz ou texto válido.",
      ephemeral: true,
    });
    return;
  }

  // Se for um canal de texto, verificar se ele está associado a um canal de voz
  let targetChannel = channel;
  if (
    channel instanceof TextChannel &&
    channel.parent &&
    channel.parent.type === ChannelType.GuildVoice
  ) {
    targetChannel = channel.parent as VoiceChannel;
  }

  // Verificar se o canal alvo é de voz
  if (!(targetChannel instanceof VoiceChannel)) {
    await interaction.reply({
      content: "Este comando só pode ser usado em canais de voz.",
      ephemeral: true,
    });
    return;
  }

  const members = targetChannel.members;
  const voiceUserIds = members.map((member) => member.id);

  // Chama a API do Raid Helper para buscar dados do evento
  const eventData = await getRaidHelperEventData(eventId);

  if (!eventData || !eventData.signUps) {
    await interaction.reply({
      content: "Evento não encontrado ou sem participantes.",
      ephemeral: true,
    });
    return;
  }

  const eventUserIds = eventData.signUps
    .filter((signUp) => signUp.status === "primary")
    .map((signUp) => signUp.userId);

  // Comparar listas de IDs
  const usersInVoiceAndEvent = voiceUserIds.filter((id) =>
    eventUserIds.includes(id)
  );
  const usersInVoiceNotInEvent = voiceUserIds.filter(
    (id) => !eventUserIds.includes(id)
  );
  const usersInEventNotInVoice = eventUserIds.filter(
    (id) => !voiceUserIds.includes(id)
  );

  const embed = createEmbed(
    "Comparação de Usuários",
    `Canal: ${targetChannel.name}`
  );
  embed.addFields(
    {
      name: `Usuários no canal e inscritos (${usersInVoiceAndEvent.length}):`,
      value: usersInVoiceAndEvent.join("\n") || "Nenhum",
    },
    {
      name: `Usuários no canal mas NÃO inscritos (${usersInVoiceNotInEvent.length}):`,
      value: usersInVoiceNotInEvent.join("\n") || "Nenhum",
    },
    {
      name: `Usuários inscritos mas NÃO no canal (${usersInEventNotInVoice.length}):`,
      value: usersInEventNotInVoice.length.toString(),
    }
  );

  await interaction.reply({ embeds: [embed] });
}
