import { EmbedBuilder } from 'discord.js';
import { defineCommand } from '../../utils/define.js';

export default defineCommand({
  name: 'servers',
  description: 'List all servers the bot is in.',
  ownerOnly: true,
  execute: async (interaction) => {
    const client = interaction.client as any;
    const guilds = client.guilds.cache
      .map((g: any) => `**${g.name}** — ${g.memberCount} members (${g.id})`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle('📋 Servers')
      .setDescription(guilds || 'No servers.')
      .setFooter({ text: `${client.guilds.cache.size} total` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
});
