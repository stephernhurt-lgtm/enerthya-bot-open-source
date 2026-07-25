import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Logger } from '@core/Logger';

const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

export const data = new SlashCommandBuilder()
  .setName('poll')
  .setDescription('Create a poll with reactions.')
  .addStringOption((opt) =>
    opt.setName('question').setDescription('Poll question').setRequired(true).setMaxLength(256),
  )
  .addStringOption((opt) =>
    opt
      .setName('options')
      .setDescription('Options separated by | (e.g. Yes | No | Maybe)')
      .setRequired(true)
      .setMaxLength(500),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const question = interaction.options.getString('question', true);
  const optionsRaw = interaction.options.getString('options', true);

  const options = optionsRaw
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);

  if (options.length < 2) {
    await interaction.reply({
      content: '❌ Provide at least 2 options separated by `|`.',
      ephemeral: true,
    });
    return;
  }

  if (options.length > 10) {
    await interaction.reply({
      content: '❌ Maximum 10 options allowed.',
      ephemeral: true,
    });
    return;
  }

  const description = options.map((opt, i) => `${emojis[i]}  ${opt}`).join('\n\n');

  const embed = new EmbedBuilder()
    .setColor(0x2b2d31)
    .setTitle('📊 ' + question)
    .setDescription(description)
    .setFooter({ text: `Poll by ${interaction.user.tag}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });

  const message = await interaction.fetchReply();

  for (let i = 0; i < options.length; i++) {
    await message.react(emojis[i]);
  }

  Logger.info(`Poll created: "${question}" (${options.length} options)`);
}
