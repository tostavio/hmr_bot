"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendUsersDkpMessage = sendUsersDkpMessage;
const discord_js_1 = require("discord.js");
async function sendUsersDkpMessage(usersDkp, interaction) {
    // Responder à interação imediatamente
    await interaction.reply({
        content: "Listando DKP...",
        ephemeral: true,
    });
    const channel = interaction.channel;
    if (channel instanceof discord_js_1.TextChannel) {
        let messagePart = "";
        const maxCharacters = 2000;
        const longestMentionLength = Math.max(...usersDkp.map((user, index) => `${index + 1}. <@${user.id}> | ${user.name}`.length));
        const sortedUsersDkp = usersDkp.sort((a, b) => parseFloat(b.dkp) - parseFloat(a.dkp));
        sortedUsersDkp.forEach((user, index) => {
            const userMention = `<@${user.id}> | ${user.name}`;
            // Construir a linha de exibição com o nome e o DKP na linha debaixo
            const messageToSend = `${index + 1}. ${userMention}\n╰┈➤ **${user.dkp}**\n\n`;
            // Se adicionar a próxima menção ultrapassar o limite de caracteres, envia a mensagem atual
            if (messagePart.length + messageToSend.length > maxCharacters) {
                channel.send(messagePart); // Enviar a mensagem no canal
                messagePart = ""; // Reseta a mensagem para continuar
            }
            messagePart += messageToSend;
        });
        // Envia a última parte, se não tiver sido enviada
        if (messagePart.length > 0) {
            channel.send(messagePart);
        }
        return;
    }
    await interaction.editReply({ content: "Utilize um canal de texto" });
    return;
}
