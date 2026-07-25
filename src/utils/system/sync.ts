import { REST, Routes } from 'discord.js';
import { config } from '../../config/index.js';
import { Logger } from '../../core/Logger.js';
import type { BotClient } from '../../core/Client.js';

/**
 * Deploy slash commands to Discord.
 * If `guildId` is set in config, deploys as guild commands (instant).
 * Otherwise deploys globally (up to 1h cache).
 */
export async function deployCommands(client: BotClient): Promise<void> {
  const commands = client.commands.map((cmd) => cmd.data);
  if (commands.length === 0) {
    Logger.warn('No commands to deploy.');
    return;
  }

  const rest = new REST({ version: '10' }).setToken(config.token);

  Logger.section('DEPLOYING COMMANDS');
  Logger.info(`Pushing ${commands.length} commands...`);

  if (config.guildId) {
    await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
      body: commands,
    });
    Logger.green(`Deployed ${commands.length} guild commands to ${config.guildId}`);
  } else {
    await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
    Logger.green(`Deployed ${commands.length} global commands`);
  }
}

/**
 * List all registered commands from Discord without deploying.
 */
export async function listRegisteredCommands(): Promise<void> {
  const rest = new REST({ version: '10' }).setToken(config.token);

  Logger.section('REGISTERED COMMANDS');

  if (config.guildId) {
    const cmds = (await rest.get(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
    )) as any[];
    Logger.info(`Guild commands (${cmds.length}):`);
    for (const c of cmds) Logger.info(`  /${c.name} — ${c.description}`);
  }

  const global = (await rest.get(Routes.applicationCommands(config.clientId))) as any[];
  Logger.info(`Global commands (${global.length}):`);
  for (const c of global) Logger.info(`  /${c.name} — ${c.description}`);
}

/**
 * Clear all guild commands (for cleanup during development).
 */
export async function clearGuildCommands(): Promise<void> {
  if (!config.guildId) {
    Logger.warn('No GUILD_ID set.');
    return;
  }
  const rest = new REST({ version: '10' }).setToken(config.token);
  await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: [] });
  Logger.green('Guild commands cleared.');
}
