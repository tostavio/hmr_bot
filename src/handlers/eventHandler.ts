import { ExtendedClient } from "../types/ExtendedClient";
import * as fs from "fs";
import * as path from "path";

export function loadEvents(client: ExtendedClient) {
  const eventsPath = path.join(__dirname, "../events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file)).default; // Carrega o `default` exportado pelo arquivo

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}
