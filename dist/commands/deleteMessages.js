"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const data = new discord_js_1.SlashCommandBuilder()
    .setName("message")
    .setDescription("Gerencia mensagens no canal de interação")
    .addSubcommand((subcommand) => subcommand
    .setName("delete")
    .setDescription("Exclui as últimas 100 mensagens do canal"));
async function execute(interaction) {
    console.log("[LOG] Comando iniciado para excluir as mensagens.");
    // Verificar se o usuário tem uma das roles
    const member = interaction.member;
    const hasPermission = member.roles.cache.has("1013535396002541639") ||
        member.roles.cache.has("1262905761126813807");
    if (!hasPermission) {
        await interaction.reply({
            content: "Você não tem permissão para executar este comando.",
            ephemeral: true,
        });
        return;
    }
    // Verificar se o canal é de texto
    const interactionChannel = interaction.channel;
    if (!interactionChannel || !(interactionChannel instanceof discord_js_1.TextChannel)) {
        await interaction.reply({
            content: "Este comando só pode ser usado em canais de texto.",
            ephemeral: true,
        });
        return;
    }
    // Criar o botão de confirmação
    const confirmButton = new discord_js_1.ButtonBuilder()
        .setCustomId("confirm_delete")
        .setLabel("Tem certeza que deseja exclcuir as últimas 100 mensagens?")
        .setStyle(discord_js_1.ButtonStyle.Danger);
    const cancelButton = new discord_js_1.ButtonBuilder()
        .setCustomId("cancel_delete")
        .setLabel("Cancelar")
        .setStyle(discord_js_1.ButtonStyle.Secondary);
    const row = new discord_js_1.ActionRowBuilder().addComponents(confirmButton, cancelButton);
    await interaction.reply({
        content: "Você tem certeza que deseja excluir as últimas 100 mensagens?",
        components: [row],
        ephemeral: true,
    });
    try {
        // Criar o collector para aguardar a interação do botão
        const collector = interactionChannel.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.Button,
            time: 120000, // 2 minutos para o usuário responder
        });
        collector.on("collect", async (collectInteraction) => {
            if (collectInteraction.customId === "confirm_delete") {
                // Confirma a exclusão
                const fetchedMessages = await interactionChannel.messages.fetch({
                    limit: 100,
                });
                await interactionChannel.bulkDelete(fetchedMessages, true);
                await collectInteraction.update({
                    content: "As últimas 100 mensagens foram excluídas com sucesso.",
                    components: [],
                });
                return;
            }
            if (collectInteraction.customId === "cancel_delete") {
                // Cancelar a exclusão
                await collectInteraction.update({
                    content: "A exclusão foi cancelada.",
                    components: [],
                });
                return;
            }
            collector.stop();
        });
        collector.on("end", (_, reason) => {
            if (reason === "time") {
                interaction.editReply({
                    content: "Tempo esgotado. A exclusão foi cancelada.",
                    components: [],
                });
            }
        });
    }
    catch (error) {
        console.error("Erro ao excluir as mensagens:", error);
        await interaction.editReply({
            content: `Ocorreu um erro ao tentar excluir as mensagens: ${error.message}`,
            components: [],
        });
    }
}
exports.default = { data, execute };
