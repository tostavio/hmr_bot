import { ChannelType, TextBasedChannel } from "discord.js";

export function isTextChannel(channel: TextBasedChannel | null) {
  if (!channel) return false;
  if (
    channel.type === ChannelType.GuildText ||
    channel.type === ChannelType.GuildAnnouncement
  ) {
    return true;
  }
  return false;
}
