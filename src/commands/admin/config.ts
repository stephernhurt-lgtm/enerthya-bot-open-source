import {
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from 'discord.js';
import { defineCommand, Perm } from '../../utils/builders/define.js';
import { Guild } from '../../db/schemas/guild.js';

const defaults = {
  prefix: '/',
  language: 'en',
  welcomeMessage: null as string | null,
  auditChannelId: null as string | null,
};

export default defineCommand({
  name: 'config',
  description: 'Manage guild settings with an interactive menu.',
  defaultMemberPermissions: Perm.ManageGuild,
  execute: async (interaction) => {
    if (!interaction.guild) {
      await interaction.reply({ content: '❌ Server only.', ephemeral: true });
      return;
    }

    const settings = await Guild.findOne({ guildId: interaction.guild.id });
    const s = settings ?? defaults;

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle('⚙️ Guild Settings')
      .setDescription('Select an option below to view or edit your settings.')
      .addFields(
        { name: 'Prefix', value: `\`${s.prefix}\``, inline: true },
        { name: 'Language', value: s.language, inline: true },
        {
          name: 'Welcome Message',
          value: s.welcomeMessage ? '✅ Set' : '❌ Not set',
          inline: true,
        },
        {
          name: 'Audit Channel',
          value: s.auditChannelId ? `<#${s.auditChannelId}>` : '❌ Not set',
          inline: true,
        },
      )
      .setFooter({ text: 'Config menu expires in 60s' })
      .setTimestamp();

    const menu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`config_menu_${interaction.guild.id}`)
        .setPlaceholder('Choose an action…')
        .addOptions([
          {
            label: 'Edit Prefix',
            value: 'prefix',
            description: 'Change command prefix',
            emoji: '🔤',
          },
          {
            label: 'Edit Language',
            value: 'language',
            description: 'Set language (en/pt)',
            emoji: '🌐',
          },
          {
            label: 'Edit Welcome Message',
            value: 'welcome',
            description: 'Customize join message',
            emoji: '👋',
          },
          {
            label: 'Edit Audit Channel',
            value: 'audit',
            description: 'Set audit log channel',
            emoji: '📝',
          },
        ]),
    );

    await interaction.reply({ embeds: [embed], components: [menu], ephemeral: true });
  },
});
