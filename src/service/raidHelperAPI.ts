import axios from "axios";
import { DkpResponse, EventResponse } from "./raidHelper.types";

export async function getRaidHelperEventData(eventId: string) {
  const raidHelperApiToken = process.env.RAID_HELPER_API_TOKEN;
  try {
    const response = await axios.get<EventResponse>(
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

export async function getRaidHelperDkpData(roleId: string, guildId: string) {
  const raidHelperApiToken = process.env.RAID_HELPER_API_TOKEN;
  try {
    const response = await axios.get<DkpResponse>(
      `https://raid-helper.dev/api/v2/servers/${guildId}/entities/${roleId}/dkp`,
      {
        headers: {
          Authorization: `${raidHelperApiToken}`,
        },
      }
    );
    return response.data.result;
  } catch (error) {
    console.error("Erro ao chamar a API do RaidHelper:", error);
    throw new Error("Erro ao buscar dados do DKP.");
  }
}
