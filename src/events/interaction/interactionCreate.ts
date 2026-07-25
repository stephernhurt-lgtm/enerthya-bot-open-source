import {
  Events,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from 'discord.js';
import { Logger } from '../../core/Logger.js';
import type { BotClient } from '../../core/Client.js';

const modalFields: Record<string, { label: string; style: TextInputStyle; value: string }> = {
  prefix: { label: 'Prefix', style: TextInputStyle.Short, value: '/' },
  language: { label: 'Language (en/pt)', style: TextInputStyle.Short, value: 'en' },
  welcome: { label: 'Welcome Message', style: TextInputStyle.Paragraph, value: '' },
  audit: { label: 'Audit Channel ID', style: TextInputStyle.Short, value: '' },
};

export default {
  name: Events.InteractionCreate,
  once: false,
  async execute(
    interaction: ChatInputCommandInteraction | ModalSubmitInteraction | StringSelectMenuInteraction,
  ) {
    const client = interaction.client as BotClient;

    // ── Select Menu ──
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId.startsWith('config_menu_')) {
        const value = interaction.values[0];
        const field = modalFields[value];
        if (!field) return;

        const current = await (
          await import('../../db/schemas/guild.js')
        ).Guild.findOne({ guildId: interaction.customId.replace('config_menu_', '') });
        const currentValue = current?.[value as keyof typeof current] ?? field.value;

        const modal = new ModalBuilder()
          .setCustomId(`config_save_${value}`)
          .setTitle(`Edit ${field.label}`)
          .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId('value')
                .setLabel(field.label)
                .setStyle(field.style)
                .setValue(String(currentValue))
                .setRequired(true)
                .setMaxLength(field.style === TextInputStyle.Paragraph ? 500 : 50),
            ),
          );

        await interaction.showModal(modal);
      }
      return;
    }

    // ── Modal submissions ──
    if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith('config_save_')) {
        const key = interaction.customId.replace('config_save_', '');
        const dbKey =
          key === 'welcome' ? 'welcomeMessage' : key === 'audit' ? 'auditChannelId' : key;
        const value = interaction.fields.getTextInputValue('value');

        await (
          await import('../../db/schemas/guild.js')
        ).Guild.findOneAndUpdate(
          { guildId: interaction.guild!.id },
          { [dbKey]: value },
          { upsert: true },
        );
        Logger.info(`Guild ${interaction.guild!.id}: ${key} = "${value}"`);
        await interaction.reply({ content: `✅ **${fieldLabel(key)}** updated!`, ephemeral: true });
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

function fieldLabel(key: string): string {
  return (
    { prefix: 'Prefix', language: 'Language', welcome: 'Welcome Message', audit: 'Audit Channel' }[
      key
    ] ?? key
  );
}
