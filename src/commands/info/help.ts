import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import { BotClient, BotCommand } from '@core/Client';

const categoryEmojis: Record<string, string> = {
  info: 'ℹ️',
  moderation: '🛡️',
};

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('List all available commands.');

export async function execute(interaction: ChatInputCommandInteraction) {
  const client = interaction.client as BotClient;

  const grouped = new Map<string, BotCommand[]>();

  for (const cmd of client.commands.values()) {
    const cat = cmd.category ?? 'general';
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(cmd);
  }

  const embed = new EmbedBuilder()
    .setColor(0x2b2d31)
    .setTitle('📖 Commands')
    .setDescription(`**${client.commands.size}** commands available`)
    .setTimestamp();

  for (const [category, commands] of grouped) {
    const emoji = categoryEmojis[category] ?? '📁';
    const list = commands
      .map(c => {
        const cmdData = c.data as any;
        return `/${cmdData.name} — ${cmdData.description ?? 'No description'}`;
      })
      .join('\n');

    embed.addFields({
      name: `${emoji} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
      value: list,
    });
  }

  embed.setFooter({ text: 'Enerthya Bot — Open Source' });

  await interaction.reply({ embeds: [embed] });
}
