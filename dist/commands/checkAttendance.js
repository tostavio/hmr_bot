"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const raidHelperAPI_1 = require("../service/raidHelperAPI"); // Função que busca dados do Raid Helper
const dotenv_1 = __importDefault(require("dotenv"));
const embedBuilder_1 = require("../utils/embedBuilder"); // Importa o embed builder customizado
dotenv_1.default.config();
// Subclasse do Client para adicionar a propriedade `commands`
class ExtendedClient extends discord_js_1.Client {
    commands = new discord_js_1.Collection();
}
// Instancia o cliente usando a nova subclasse
const client = new ExtendedClient({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
    ],
});
// Mapa para armazenar quando um usuário entrou no canal de voz
const userVoiceTimes = new Map();
// Listener para trackear entrada e saída de canais de voz
client.on("voiceStateUpdate", (oldState, newState) => {
    const memberId = newState.id;
    // Se o usuário entrou no canal de voz
    if (!oldState.channel && newState.channel) {
        userVoiceTimes.set(memberId, Date.now()); // Armazena o timestamp de entrada
    }
    // Se o usuário saiu do canal de voz
    if (oldState.channel && !newState.channel) {
        const joinedTime = userVoiceTimes.get(memberId);
        if (joinedTime) {
            const duration = (Date.now() - joinedTime) / 1000; // Duração em segundos
            console.log(`${newState.member?.user.tag} ficou ${duration} segundos no canal.`);
            userVoiceTimes.delete(memberId); // Remove o usuário do mapa
        }
    }
});
// Comando para calcular o tempo de conexão com base no evento
client.commands.set("checkattendance", {
    data: { name: "checkattendance" },
    async execute(interaction) {
        const channel = interaction.options.getChannel("canal");
        const eventId = interaction.options.getString("evento_id");
        if (!channel ||
            !(channel instanceof discord_js_1.VoiceChannel || channel instanceof discord_js_1.TextChannel)) {
            await interaction.reply({
                content: "Por favor, selecione um canal de voz ou texto válido.",
                ephemeral: true,
            });
            return;
        }
        // Busca os dados do evento da API do Raid Helper
        const eventData = await (0, raidHelperAPI_1.getRaidHelperEventData)(eventId);
        if (!eventData || !eventData.signUps) {
            await interaction.reply({
                content: "Evento não encontrado ou sem participantes.",
                ephemeral: true,
            });
            return;
        }
        const startTime = eventData.startTime * 1000; // Convertendo para milissegundos
        const endTime = startTime + eventData.advancedSettings.duration * 60 * 1000; // Calculando o horário de término
        const eventDuration = endTime - startTime;
        const members = channel.members;
        const connectedUserIds = members.map((member) => member.id);
        const signUpIds = eventData.signUps.map((signUp) => signUp.userId);
        const attendedUsers = [];
        const missedUsers = [];
        // Verifica quem está conectado e se participou de 80% do evento
        for (const memberId of connectedUserIds) {
            const joinedTime = userVoiceTimes.get(memberId);
            if (joinedTime && signUpIds.includes(memberId)) {
                const timeConnected = endTime - joinedTime;
                const percentage = timeConnected / eventDuration;
                if (percentage >= 0.8) {
                    attendedUsers.push(`<@${memberId}>`); // Marca o usuário
                }
                else {
                    missedUsers.push(`<@${memberId}>`); // Marca o usuário
                }
            }
        }
        // Cria o embed usando o embedBuilder personalizado
        const embed = (0, embedBuilder_1.createEmbed)("Relatório de Presença", `Canal: <#${channel.id}>\nEvento: [Raid Helper Evento](https://raid-helper.dev/event/${eventId})`, [
            {
                name: `Usuários que participaram de mais de 80% do evento (${attendedUsers.length}):`,
                value: attendedUsers.join("\n") || "Nenhum",
            },
            {
                name: `Usuários que participaram de menos de 80% do evento (${missedUsers.length}):`,
                value: missedUsers.join("\n") || "Nenhum",
            },
        ]);
        await interaction.reply({ embeds: [embed] });
    },
});
client.login(process.env.BOT_TOKEN); // Login do bot usando a variável do .env
