import { Events, ChatInputCommandInteraction } from 'discord.js';
import { Logger } from '@core/Logger';
import type { BotClient } from '@core/Client';

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const client = interaction.client as BotClient;
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      Logger.warn(`Unknown command: ${interaction.commandName}`);
      await interaction.reply({
        content: '❌ Command not found.',
        ephemeral: true,
      });
      return;
    }

    Logger.info(
      `/${interaction.commandName} — ${interaction.user.tag} (${interaction.user.id})`
    );

    try {
      await command.execute(interaction);
    } catch (error) {
      Logger.error(`Error executing /${interaction.commandName}:`, error);

      const reply = {
        content: '❌ An error occurred while executing this command.',
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  },
};
