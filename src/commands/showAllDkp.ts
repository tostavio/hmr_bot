import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getRaidHelperDkpData } from "../service/raidHelperAPI";
import { sendUsersDkpMessage } from "../utils/sendUsersDkpMessage";
import { isTextChannel } from "../utils/verifyChannel";

const data = new SlashCommandBuilder()
  .setName("dkp") // Primary command
  .setDescription("Comandos de DKP")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("show") // Subcommand
      .setDescription("Exibe o dkp de todas as pessoas de um cargo")
      .addRoleOption((option) =>
        option
          .setName("role")
          .setDescription("Selecione uma role.")
          .setRequired(true)
      )
  );

async function execute(interaction: CommandInteraction) {
  console.log("[LOG] Comando iniciado.");
  const roleId = interaction.options.get("role")?.value as string;
  const guildId = interaction.guildId;

  if (!roleId) {
    await interaction.reply({
      content: "Por favor, selecione uma role válida.",
      ephemeral: true,
    });
    return;
  }

  if (!guildId) {
    await interaction.reply({
      content: "Por favor, use o comando em um servidor.",
      ephemeral: true,
    });
    return;
  }

  // Check if the interaction channel is a text-based channel before sending a message
  const interactionChannel = interaction.channel;

  if (!isTextChannel(interactionChannel)) {
    await interaction.reply({
      content: "Por favor, use canal de texto válido.",
      ephemeral: true,
    });
    return;
  }

  const usersDkp = await getRaidHelperDkpData(roleId, guildId);

  if ("error" in usersDkp) {
    await interaction.reply({
      content: "Não foi possível obter os dados de DKP.",
      ephemeral: true,
    });
    return;
  }

  if (!usersDkp) {
    await interaction.reply({
      content: "Não foi possível obter os dados de DKP.",
      ephemeral: true,
    });
    return;
  }

  sendUsersDkpMessage(usersDkp, interaction);
}

export default { data, execute };
