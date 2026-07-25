import { EmbedBuilder } from 'discord.js';
import { defineCommand } from '../../utils/define.js';
import { formatDuration } from '../../utils/time.js';
import { isOwner } from '../../utils/owner.js';

export default defineCommand({
  name: 'botinfo',
  description: 'Display bot information.',
  execute: async (interaction) => {
    const client = interaction.client as any;
    const owner = isOwner(interaction.user.id);

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setAuthor({ name: client.user?.username ?? 'Bot', iconURL: client.user?.displayAvatarURL() })
      .setDescription(
        'A modular, open-source Discord bot built with discord.js v14.\n\n_Open source contribution by [Enerthya](https://github.com/stephernhurt-lgtm/enerthya-bot-open-source)_',
      )
      .addFields(
        { name: '⏱️ Uptime', value: formatDuration(client.uptime ?? 0), inline: true },
        { name: '🛠 Commands', value: `${client.commands.size}`, inline: true },
        { name: '🏠 Servers', value: `${client.guilds.cache.size}`, inline: true },
      )
      .setFooter({ text: 'Enerthya Bot — Open Source' })
      .setTimestamp();

    // Owner-only: extra info
    if (owner) {
      embed.addFields(
        { name: '🤖 Owner', value: `<@${client.application?.owner?.id ?? '?'}>`, inline: true },
        { name: '👥 Users', value: `${client.users.cache.size}`, inline: true },
        { name: '📦 Node', value: process.version, inline: true },
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
});
