// import {
//   SlashCommandBuilder,
//   CommandInteraction,
//   VoiceChannel,
//   TextChannel,
//   ChannelType,
// } from "discord.js";
// import { EventResponse } from "../service/raidHelper.types";
// import { getRaidHelperEventData } from "../service/raidHelperAPI";
// import { createEmbed } from "../utils/embedBuilder";
// import dotenv from "dotenv";
// import { userVoiceTimes } from "../bot";

// // Remove o mapa `userVoiceTimes` daqui, pois ele está no bot.ts
// dotenv.config();

// // Definindo o comando de checkattendance com a estrutura correta
// export const data = new SlashCommandBuilder()
//   .setName("checkattendance")
//   .setDescription(
//     "Verifica a presença dos jogadores em um evento do Raid Helper."
//   )
//   .addChannelOption((option) =>
//     option
//       .setName("canal")
//       .setDescription("Selecione um canal de voz ou texto.")
//       .setRequired(true)
//   )
//   .addStringOption((option) =>
//     option
//       .setName("evento_id")
//       .setDescription("ID do evento no Raid Helper.")
//       .setRequired(true)
//   );

// export async function execute(interaction: CommandInteraction) {
//   const channel = interaction.options.get("canal")?.channel;
//   console.log("Canal selecionado:", channel?.id, channel?.name); // Log do canal selecionado

//   if (
//     !channel ||
//     !(channel instanceof VoiceChannel || channel instanceof TextChannel)
//   ) {
//     await interaction.reply({
//       content: "Por favor, selecione um canal de voz ou texto válido.",
//       ephemeral: true,
//     });
//     console.log("Erro: canal inválido ou não selecionado.");
//     return;
//   }

//   let targetChannel = channel;
//   if (channel instanceof TextChannel && channel.parent) {
//     const voiceChannel = channel.parent.children.cache.find(
//       (ch): ch is VoiceChannel => ch.type === ChannelType.GuildVoice
//     );
//     if (voiceChannel) {
//       targetChannel = voiceChannel;
//     } else {
//       await interaction.reply({
//         content:
//           "Este canal de texto não está associado a nenhum canal de voz.",
//         ephemeral: true,
//       });
//       console.log("Erro: canal de texto sem associação com canal de voz.");
//       return;
//     }
//   }

//   if (!(targetChannel instanceof VoiceChannel)) {
//     await interaction.reply({
//       content: "O canal selecionado não é um canal de voz válido.",
//       ephemeral: true,
//     });
//     console.log("Erro: o canal selecionado não é um canal de voz.");
//     return;
//   }

//   // Definir startTime como 1 hora atrás e duração de 60 minutos para teste
//   const startTime = Date.now() - 3600 * 1000; // 1 hora atrás
//   const eventDuration = 60 * 60 * 1000; // 60 minutos (em milissegundos)
//   const endTime = startTime + eventDuration;

//   console.log("StartTime (1h atrás):", new Date(startTime).toLocaleString());
//   console.log(
//     "EndTime (60 min após start):",
//     new Date(endTime).toLocaleString()
//   );

//   const members = targetChannel.members;
//   console.log(
//     "Membros conectados no canal:",
//     members.map((m) => m.id)
//   ); // Log dos membros conectados

//   const connectedUserIds = members.map((member) => member.id);
//   const signUpIds = connectedUserIds; // Simulação de que todos os conectados estão inscritos

//   console.log("Usuários conectados e inscritos:", signUpIds);

//   const attendedUsers: string[] = [];
//   const missedUsers: string[] = [];

//   // Verifica quem está conectado e se participou de 80% do evento
//   for (const memberId of connectedUserIds) {
//     // Acessa o mapa `userVoiceTimes` que está no `bot.ts`
//     const joinedTime = userVoiceTimes?.get(memberId); // Usa o mapa global
//     console.log(
//       `Usuário: ${memberId}, Tempo de entrada:`,
//       joinedTime ? new Date(joinedTime).toLocaleString() : "Desconhecido"
//     );

//     if (joinedTime && signUpIds.includes(memberId)) {
//       const timeConnected = endTime - joinedTime;
//       const percentage = timeConnected / eventDuration;
//       console.log(
//         `Usuário: ${memberId}, Tempo conectado: ${
//           timeConnected / 1000
//         }s, Percentual de participação: ${(percentage * 100).toFixed(2)}%`
//       );

//       if (percentage >= 0.8) {
//         attendedUsers.push(`<@${memberId}>`); // Marca o usuário como presente
//       } else {
//         missedUsers.push(`<@${memberId}>`); // Marca o usuário como ausente
//       }
//     }
//   }

//   // Cria o embed usando o embedBuilder personalizado
//   const embed = createEmbed(
//     "Relatório de Presença",
//     `Canal: <#${targetChannel.id}>\nEvento: [Raid Helper Evento](https://raid-helper.dev/event/test)`, // Link fictício para teste
//     [
//       {
//         name: `Usuários que participaram de mais de 80% do evento (${attendedUsers.length}):`,
//         value: attendedUsers.join("\n") || "Nenhum",
//       },
//       {
//         name: `Usuários que participaram de menos de 80% do evento (${missedUsers.length}):`,
//         value: missedUsers.join("\n") || "Nenhum",
//       },
//     ]
//   );

//   console.log("Usuários que participaram de mais de 80%:", attendedUsers);
//   console.log("Usuários que participaram de menos de 80%:", missedUsers);

//   await interaction.reply({ embeds: [embed] });
// }

// // 98
// // // Obtendo o ID do evento corretamente usando get()
// // const eventId = interaction.options.get("evento_id")?.value as string;

// // // Busca os dados do evento da API do Raid Helper
// // const eventData: EventResponse | null = await getRaidHelperEventData(eventId);

// // if (!eventData || !eventData.signUps) {
// //   await interaction.reply({
// //     content: "Evento não encontrado ou sem participantes.",
// //     ephemeral: true,
// //   });
// //   return;
// // }

// // const startTime = eventData.startTime * 1000; // Convertendo para milissegundos
// // const endTime = startTime + eventData.advancedSettings.duration * 60 * 1000; // Calculando o horário de término
// // const eventDuration = endTime - startTime;

// // const members = targetChannel.members;
// // const connectedUserIds = members.map((member) => member.id);
// // const signUpIds = eventData.signUps.map((signUp) => signUp.userId);
