import {
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from 'discord.js';
import { defineCommand, Perm } from '../../utils/builders/define.js';
import { Logger } from '../../core/Logger.js';
import { Guild } from '../../db/schemas/guild.js';
import { getAuditChannel, sendAudit } from '../../services/moderation/auditService.js';

const defaults = {
  prefix: '/',
  language: 'en',
  welcomeMessage: null as string | null,
  auditChannelId: null as string | null,
};

export default defineCommand({
  name: 'config',
  description: 'View or update guild settings.',
  defaultMemberPermissions: Perm.ManageGuild,
  subcommands: [
    { name: 'view', description: 'Show current guild settings.' },
    { name: 'edit', description: 'Edit guild settings via modal.' },
    {
      name: 'set',
      description: 'Update a guild setting.',
      options: [
        {
          type: 'string',
          name: 'key',
          description: 'Setting to update',
          required: true,
          choices: [
            { name: 'prefix', value: 'prefix' },
            { name: 'language', value: 'language' },
            { name: 'welcome_message', value: 'welcome_message' },
            { name: 'audit_channel', value: 'audit_channel' },
          ],
        },
        { type: 'string', name: 'value', description: 'New value', required: true, max: 500 },
      ],
    },
  ],
  execute: async (interaction) => {
    if (!interaction.guild) {
      await interaction.reply({ content: '❌ Server only.', ephemeral: true });
      return;
    }

    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;
    const fieldMap: Record<string, string> = {
      prefix: 'prefix',
      language: 'language',
      welcome_message: 'welcomeMessage',
      audit_channel: 'auditChannelId',
    };

    if (sub === 'view') {
      const settings = await Guild.findOne({ guildId });
      const s = settings ?? defaults;
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle('⚙️ Guild Settings')
            .addFields(
              { name: 'Prefix', value: `\`${s.prefix}\``, inline: true },
              { name: 'Language', value: s.language, inline: true },
              { name: 'Welcome', value: s.welcomeMessage ?? 'Not set' },
              {
                name: 'Audit Channel',
                value: s.auditChannelId ? `<#${s.auditChannelId}>` : 'Not set',
              },
            )
            .setTimestamp(),
        ],
      });
      return;
    }

    if (sub === 'edit') {
      const settings = await Guild.findOne({ guildId });
      const s = settings ?? defaults;

      const modal = new ModalBuilder()
        .setCustomId(`config_edit_${guildId}`)
        .setTitle('Edit Guild Settings')
        .addComponents(
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId('prefix')
              .setLabel('Prefix')
              .setStyle(TextInputStyle.Short)
              .setValue(s.prefix)
              .setRequired(true)
              .setMaxLength(3),
          ),
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId('language')
              .setLabel('Language (en/pt)')
              .setStyle(TextInputStyle.Short)
              .setValue(s.language)
              .setMaxLength(5),
          ),
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId('welcomeMessage')
              .setLabel('Welcome Message')
              .setStyle(TextInputStyle.Paragraph)
              .setValue(s.welcomeMessage ?? '')
              .setMaxLength(500),
          ),
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId('auditChannelId')
              .setLabel('Audit Channel ID')
              .setStyle(TextInputStyle.Short)
              .setValue(s.auditChannelId ?? ''),
          ),
        );

      await interaction.showModal(modal);
      return;
    }

    if (sub === 'set') {
      const key = interaction.options.getString('key', true);
      const value = interaction.options.getString('value', true);
      const dbField = fieldMap[key];
      if (!dbField) {
        await interaction.reply({ content: '❌ Invalid key.', ephemeral: true });
        return;
      }

      await Guild.findOneAndUpdate({ guildId }, { [dbField]: value }, { upsert: true });
      Logger.info(`Guild ${guildId}: ${key} = "${value}"`);
      await interaction.reply({ content: `✅ **${key}** updated.`, ephemeral: true });

      const auditCh = await getAuditChannel(guildId, interaction.client.channels);
      if (auditCh)
        await sendAudit(auditCh, 'config_update', [
          { name: 'Setting', value: key, inline: true },
          { name: 'New Value', value, inline: true },
          { name: 'By', value: interaction.user.tag },
        ]);
    }
  },
});
