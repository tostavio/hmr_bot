"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const raidHelperAPI_1 = require("../service/raidHelperAPI");
const sendUsersDkpMessage_1 = require("../utils/sendUsersDkpMessage");
const verifyChannel_1 = require("../utils/verifyChannel");
const data = new discord_js_1.SlashCommandBuilder()
    .setName("checkalldkp")
    .setDescription("Exibe o dkp de todos as pessoas de um cargo")
    .addRoleOption((option) => option
    .setName("role")
    .setDescription("Selecione uma role.")
    .setRequired(true));
async function execute(interaction) {
    console.log("[LOG] Comando iniciado.");
    const roleId = interaction.options.get("role")?.value;
    const guildId = interaction.guildId;
    if (!roleId) {
        await interaction.reply({
            content: "Por favor, selecione uma role válida.",
            ephemeral: true,
        });
        return;
    }
    if (!guildId) {
        await interaction.reply({
            content: "Por favor, use o comando em um servidor.",
            ephemeral: true,
        });
        return;
    }
    // Check if the interaction channel is a text-based channel before sending a message
    const interactionChannel = interaction.channel;
    if (!(0, verifyChannel_1.isTextChannel)(interactionChannel)) {
        await interaction.reply({
            content: "Por favor, use canal de texto válido.",
            ephemeral: true,
        });
        return;
    }
    if (!(0, verifyChannel_1.isTextChannel)(interactionChannel)) {
        await interaction.reply({
            content: "Por favor, use canal de texto válido.",
            ephemeral: true,
        });
        return;
    }
    const usersDkp = await (0, raidHelperAPI_1.getRaidHelperDkpData)(roleId, guildId);
    if ("error" in usersDkp) {
        await interaction.reply({
            content: "Não foi possível obter os dados de DKP.",
            ephemeral: true,
        });
        return;
    }
    if (!usersDkp) {
        await interaction.reply({
            content: "Não foi possível obter os dados de DKP.",
            ephemeral: true,
        });
        return;
    }
    (0, sendUsersDkpMessage_1.sendUsersDkpMessage)(usersDkp, interaction);
}
exports.default = { data, execute };
