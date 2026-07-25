import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check the bot latency.');

export async function execute(interaction: ChatInputCommandInteraction) {
  const sent = await interaction.reply({
    content: 'Pong! 🏓',
    fetchReply: true,
  });

  const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;

  const embed = new EmbedBuilder()
    .setColor(0x2b2d31)
    .setTitle('🏓 Pong!')
    .addFields(
      { name: 'Roundtrip', value: `${roundtrip}ms`, inline: true },
      {
        name: 'WebSocket',
        value: `${interaction.client.ws.ping}ms`,
        inline: true,
      },
    )
    .setTimestamp();

  await interaction.editReply({ content: null, embeds: [embed] });
}
