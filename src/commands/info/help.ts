import { EmbedBuilder } from 'discord.js';
import { defineCommand } from '../../utils/define.js';
import type { BotClient } from '../../core/Client.js';

const categoryEmojis: Record<string, string> = {
  info: 'ℹ️',
  moderation: '🛡️',
  admin: '⚙️',
  owner: '👑',
};

export default defineCommand({
  name: 'help',
  description: 'List all available commands.',
  execute: async (interaction) => {
    const client = interaction.client as BotClient;
    const grouped = new Map<string, any[]>();

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

    for (const [category, cmds] of grouped) {
      const emoji = categoryEmojis[category] ?? '📁';
      const list = cmds
        .map((c: any) => `\`/${(c.data as any).name}\` — ${(c.data as any).description ?? ''}`)
        .join('\n');
      embed.addFields({
        name: `${emoji} ${category.charAt(0).toUpperCase() + category.slice(1)}`,
        value: list,
      });
    }

    embed.setFooter({ text: 'Enerthya Bot' });
    await interaction.reply({ embeds: [embed] });
  },
});
