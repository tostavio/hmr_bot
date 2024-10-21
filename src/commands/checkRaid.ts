import {
  ChannelType,
  CommandInteraction,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { compareUsersInChannelAndEvent } from "../utils/compareUsersInChannelAndEvent";
import { createEmbed } from "../utils/embedBuilder";
import { formatUsers } from "../utils/formatUsers";
import { validateVoiceChannel } from "../utils/validateVoiceChannel";

const data = new SlashCommandBuilder()
  .setName("raid")
  .setDescription("Gerencia comparações de usuários em eventos de raid")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("check")
      .setDescription(
        "Compara usuários no canal de voz com inscritos em um evento do Raid Helper."
      )
      .addChannelOption((option) =>
        option
          .setName("canal")
          .setDescription("Selecione um canal de voz.")
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildVoice)
      )
      .addStringOption((option) =>
        option
          .setName("evento_id")
          .setDescription("ID do evento no Raid Helper.")
          .setRequired(true)
      )
  );

async function execute(interaction: CommandInteraction) {
  console.log("[LOG] Comando iniciado.");
  const eventId = interaction.options.get("evento_id")?.value as string;
  console.log(`[LOG] ID do evento: ${eventId}`);

  // Valida e obtém o canal de voz
  const targetChannel = await validateVoiceChannel(interaction);
  if (!targetChannel) {
    await interaction.reply({
      content: "O canal selecionado não é um canal de voz válido.",
      ephemeral: true,
    });
    return;
  }

  await interaction.reply({
    content: "Iniciando comparação de usuários...",
    ephemeral: true,
  });

  await interaction.editReply({
    content: "Processando a comparação de usuários, aguarde...",
  });

  // Compara usuários no canal de voz com os inscritos no evento
  const comparisonData = await compareUsersInChannelAndEvent(
    targetChannel,
    eventId
  );

  if (!comparisonData) {
    console.error("[ERROR] Evento não encontrado ou sem participantes.");
    await interaction.editReply({
      content: "Evento não encontrado ou sem participantes.",
    });
    return;
  }

  const {
    usersInVoiceAndEvent,
    usersInVoiceNotInEvent,
    usersInEventNotInVoice,
    members,
    eventData,
  } = comparisonData;

  console.log(
    `[LOG] Usuários no canal e inscritos: ${usersInVoiceAndEvent.length}`
  );
  console.log(
    `[LOG] Usuários no canal mas NÃO inscritos: ${usersInVoiceNotInEvent.length}`
  );
  console.log(
    `[LOG] Usuários inscritos mas NÃO no canal: ${usersInEventNotInVoice.length}`
  );

  // Cria embed com os resultados da comparação
  const fields = [
    {
      name: `Usuários inscritos mas NÃO no canal (${usersInEventNotInVoice.length}):`,
      value: await formatUsers(
        usersInEventNotInVoice,
        members,
        eventData,
        interaction
      ),
    },
  ];

  const eventUrl = `https://raid-helper.dev/event/${eventId}`;
  const embed = createEmbed(
    "Comparação de Usuários",
    `Canal: <#${targetChannel.id}>\nEvento: [Clique aqui](${eventUrl})`,
    fields
  );

  // Check if the interaction channel is a text-based channel before sending a message
  const interactionChannel = interaction.channel;

  if (interactionChannel instanceof TextChannel) {
    await interactionChannel.send({
      embeds: [embed],
    });
  } else {
    console.error("[ERROR] Canal de texto não detectado.");
    await interaction.editReply({
      content:
        "O canal atual não é um canal de texto válido para enviar mensagens.",
    });
    return;
  }

  console.log("[LOG] Resposta enviada");
}

export default { data, execute };
