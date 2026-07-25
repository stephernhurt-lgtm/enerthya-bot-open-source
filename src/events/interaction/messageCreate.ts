import { Events } from 'discord.js';
import { Guild } from '../../db/schemas/guild.js';
import { Logger } from '../../core/Logger.js';
import type { BotClient } from '../../core/Client.js';

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
    if (!command?.prefixExecute) return;
    try {
      await command.prefixExecute(message, args);
      Logger.info(`[PREFIX] ${prefix}${commandName} by ${message.author.tag}`);
    } catch (error) {
      Logger.error(`Prefix error ${prefix}${commandName}:`, error);
      await message.reply('❌ Error.').catch(() => {});
    }
  },
};
