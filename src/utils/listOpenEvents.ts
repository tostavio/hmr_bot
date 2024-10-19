import { CommandInteraction } from "discord.js";
import { PostedEvent } from "../service/raidHelper.types";
import { getAllEvents } from "../service/raidHelperAPI";

export async function listOpenEvents(interaction: CommandInteraction) {
  try {
    // Recupera o guildId do servidor da interação
    const guildId = interaction.guild?.id;
    if (!guildId) {
      await interaction.reply({
        content: "Não foi possível recuperar o ID da guild.",
        ephemeral: true,
      });
      return [];
    }

    // Chama a função para recuperar todos os eventos
    const eventsResponse = await getAllEvents(guildId);

    if ("error" in eventsResponse) {
      await interaction.reply({
        content: "Houve um erro ao recuperar os eventos.",
        ephemeral: true,
      });
      return [];
    }

    // Recupera a hora atual em segundos (Unix Timestamp)
    const now = Math.floor(Date.now() / 1000);

    // Filtra eventos que ainda não fecharam e que ainda não terminaram
    const ongoingOrUpcomingEvents: PostedEvent[] =
      eventsResponse.postedEvents.filter(
        (event) => event.closeTime > now || event.endTime > now
      );

    // Retorna os eventos filtrados
    return ongoingOrUpcomingEvents;
  } catch (error) {
    console.error("Erro ao recuperar eventos:", error);
    await interaction.reply({
      content: "Houve um erro ao recuperar os eventos.",
      ephemeral: true,
    });
    return [];
  }
}
