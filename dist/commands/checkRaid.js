"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const raidHelperAPI_1 = require("../service/raidHelperAPI");
const embedBuilder_1 = require("../utils/embedBuilder");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("checkraid")
    .setDescription("Compara usuários no canal de voz com inscritos em um evento do Raid Helper.")
    .addChannelOption((option) => option
    .setName("canal")
    .setDescription("Selecione um canal.")
    .setRequired(true))
    .addStringOption((option) => option
    .setName("evento_id")
    .setDescription("ID do evento no Raid Helper.")
    .setRequired(true));
async function execute(interaction) {
    const channel = interaction.options.get("canal")?.channel; // Obtém o canal da interação
    const eventId = interaction.options.get("evento_id")?.value; // Obtém o ID do evento
    // Verifica se o canal existe e é de texto ou de voz
    if (!channel ||
        !(channel instanceof discord_js_1.VoiceChannel || channel instanceof discord_js_1.TextChannel)) {
        await interaction.reply({
            content: "Por favor, selecione um canal de voz ou texto válido.",
            ephemeral: true,
        });
        return;
    }
    let targetChannel = channel;
    if (channel instanceof discord_js_1.TextChannel && channel.parent) {
        const voiceChannel = channel.parent.children.cache.find((ch) => ch.type === discord_js_1.ChannelType.GuildVoice);
        if (voiceChannel) {
            targetChannel = voiceChannel;
        }
        else {
            await interaction.reply({
                content: "Este canal de texto não está associado a nenhum canal de voz.",
                ephemeral: true,
            });
            return;
        }
    }
    if (!(targetChannel instanceof discord_js_1.VoiceChannel)) {
        await interaction.reply({
            content: "O canal selecionado não é um canal de voz válido.",
            ephemeral: true,
        });
        return;
    }
    const members = targetChannel.members; // Obtém os membros do canal de voz
    const voiceUserIds = members.map((member) => member.id);
    // Chama a API do Raid Helper para buscar dados do evento
    const eventData = await (0, raidHelperAPI_1.getRaidHelperEventData)(eventId);
    if (!eventData || !eventData.signUps) {
        await interaction.reply({
            content: "Evento não encontrado ou sem participantes.",
            ephemeral: true,
        });
        return;
    }
    const eventUserIds = eventData.signUps
        .filter((signUp) => signUp.status === "primary")
        .map((signUp) => signUp.userId);
    const usersInVoiceAndEvent = voiceUserIds.filter((id) => eventUserIds.includes(id));
    const usersInVoiceNotInEvent = voiceUserIds.filter((id) => !eventUserIds.includes(id));
    const usersInEventNotInVoice = eventUserIds.filter((id) => !voiceUserIds.includes(id));
    // Formatar as menções com o displayName
    const formatUsers = (userIds) => userIds
        .map((id) => {
        const member = members.get(id);
        if (member) {
            return `${member.displayName} - <@${member.id}>`;
        }
        return `<@${id}>`; // Caso o membro não esteja disponível
    })
        .join("\n") || "Nenhum";
    const eventUrl = `https://raid-helper.dev/event/${eventId}`;
    // Montagem dos campos para o embed
    const fields = [
        {
            name: `Usuários no canal e inscritos (${usersInVoiceAndEvent.length}):`,
            value: formatUsers(usersInVoiceAndEvent),
        },
        {
            name: `Usuários no canal mas NÃO inscritos (${usersInVoiceNotInEvent.length}):`,
            value: formatUsers(usersInVoiceNotInEvent),
        },
        {
            name: `Usuários inscritos mas NÃO no canal (${usersInEventNotInVoice.length}):`,
            value: usersInEventNotInVoice.length.toString(),
        },
    ];
    // Criação do embed com a URL do evento e marcação do canal
    const embed = (0, embedBuilder_1.createEmbed)("Comparação de Usuários", `Canal: <#${targetChannel.id}>\nEvento: [Clique aqui](${eventUrl})`, fields);
    await interaction.reply({ embeds: [embed] });
}
