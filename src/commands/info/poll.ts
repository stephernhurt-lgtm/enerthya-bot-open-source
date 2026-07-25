import { EmbedBuilder } from 'discord.js';
import { defineCommand } from '../../utils/builders/define.js';

// Mixing approaches — use defineCommand for the poll, or cmd/str for simpler cases
export default defineCommand({
  name: 'poll',
  description: 'Create a poll with reactions.',
  options: [
    { type: 'string', name: 'question', description: 'Poll question', required: true, max: 256 },
    {
      type: 'string',
      name: 'options',
      description: 'Options separated by | (e.g. Yes | No | Maybe)',
      required: true,
      max: 500,
    },
  ],
  execute: async (interaction) => {
    const question = interaction.options.getString('question', true);
    const raw = interaction.options.getString('options', true);
    const options = raw
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean);

    if (options.length < 2 || options.length > 10) {
      await interaction.reply({
        content: '❌ Need 2–10 options separated by `|`.',
        ephemeral: true,
      });
      return;
    }

    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    const desc = options.map((opt, i) => `${emojis[i]}  ${opt}`).join('\n\n');

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle('📊 ' + question)
      .setDescription(desc)
      .setFooter({ text: `Poll by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
    const message = await interaction.fetchReply();

    for (let i = 0; i < options.length; i++) await message.react(emojis[i]);
  },
});
