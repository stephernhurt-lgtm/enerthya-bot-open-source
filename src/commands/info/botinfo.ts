import { EmbedBuilder } from 'discord.js';
import { defineCommand } from '../../utils/define.js';
import { formatDuration, timestamp } from '../../utils/time.js';

export default defineCommand({
  name: 'botinfo',
  description: 'Display bot information.',
  execute: async (interaction) => {
    const client = interaction.client as any;

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setAuthor({ name: client.user?.username ?? 'Bot', iconURL: client.user?.displayAvatarURL() })
      .setDescription('A modular, open-source Discord bot built with discord.js v14.')
      .addFields(
        { name: '🤖 Developer', value: `<@${client.application?.owner?.id ?? '?'}>`, inline: true },
        { name: '⏱️ Uptime', value: formatDuration(client.uptime ?? 0), inline: true },
        { name: '🛠 Commands', value: `${client.commands.size}`, inline: true },
        { name: '🏠 Servers', value: `${client.guilds.cache.size}`, inline: true },
        { name: '👥 Users', value: `${client.users.cache.size}`, inline: true },
      )
      .setFooter({ text: 'Enerthya Bot — Open Source' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
});
