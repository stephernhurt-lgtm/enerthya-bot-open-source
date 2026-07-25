import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ComponentEmojiResolvable,
  Message,
  ChatInputCommandInteraction,
} from 'discord.js';

interface PageItem {
  name: string;
  value: string;
  inline?: boolean;
}

/**
 * Create a paginated embed with ⬅️ ➡️ navigation buttons.
 * Returns the message so you can edit it when buttons are clicked.
 */
export async function paginate(
  interaction: ChatInputCommandInteraction,
  title: string,
  items: PageItem[],
  itemsPerPage = 5,
): Promise<void> {
  const pages: PageItem[][] = [];
  for (let i = 0; i < items.length; i += itemsPerPage) {
    pages.push(items.slice(i, i + itemsPerPage));
  }

  if (pages.length === 0) {
    await interaction.reply({ content: '❌ No data.', ephemeral: true });
    return;
  }

  let currentPage = 0;

  const buildEmbed = (page: number) =>
    new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle(title)
      .addFields(pages[page])
      .setFooter({ text: `Page ${page + 1} of ${pages.length}` })
      .setTimestamp();

  const row = (page: number) =>
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('prev')
        .setEmoji('⬅️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page === 0),
      new ButtonBuilder()
        .setCustomId('next')
        .setEmoji('➡️')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page === pages.length - 1),
      new ButtonBuilder().setCustomId('close').setEmoji('❌').setStyle(ButtonStyle.Danger),
    );

  const reply = await interaction.reply({
    embeds: [buildEmbed(currentPage)],
    components: [row(currentPage)],
    fetchReply: true,
  });

  const collector = reply.createMessageComponentCollector({
    time: 60_000,
  });

  collector.on('collect', async (button) => {
    if (button.user.id !== interaction.user.id) {
      await button.reply({ content: '❌ Not your menu.', ephemeral: true });
      return;
    }

    if (button.customId === 'prev' && currentPage > 0) currentPage--;
    if (button.customId === 'next' && currentPage < pages.length - 1) currentPage++;
    if (button.customId === 'close') {
      await button.update({ components: [] });
      collector.stop();
      return;
    }

    await button.update({ embeds: [buildEmbed(currentPage)], components: [row(currentPage)] });
  });

  collector.on('end', async () => {
    if (reply.editable) {
      await reply.edit({ components: [] }).catch(() => {});
    }
  });
}
