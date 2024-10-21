import { REST, Routes } from "discord.js";
import dotenv from "dotenv";

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

// Função para limpar os comandos antigos da API do Discord
export async function clearOldCommands() {
  const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);

  try {
    console.log("Buscando comandos antigos...");

    // Obtém todos os comandos globais registrados
    const oldCommands = await rest.get(
      Routes.applicationCommands(process.env.CLIENT_ID!)
    );

    if (Array.isArray(oldCommands)) {
      for (const command of oldCommands) {
        console.log(`Excluindo comando: ${command.name}`);
        await rest.delete(
          `${Routes.applicationCommands(process.env.CLIENT_ID!)}/${command.id}`
        );
      }
    }

    console.log("Todos os comandos antigos foram excluídos!");
  } catch (error) {
    console.error("Erro ao excluir comandos antigos:", error);
  }
}
