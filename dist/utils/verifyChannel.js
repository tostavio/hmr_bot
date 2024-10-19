"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTextChannel = isTextChannel;
const discord_js_1 = require("discord.js");
function isTextChannel(channel) {
    if (!channel)
        return false;
    if (channel.type === discord_js_1.ChannelType.GuildText ||
        channel.type === discord_js_1.ChannelType.GuildAnnouncement) {
        return true;
    }
    return false;
}
