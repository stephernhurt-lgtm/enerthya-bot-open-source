import { EmbedBuilder } from 'discord.js';
import { defineCommand } from '../../utils/define.js';
import { isOwner } from '../../utils/owner.js';

export default defineCommand({
  name: 'credits',
  description: 'Show bot credits and contribution info.',
  execute: async (interaction) => {
    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle('⭐ Enerthya Bot — Open Source')
      .setDescription(
        'A modular Discord bot built with **discord.js v14** and **TypeScript**.\n\n' +
          'This bot is **open source** and free to use, modify, and distribute.\n\n' +
          '🔗 [GitHub Repository](https://github.com/stephernhurt-lgtm/enerthya-bot-open-source)\n' +
          '📝 License: MIT\n' +
          '👤 Built by [@stephernhurt-lgtm](https://github.com/stephernhurt-lgtm)',
      )
      .addFields(
        { name: '💻 Tech Stack', value: 'discord.js v14 · TypeScript · MongoDB · Mongoose' },
        {
          name: '📦 Commands',
          value: `${(interaction.client as any).commands?.size ?? '?'} total`,
        },
      )
      .setFooter({ text: 'Enerthya Bot — Open Source' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
});
