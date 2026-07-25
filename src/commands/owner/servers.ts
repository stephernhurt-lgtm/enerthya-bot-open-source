import { EmbedBuilder } from 'discord.js';
import { ownerOnly } from '../../utils/define.js';

export default ownerOnly('servers', 'List all servers the bot is in.', async (interaction) => {
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
});
