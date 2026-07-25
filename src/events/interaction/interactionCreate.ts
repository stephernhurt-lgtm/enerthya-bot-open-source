import { Events, ChatInputCommandInteraction, ModalSubmitInteraction } from 'discord.js';
import { Logger } from '../../core/Logger.js';
import type { BotClient } from '../../core/Client.js';

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: ChatInputCommandInteraction | ModalSubmitInteraction) {
    const client = interaction.client as BotClient;

    // ── Modal submissions ──
    if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith('config_edit_')) {
        const guildId = interaction.customId.replace('config_edit_', '');
        const prefix = interaction.fields.getTextInputValue('prefix');
        const language = interaction.fields.getTextInputValue('language') || 'en';
        const welcomeMessage = interaction.fields.getTextInputValue('welcomeMessage') || null;
        const auditChannelId = interaction.fields.getTextInputValue('auditChannelId') || null;

        const { Guild } = await import('../../db/schemas/guild.js');
        await Guild.findOneAndUpdate(
          { guildId },
          { prefix, language, welcomeMessage, auditChannelId },
          { upsert: true },
        );
        Logger.info(`Guild ${guildId}: settings updated via modal`);
        await interaction.reply({ content: '✅ Settings updated!', ephemeral: true });
      }
      return;
    }

    // ── Slash commands ──
    if (!interaction.isChatInputCommand()) return;
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
