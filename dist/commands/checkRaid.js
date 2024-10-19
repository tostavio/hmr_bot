"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
const discord_js_1 = require("discord.js");
const embedBuilder_1 = require("../utils/embedBuilder");
const validateVoiceChannel_1 = require("../utils/validateVoiceChannel");
const compareUsersInChannelAndEvent_1 = require("../utils/compareUsersInChannelAndEvent");
const formatUsers_1 = require("../utils/formatUsers");
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
    console.log("[LOG] Comando iniciado.");
    const eventId = interaction.options.get("evento_id")?.value;
    console.log(`[LOG] ID do evento: ${eventId}`);
    // Valida e obtém o canal de voz
    const targetChannel = await (0, validateVoiceChannel_1.validateVoiceChannel)(interaction);
    if (!targetChannel) {
        await interaction.reply({
            content: "O canal selecionado não é um canal de voz válido.",
            ephemeral: true,
        });
        return;
    }
    // Check if the interaction channel is a text-based channel before sending a message
    const interactionChannel = interaction.channel;
    if (interactionChannel?.type === discord_js_1.ChannelType.GuildText ||
        interactionChannel?.type === discord_js_1.ChannelType.GuildAnnouncement) {
        const initialMessage = await interactionChannel.send({
            content: "Processando a comparação de usuários, aguarde...",
        });
        // Compara usuários no canal de voz com os inscritos no evento
        const comparisonData = await (0, compareUsersInChannelAndEvent_1.compareUsersInChannelAndEvent)(targetChannel, eventId);
        if (!comparisonData) {
            console.error("[ERROR] Evento não encontrado ou sem participantes.");
            await initialMessage?.edit({
                content: "Evento não encontrado ou sem participantes.",
            });
            return;
        }
        const { usersInVoiceAndEvent, usersInVoiceNotInEvent, usersInEventNotInVoice, members, eventData, } = comparisonData;
        console.log(`[LOG] Usuários no canal e inscritos: ${usersInVoiceAndEvent.length}`);
        console.log(`[LOG] Usuários no canal mas NÃO inscritos: ${usersInVoiceNotInEvent.length}`);
        console.log(`[LOG] Usuários inscritos mas NÃO no canal: ${usersInEventNotInVoice.length}`);
        // Cria embed com os resultados da comparação
        const fields = [
            {
                name: `Usuários no canal e inscritos (${usersInVoiceAndEvent.length}):`,
                value: await (0, formatUsers_1.formatUsers)(usersInVoiceAndEvent, members, eventData, interaction),
            },
            {
                name: `Usuários no canal mas NÃO inscritos (${usersInVoiceNotInEvent.length}):`,
                value: await (0, formatUsers_1.formatUsers)(usersInVoiceNotInEvent, members, eventData, interaction),
            },
            {
                name: `Usuários inscritos mas NÃO no canal (${usersInEventNotInVoice.length}):`,
                value: await (0, formatUsers_1.formatUsers)(usersInEventNotInVoice, members, eventData, interaction),
            },
        ];
        const eventUrl = `https://raid-helper.dev/event/${eventId}`;
        const embed = (0, embedBuilder_1.createEmbed)("Comparação de Usuários", `Canal: <#${targetChannel.id}>\nEvento: [Clique aqui](${eventUrl})`, fields);
        // Criação do botão
        const removeButton = new discord_js_1.ButtonBuilder()
            .setCustomId("remove_dkp_role")
            .setLabel("Remover role DKP")
            .setStyle(discord_js_1.ButtonStyle.Danger);
        const row = new discord_js_1.ActionRowBuilder().addComponents(removeButton);
        // Atualiza a mensagem no canal com o embed e botão
        const response = await initialMessage?.edit({
            embeds: [embed],
            components: [row],
        });
        console.log("[LOG] Embed com botão enviado.");
        // Aguarda a interação do botão
        try {
            const confirmation = await response?.awaitMessageComponent({
                filter: (i) => i.customId === "remove_dkp_role" && i.user.id === interaction.user.id,
            });
            // **Atualiza a interação imediatamente para evitar falha**
            await confirmation?.update({
                content: "Removendo roles, aguarde...",
                components: [], // Desabilita os botões para evitar múltiplos cliques
            });
            // Função para remover os usuários da role de DKP usando o ID do evento
            await removeUsersFromRole(usersInEventNotInVoice, eventId, interaction, initialMessage);
        }
        catch (error) {
            await initialMessage?.edit({
                content: "Tempo esgotado. Nenhuma ação foi realizada.",
                components: [],
            });
            console.log("[LOG] Tempo esgotado para a interação do botão.");
        }
    }
    else {
        console.error("[ERROR] Canal de texto não detectado.");
        await interaction.reply({
            content: "O canal atual não é um canal de texto válido para enviar mensagens.",
            ephemeral: true,
        });
    }
}
async function removeUsersFromRole(userIds, eventId, interaction, message) {
    console.log(`[LOG] Removendo role DKP dos usuários não presentes no evento: ${userIds.length} usuários.`);
    const role = interaction.guild?.roles.cache.find((r) => r.name === eventId);
    if (!role) {
        console.error("[ERROR] Role não encontrada.");
        return;
    }
    const failedRemovals = [];
    const totalUsers = userIds.length;
    let processedUsers = 0;
    // Armazena o conteúdo original para não sobrescrever
    const originalContent = (await message.fetch()).content || "";
    // Função para remover a role de um único membro
    async function removeRole(member) {
        if (!member || !role) {
            failedRemovals.push(`${member.displayName} - <@${member.id}>`);
            return;
        }
        try {
            await member.roles.remove(role);
            console.log(`[LOG] Removendo role de: ${member.displayName}`);
        }
        catch (error) {
            console.error(`[ERROR] Falha ao remover role de: ${member.displayName}`);
            failedRemovals.push(`${member.displayName} - <@${member.id}>`);
        }
        // Atualiza o progresso e adiciona no final da mensagem
        processedUsers++;
        const progress = Math.min(Math.floor((processedUsers / totalUsers) * 100), 100); // Garante que não passe de 100%
        // Atualiza apenas a parte do progresso na mensagem
        const progressMessage = `Removendo roles... Progresso: ${progress}%`;
        await message.edit({
            content: `${originalContent}\n\n${progressMessage}`,
        });
    }
    // Executa as remoções de forma paralela e controla o rate limit com batch
    const batchSize = 50; // Define o tamanho do lote para evitar rate limits
    for (let i = 0; i < userIds.length; i += batchSize) {
        const batch = userIds.slice(i, i + batchSize);
        const membersBatch = await interaction.guild?.members
            .fetch({ user: batch })
            .catch(() => null);
        if (membersBatch) {
            await Promise.all(membersBatch.map(removeRole));
        }
        // Delay entre os lotes para evitar rate limits
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Atraso de 2 segundos entre os lotes
    }
    // Resposta final com o resultado das remoções e força o progresso para 100%
    if (failedRemovals.length > 0) {
        await message.edit({
            content: `${originalContent}\n\nRemoção de roles concluída: 100%\nFalha ao remover a role dos seguintes usuários: ${failedRemovals.join(", ")}`,
        });
    }
    else {
        await message.edit({
            content: `${originalContent}\n\nRemoção de roles concluída: 100%\nRole removida com sucesso de todos os usuários.`,
        });
    }
    console.log("[LOG] Remoção de role concluída.");
}
exports.default = { data: exports.data, execute };
