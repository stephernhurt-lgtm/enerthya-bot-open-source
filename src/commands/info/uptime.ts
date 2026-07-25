import { EmbedBuilder } from 'discord.js';
import { defineCommand } from '../../utils/define.js';

export default defineCommand({
  name: 'uptime',
  description: 'Check bot uptime.',
  execute: async (interaction) => {
    const client = interaction.client as any;
    const total = (client.uptime ?? 0) / 1000;
    const d = Math.floor(total / 86400);
    const h = Math.floor((total % 86400) / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = Math.floor(total % 60);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x2b2d31)
          .setTitle('⏱️ Uptime')
          .setDescription(`**${d}d ${h}h ${m}m ${s}s**`)
          .setTimestamp(),
      ],
    });
  },
});
