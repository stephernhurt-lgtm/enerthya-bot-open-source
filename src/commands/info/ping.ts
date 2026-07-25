import { EmbedBuilder } from 'discord.js';
import { cmd } from '../../utils/builder';

export const data = cmd('ping', 'Check the bot latency.');

export async function execute(interaction: any) {
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
}

export async function prefixExecute(message: any, _args: string[]) {
  const sent = await message.reply('Pong! 🏓');
  const roundtrip = sent.createdTimestamp - message.createdTimestamp;

  const embed = new EmbedBuilder()
    .setColor(0x2b2d31)
    .setTitle('🏓 Pong!')
    .addFields(
      { name: 'Roundtrip', value: `${roundtrip}ms`, inline: true },
      { name: 'WebSocket', value: `${message.client.ws.ping}ms`, inline: true },
    )
    .setTimestamp();

  await sent.edit({ content: null, embeds: [embed] });
}
