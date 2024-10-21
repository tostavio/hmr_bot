import {
  CommandInteraction,
  TextChannel,
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  GuildMember,
  ComponentType,
} from "discord.js";

const data = new SlashCommandBuilder()
  .setName("message")
  .setDescription("Gerencia mensagens no canal de interação")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("delete")
      .setDescription("Exclui as últimas 100 mensagens do canal")
  );

async function execute(interaction: CommandInteraction) {
  console.log("[LOG] Comando iniciado para excluir as mensagens.");

  // Verificar se o usuário tem uma das roles
  const member = interaction.member as GuildMember;
  const hasPermission =
    member.roles.cache.has("1013535396002541639") ||
    member.roles.cache.has("1262905761126813807");

  if (!hasPermission) {
    await interaction.reply({
      content: "Você não tem permissão para executar este comando.",
      ephemeral: true,
    });
    return;
  }

  // Verificar se o canal é de texto
  const interactionChannel = interaction.channel;

  if (!interactionChannel || !(interactionChannel instanceof TextChannel)) {
    await interaction.reply({
      content: "Este comando só pode ser usado em canais de texto.",
      ephemeral: true,
    });
    return;
  }

  // Criar o botão de confirmação
  const confirmButton = new ButtonBuilder()
    .setCustomId("confirm_delete")
    .setLabel("Tem certeza que deseja exclcuir as últimas 100 mensagens?")
    .setStyle(ButtonStyle.Danger);

  const cancelButton = new ButtonBuilder()
    .setCustomId("cancel_delete")
    .setLabel("Cancelar")
    .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    confirmButton,
    cancelButton
  );

  await interaction.reply({
    content: "Você tem certeza que deseja excluir as últimas 100 mensagens?",
    components: [row],
    ephemeral: true,
  });

  try {
    // Criar o collector para aguardar a interação do botão
    const collector = interactionChannel.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 120000, // 2 minutos para o usuário responder
    });

    collector.on("collect", async (collectInteraction) => {
      if (collectInteraction.customId === "confirm_delete") {
        // Confirma a exclusão
        const fetchedMessages = await interactionChannel.messages.fetch({
          limit: 100,
        });
        await interactionChannel.bulkDelete(fetchedMessages, true);

        await collectInteraction.update({
          content: "As últimas 100 mensagens foram excluídas com sucesso.",
          components: [],
        });
        return;
      }
      if (collectInteraction.customId === "cancel_delete") {
        // Cancelar a exclusão
        await collectInteraction.update({
          content: "A exclusão foi cancelada.",
          components: [],
        });
        return;
      }
      collector.stop();
    });

    collector.on("end", (_, reason) => {
      if (reason === "time") {
        interaction.editReply({
          content: "Tempo esgotado. A exclusão foi cancelada.",
          components: [],
        });
      }
    });
  } catch (error) {
    console.error("Erro ao excluir as mensagens:", error);
    await interaction.editReply({
      content: `Ocorreu um erro ao tentar excluir as mensagens: ${
        (error as Error).message
      }`,
      components: [],
    });
  }
}

export default { data, execute };
