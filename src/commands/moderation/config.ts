import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} from 'discord.js';
import { Guild } from '@db/schemas/guild';
import { Logger } from '@core/Logger';
import { getAuditChannel, sendAudit } from '@utils/audit';

const validSettings: string[] = ['prefix', 'language', 'welcome_message', 'audit_channel'];

export const data = new SlashCommandBuilder()
  .setName('config')
  .setDescription('View or update guild settings.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addSubcommand((sub) => sub.setName('view').setDescription('Show current guild settings.'))
  .addSubcommand((sub) =>
    sub
      .setName('set')
      .setDescription('Update a guild setting.')
      .addStringOption((opt) =>
        opt
          .setName('key')
          .setDescription('Setting to update')
          .setRequired(true)
          .addChoices(
            { name: 'prefix', value: 'prefix' },
            { name: 'language', value: 'language' },
            { name: 'welcome_message', value: 'welcome_message' },
            { name: 'audit_channel', value: 'audit_channel' },
          ),
      )
      .addStringOption((opt) =>
        opt
          .setName('value')
          .setDescription('New value (channel ID for audit_channel)')
          .setRequired(true)
          .setMaxLength(500),
      ),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({
      content: '❌ This command can only be used in a server.',
      ephemeral: true,
    });
    return;
  }

  const sub = interaction.options.getSubcommand();
  const guildId = interaction.guild.id;

  if (sub === 'view') {
    let settings = await Guild.findOne({ guildId });

    if (!settings) {
      settings = await Guild.create({ guildId });
    }

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle('⚙️ Guild Settings')
      .addFields(
        { name: 'Prefix', value: `\`${settings.prefix}\``, inline: true },
        { name: 'Language', value: settings.language, inline: true },
        { name: 'Welcome Message', value: settings.welcomeMessage ?? 'Not set' },
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
    const fieldMap: Record<string, string> = {
      prefix: 'prefix',
      language: 'language',
      welcome_message: 'welcomeMessage',
      audit_channel: 'auditChannelId',
    };

    const dbField = fieldMap[key];
    if (!dbField) {
      await interaction.reply({ content: '❌ Invalid setting key.', ephemeral: true });
      return;
    }

    await Guild.findOneAndUpdate({ guildId }, { [dbField]: value }, { upsert: true });

    Logger.info(`Guild ${guildId}: ${key} = "${value}"`);

    await interaction.reply({
      content: `✅ **${key}** updated successfully.`,
      ephemeral: true,
    });

    // Audit log
    const auditCh = await getAuditChannel(guildId, interaction.client.channels);
    if (auditCh) {
      await sendAudit(auditCh, 'config_update', [
        { name: 'Setting', value: key, inline: true },
        { name: 'New Value', value, inline: true },
        { name: 'Updated By', value: interaction.user.tag },
      ]);
    }
  }
}
