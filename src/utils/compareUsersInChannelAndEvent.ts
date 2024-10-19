import { VoiceChannel } from "discord.js";
import { getRaidHelperEventData } from "../service/raidHelperAPI";

export async function compareUsersInChannelAndEvent(
  voiceChannel: VoiceChannel,
  eventId: string
) {
  const members = voiceChannel.members;
  const voiceUserIds = members.map((member) => member.id);

  const eventData = await getRaidHelperEventData(eventId);
  if ("error" in eventData) {
    console.error("[ERROR] Erro ao buscar dados do evento:", eventData);
    return null;
  }
  if (!eventData || !eventData.signUps) return null;

  const eventUserIds = eventData.signUps
    .filter((signUp) => signUp.status === "primary")
    .map((signUp) => signUp.userId);

  return {
    usersInVoiceAndEvent: voiceUserIds.filter((id) =>
      eventUserIds.includes(id)
    ),
    usersInVoiceNotInEvent: voiceUserIds.filter(
      (id) => !eventUserIds.includes(id)
    ),
    usersInEventNotInVoice: eventUserIds.filter(
      (id) => !voiceUserIds.includes(id)
    ),
    members,
    eventData,
  };
}
