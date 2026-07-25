import { REST, Routes } from 'discord.js';
import { config } from '@config/index';
import { Logger } from '@core/Logger';
import type { BotClient } from '@core/Client';

export async function deployCommands(client: BotClient): Promise<void> {
  const commands = client.commands.map(cmd => cmd.data);

  if (commands.length === 0) {
    Logger.warn('No commands to deploy.');
    return;
  }

  const rest = new REST({ version: '10' }).setToken(config.token);

  try {
    Logger.section('DEPLOYING COMMANDS');
    Logger.info(`Pushing ${commands.length} commands...`);

    let data: any;

    if (config.guildId) {
      // Guild commands — update instantly
      data = await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands },
      );
      Logger.green(`Deployed ${(data as any[]).length} guild commands to ${config.guildId}`);
    } else {
      // Global commands — can take up to 1 hour to propagate
      data = await rest.put(
        Routes.applicationCommands(config.clientId),
        { body: commands },
      );
      Logger.green(`Deployed ${(data as any[]).length} global commands`);
    }
  } catch (error) {
    Logger.error('Failed to deploy commands:', error);
  }
}
