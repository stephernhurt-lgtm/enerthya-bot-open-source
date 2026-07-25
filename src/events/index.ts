import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Logger } from '@core/Logger';
import type { BotClient } from '@core/Client';

export async function loadEvents(client: BotClient): Promise<void> {
  const eventsPath = join(__dirname, '..', 'events');
  const eventFiles = readdirSync(eventsPath).filter(f => f.endsWith('.ts') || f.endsWith('.js'));

  for (const file of eventFiles) {
    const event = await import(join(eventsPath, file));
    const { name, once, execute } = event.default ?? event;

    if (once) {
      client.once(name, (...args: unknown[]) => execute(client, ...args));
    } else {
      client.on(name, (...args: unknown[]) => execute(...args));
    }

    Logger.debug(`Loaded event: ${name}`);
  }

  Logger.green(`Loaded ${eventFiles.length} events`);
}
