import { userMention } from "@discordjs/formatters";
import { EventResponse } from "../service/raidHelper.types";
import { CommandInteraction } from "discord.js";

export async function formatUsers(
  userIds: string[],
  members: Map<string, any>,
  eventData: EventResponse,
  interaction: CommandInteraction
) {
  const usersNotInVoiceChannel = userIds.filter((id) => !members.has(id));

  const discordMembersResponse = await interaction.guild?.members
    .fetch({
      user: usersNotInVoiceChannel,
    })
    .catch(() => null);

  return (
    userIds
      .map((id) => {
        const member = members.get(id);
        if (member) {
          return `${member.displayName} - ${userMention(member.id)}`;
        }
        const discordMember = discordMembersResponse?.get(id);
        if (discordMember) {
          return `${discordMember.displayName} - ${userMention(
            discordMember.id
          )}`;
        }
        const signUpUser = eventData.signUps.find(
          (signUp) => signUp.id === Number(id)
        );
        return `${signUpUser?.name || "Usuário desconhecido"} - <@${id}>`;
      })
      .join("\n") || "Nenhum"
  );
}
