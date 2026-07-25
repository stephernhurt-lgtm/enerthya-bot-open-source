import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Logger } from './Logger.js';
import type { BotClient } from './Client.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const eventsPath = join(__dirname, '..', 'events');

export async function loadEvents(client: BotClient): Promise<void> {
  const eventFiles = readdirSync(eventsPath).filter((f) => f.endsWith('.js'));

  for (const file of eventFiles) {
    const event = await import(join(eventsPath, file));
    const { name, once, execute } = event.default ?? event;

    if (!name || !execute) {
      Logger.warn(`Event at ${file} is missing name or execute.`);
      continue;
    }

    if (once) {
      client.once(name, (...args: unknown[]) => execute(client, ...args));
    } else {
      client.on(name, (...args: unknown[]) => execute(...args));
    }

    Logger.debug(`Loaded event: ${name}`);
  }

  Logger.green(`Loaded ${eventFiles.length} events`);
}
