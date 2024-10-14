import axios from "axios";

export async function getRaidHelperEventData(eventId: string) {
  const raidHelperApiToken = process.env.RAID_HELPER_API_TOKEN;
  try {
    const response = await axios.get(
      `https://raid-helper.dev/api/v2/events/${eventId}`,
      {
        headers: {
          Authorization: `${raidHelperApiToken}`,
        },
        params: {
          IncludeSignUps: true,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao chamar a API do RaidHelper:", error);
    throw new Error("Erro ao buscar dados do evento.");
  }
}
