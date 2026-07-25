import { Events, ChatInputCommandInteraction } from 'discord.js';
import { Logger } from '../core/Logger.js';
import type { BotClient } from '../core/Client.js';

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.isChatInputCommand()) return;
    const client = interaction.client as BotClient;
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      await interaction.reply({ content: '❌ Command not found.', ephemeral: true });
      return;
    }
    Logger.info(`/${interaction.commandName} — ${interaction.user.tag}`);
    try {
      await command.execute(interaction);
    } catch (error) {
      Logger.error(`/${interaction.commandName}:`, error);
      const r = { content: '❌ Error executing command.', ephemeral: true };
      if (interaction.replied || interaction.deferred) await interaction.followUp(r);
      else await interaction.reply(r);
    }
  },
};
