import { Client, Collection } from "discord.js";

interface Command {
  data: {
    name: string;
    toJSON: () => any;
  };
  execute: (interaction: any) => Promise<void>;
}

export interface ExtendedClient extends Client {
  commands: Collection<string, Command>;
}
