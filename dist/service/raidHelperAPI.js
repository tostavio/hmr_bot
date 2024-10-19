"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRaidHelperEventData = getRaidHelperEventData;
exports.getRaidHelperDkpData = getRaidHelperDkpData;
const axios_1 = __importDefault(require("axios"));
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
        throw new Error("Erro ao buscar dados do evento.");
    }
}
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
        throw new Error("Erro ao buscar dados do DKP.");
    }
}
