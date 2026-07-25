import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { defineCommand } from '../../utils/define.js';
import { Logger } from '../../core/Logger.js';
import { Guild } from '../../db/schemas/guild.js';
import { getAuditChannel, sendAudit } from '../../utils/audit.js';

export default defineCommand({
  name: 'config',
  description: 'View or update guild settings.',
  defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
  subcommands: [
    {
      name: 'view',
      description: 'Show current guild settings.',
    },
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
        {
          type: 'string',
          name: 'value',
          description: 'New value (channel ID for audit_channel)',
          required: true,
          max: 500,
        },
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
      let settings = await Guild.findOne({ guildId });
      if (!settings) settings = await Guild.create({ guildId });

      const embed = new EmbedBuilder()
        .setColor(0x2b2d31)
        .setTitle('⚙️ Guild Settings')
        .addFields(
          { name: 'Prefix', value: `\`${settings.prefix}\``, inline: true },
          { name: 'Language', value: settings.language, inline: true },
          { name: 'Welcome', value: settings.welcomeMessage ?? 'Not set' },
          {
            name: 'Audit Channel',
            value: settings.auditChannelId ? `<#${settings.auditChannelId}>` : 'Not set',
          },
        )
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });
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
