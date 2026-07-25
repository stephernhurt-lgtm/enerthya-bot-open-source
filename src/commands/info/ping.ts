import { EmbedBuilder } from 'discord.js';
import { defineCommand } from '../../utils/define.js';

export default defineCommand({
  name: 'ping',
  description: 'Check the bot latency.',
  execute: async (interaction) => {
    const sent = await interaction.reply({ content: 'Pong! 🏓', fetchReply: true });
    const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle('🏓 Pong!')
      .addFields(
        { name: 'Roundtrip', value: `${roundtrip}ms`, inline: true },
        { name: 'WebSocket', value: `${interaction.client.ws.ping}ms`, inline: true },
      )
      .setTimestamp();

    await interaction.editReply({ content: null, embeds: [embed] });
  },
});
