import { CommandInteraction, TextBasedChannel, TextChannel } from "discord.js";
import { Dkp } from "../service/raidHelper.types";

export async function sendUsersDkpMessage(
  usersDkp: Dkp[],
  interaction: CommandInteraction
) {
  await interaction.reply({
    content: "Listando DKP...",
    ephemeral: true,
  });

  const channel = interaction.channel;
  if (!(channel instanceof TextChannel)) {
    await interaction.editReply({ content: "Utilize um canal de texto" });
    return;
  }

  let messagePart = "";
  const maxCharacters = 2000;

  const sortedUsersDkp = usersDkp.sort(
    (a, b) => parseFloat(b.dkp) - parseFloat(a.dkp)
  );

  for (let index = 0; index < sortedUsersDkp.length; index++) {
    const user = sortedUsersDkp[index];

    if (parseFloat(user.dkp) === 0) {
      const usersWithZeroDkp = usersDkp.length - index;
      messagePart += `+ ${usersWithZeroDkp} usuários com **0** DKP\n\n`;
      await channel.send(messagePart);
      return; // Agora interrompe a execução da função inteira
    }

    const userMention = `<@${user.id}> | ${user.name}`;
    const messageToSend = `${index + 1}. ${userMention}\n╰┈➤ **${parseFloat(
      user.dkp
    )}**\n\n`;

    if (messagePart.length + messageToSend.length > maxCharacters) {
      await channel.send(messagePart);
      messagePart = "";
    }

    messagePart += messageToSend;
  }

  if (messagePart.length > 0) {
    await channel.send(messagePart);
  }
}
