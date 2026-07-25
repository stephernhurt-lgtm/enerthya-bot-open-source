import { Events } from 'discord.js';
import { Guild } from '@db/schemas/guild';
import { Logger } from '@core/Logger';
import type { BotClient } from '@core/Client';

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(message: any) {
    if (message.author.bot || !message.guild) return;

    const settings = await Guild.findOne({ guildId: message.guild.id });
    const prefix = settings?.prefix ?? '/';

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const client = message.client as BotClient;
    const command = client.commands.get(commandName);

    if (!command || !command.prefixExecute) return;

    try {
      await command.prefixExecute(message, args);
      Logger.info(`[PREFIX] ${prefix}${commandName} by ${message.author.tag}`);
    } catch (error) {
      Logger.error(`Prefix command error: ${prefix}${commandName}:`, error);
      await message.reply('❌ An error occurred.').catch(() => {});
    }
  },
};
