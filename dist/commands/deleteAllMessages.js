"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const data = new discord_js_1.SlashCommandBuilder()
    .setName("deleteallmessages")
    .setDescription("Exclui todas as mensagens do canal de interação");
async function execute(interaction) {
    console.log("[LOG] Comando iniciado para excluir todas as mensagens.");
    // Verificar se o canal é de texto
    const interactionChannel = interaction.channel;
    if (interactionChannel instanceof discord_js_1.TextChannel) {
        try {
            // Responder para confirmar a execução
            await interaction.reply({
                content: "Excluindo todas as mensagens...",
                ephemeral: true,
            });
            // Pegar todas as mensagens do canal
            const fetchedMessages = await interactionChannel.messages.fetch({
                limit: 100,
            });
            // Apagar todas as mensagens
            await interactionChannel.bulkDelete(fetchedMessages, true);
            // Mensagem de confirmação
            await interaction.editReply({
                content: "Todas as mensagens foram excluídas com sucesso.",
            });
        }
        catch (error) {
            // Responder em caso de erro
            await interaction.editReply({
                content: `Ocorreu um erro ao tentar excluir as mensagens: ${error.message}`,
            });
        }
    }
    else {
        // Caso o canal não seja um canal de texto válido
        await interaction.reply({
            content: "Por favor, utilize este comando em um canal de texto.",
            ephemeral: true,
        });
    }
}
exports.default = { data, execute };
