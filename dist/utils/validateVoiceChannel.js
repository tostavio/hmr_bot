"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateVoiceChannel = validateVoiceChannel;
const discord_js_1 = require("discord.js");
// Função para validar se o canal é de voz
async function validateVoiceChannel(interaction) {
    const channel = interaction.options.get("canal")?.channel;
    if (!channel ||
        !(channel instanceof discord_js_1.VoiceChannel || channel instanceof discord_js_1.TextChannel)) {
        await interaction.reply({
            content: "Por favor, selecione um canal de voz ou texto válido.",
            ephemeral: true,
        });
        return null;
    }
    if (channel instanceof discord_js_1.TextChannel && channel.parent) {
        const voiceChannel = channel.parent.children.cache.find((ch) => ch.type === discord_js_1.ChannelType.GuildVoice);
        return voiceChannel || null;
    }
    return channel instanceof discord_js_1.VoiceChannel ? channel : null;
}
