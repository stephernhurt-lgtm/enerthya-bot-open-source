import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  version as djsVersion,
} from 'discord.js';
import { BotClient } from '@core/Client';

export const data = new SlashCommandBuilder()
  .setName('botinfo')
  .setDescription('Display bot information.');

export async function execute(interaction: ChatInputCommandInteraction) {
  const client = interaction.client as BotClient;
  const uptime = formatUptime(client.uptime ?? 0);

  const embed = new EmbedBuilder()
    .setColor(0x2b2d31)
    .setAuthor({
      name: client.user?.username ?? 'Bot',
      iconURL: client.user?.displayAvatarURL(),
    })
    .setDescription('A modular, open-source Discord bot built with discord.js v14.')
    .addFields(
      { name: '🤖 Developer', value: `<@${client.application?.owner?.id ?? '?'}>`, inline: true },
      { name: '📦 Library', value: `discord.js v${djsVersion}`, inline: true },
      { name: '⏱ Uptime', value: uptime, inline: true },
      { name: '🛠 Commands', value: `${client.commands.size}`, inline: true },
      { name: '🏠 Servers', value: `${client.guilds.cache.size}`, inline: true },
      { name: '👥 Users', value: `${client.users.cache.size}`, inline: true },
    )
    .setFooter({ text: 'Enerthya Bot — Open Source' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

function formatUptime(ms: number): string {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / (1000 * 60)) % 60;
  const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
