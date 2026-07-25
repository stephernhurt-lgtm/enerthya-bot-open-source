import { EmbedBuilder } from 'discord.js';
import { defineCommand } from '../../utils/define.js';

export default defineCommand({
  name: 'botinfo',
  description: 'Display bot information.',
  execute: async (interaction) => {
    const client = interaction.client as any;

    const uptime = ((ms: number) => {
      const s = Math.floor(ms / 1000) % 60;
      const m = Math.floor(ms / (1000 * 60)) % 60;
      const h = Math.floor(ms / (1000 * 60 * 60)) % 24;
      const d = Math.floor(ms / (1000 * 60 * 60 * 24));
      return `${d}d ${h}h ${m}m ${s}s`;
    })(client.uptime ?? 0);

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setAuthor({ name: client.user?.username ?? 'Bot', iconURL: client.user?.displayAvatarURL() })
      .setDescription('A modular, open-source Discord bot built with discord.js v14.')
      .addFields(
        { name: '🤖 Developer', value: `<@${client.application?.owner?.id ?? '?'}>`, inline: true },
        { name: '⏱️ Uptime', value: uptime, inline: true },
        { name: '🛠 Commands', value: `${client.commands.size}`, inline: true },
        { name: '🏠 Servers', value: `${client.guilds.cache.size}`, inline: true },
        { name: '👥 Users', value: `${client.users.cache.size}`, inline: true },
      )
      .setFooter({ text: 'Enerthya Bot — Open Source' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
});
