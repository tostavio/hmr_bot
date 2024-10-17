import { ExtendedClient } from "../types/ExtendedClient";
import { syncDatabase } from "../database/config";
import { deployCommands } from "../handlers/commandHandler";

const ready = {
  name: "ready",
  once: true,
  async execute(client: ExtendedClient) {
    console.log(`Bot logado como ${client.user?.tag}`);

    // Sincronizar banco de dados
    await syncDatabase();

    // Registrar os comandos
    await deployCommands(client);
  },
};

export default ready;
