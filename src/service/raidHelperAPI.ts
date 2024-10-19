import axios from "axios";
import {
  Dkp,
  DkpResponse,
  EventResponse,
  EventsResponse,
} from "./raidHelper.types";

// Define um tipo que pode ser os dados esperados ou o erro
type ApiError = { error: string; details: unknown };

// Função para obter dados de um evento
export async function getRaidHelperEventData(
  eventId: string
): Promise<EventResponse | ApiError> {
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
    return { error: "Erro ao buscar dados do evento", details: error };
  }
}

// Função para obter dados de DKP
export async function getRaidHelperDkpData(
  roleId: string,
  guildId: string
): Promise<Dkp[] | ApiError> {
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
    return { error: "Erro ao buscar dados do DKP", details: error };
  }
}

// Função para obter todos os eventos
export async function getAllEvents(
  guildId: string
): Promise<EventsResponse | ApiError> {
  const raidHelperApiToken = process.env.RAID_HELPER_API_TOKEN;
  try {
    const response = await axios.get<EventsResponse>(
      `https://raid-helper.dev/api/v3/servers/${guildId}/events`,
      {
        headers: {
          Authorization: `${raidHelperApiToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao chamar a API do RaidHelper:", error);
    return { error: "Erro ao buscar eventos", details: error };
  }
}
