"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUsers = formatUsers;
const formatters_1 = require("@discordjs/formatters");
async function formatUsers(userIds, members, eventData, interaction) {
    const usersNotInVoiceChannel = userIds.filter((id) => !members.has(id));
    const discordMembersResponse = await interaction.guild?.members
        .fetch({
        user: usersNotInVoiceChannel,
    })
        .catch(() => null);
    return (userIds
        .map((id) => {
        const member = members.get(id);
        if (member) {
            return `${member.displayName} - ${(0, formatters_1.userMention)(member.id)}`;
        }
        const discordMember = discordMembersResponse?.get(id);
        if (discordMember) {
            return `${discordMember.displayName} - ${(0, formatters_1.userMention)(discordMember.id)}`;
        }
        const signUpUser = eventData.signUps.find((signUp) => signUp.id === Number(id));
        return `${signUpUser?.name || "Usuário desconhecido"} - <@${id}>`;
    })
        .join("\n") || "Nenhum");
}
