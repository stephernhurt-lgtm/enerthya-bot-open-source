import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Logger } from '../core/Logger.js';
import type { BotClient } from '../core/Client.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function loadCommands(client: BotClient): Promise<void> {
  const commandsPath = join(__dirname);
  const folders = readdirSync(commandsPath).filter(
    (f) => !f.includes('.') && f !== 'index.ts' && f !== 'index.js',
  );

  for (const folder of folders) {
    const folderPath = join(commandsPath, folder);
    const commandFiles = readdirSync(folderPath).filter(
      (f) => f.endsWith('.ts') || f.endsWith('.js'),
    );

    for (const file of commandFiles) {
      const command = await import(join(folderPath, file));
      const { data, execute, prefixExecute } = command;

      if (!data || !execute) {
        Logger.warn(`Command at ${folder}/${file} is missing data or execute.`);
        continue;
      }

      client.commands.set(data.name, { data, execute, category: folder, prefixExecute });
      Logger.debug(`Loaded command: /${data.name}`);
    }
  }

  Logger.green(`Loaded ${client.commands.size} commands`);
}
