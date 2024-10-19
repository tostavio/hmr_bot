"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRaidHelperEventData = getRaidHelperEventData;
exports.getRaidHelperDkpData = getRaidHelperDkpData;
exports.getAllEvents = getAllEvents;
const axios_1 = __importDefault(require("axios"));
// Função para obter dados de um evento
async function getRaidHelperEventData(eventId) {
    const raidHelperApiToken = process.env.RAID_HELPER_API_TOKEN;
    try {
        const response = await axios_1.default.get(`https://raid-helper.dev/api/v2/events/${eventId}`, {
            headers: {
                Authorization: `${raidHelperApiToken}`,
            },
            params: {
                IncludeSignUps: true,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Erro ao chamar a API do RaidHelper:", error);
        return { error: "Erro ao buscar dados do evento", details: error };
    }
}
// Função para obter dados de DKP
async function getRaidHelperDkpData(roleId, guildId) {
    const raidHelperApiToken = process.env.RAID_HELPER_API_TOKEN;
    try {
        const response = await axios_1.default.get(`https://raid-helper.dev/api/v2/servers/${guildId}/entities/${roleId}/dkp`, {
            headers: {
                Authorization: `${raidHelperApiToken}`,
            },
        });
        return response.data.result;
    }
    catch (error) {
        console.error("Erro ao chamar a API do RaidHelper:", error);
        return { error: "Erro ao buscar dados do DKP", details: error };
    }
}
// Função para obter todos os eventos
async function getAllEvents(guildId) {
    const raidHelperApiToken = process.env.RAID_HELPER_API_TOKEN;
    try {
        const response = await axios_1.default.get(`https://raid-helper.dev/api/v3/servers/${guildId}/events`, {
            headers: {
                Authorization: `${raidHelperApiToken}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Erro ao chamar a API do RaidHelper:", error);
        return { error: "Erro ao buscar eventos", details: error };
    }
}
