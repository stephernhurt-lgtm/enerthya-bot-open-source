import { EmbedBuilder } from 'discord.js';
import { Giveaway } from '../../db/schemas/giveaway.js';
import { Logger } from '../../core/Logger.js';

export async function endGiveaway(giveaway: any, client: any): Promise<void> {
  try {
    const channel = await client.channels.fetch(giveaway.channelId).catch(() => null);
    if (!channel) return;
    const message = await channel.messages.fetch(giveaway.messageId).catch(() => null);
    if (!message) return;

    const reaction = message.reactions.cache.get('🎉');
    if (!reaction) {
      await message.reply('❌ No entries found.');
      return;
    }

    const users = await reaction.users.fetch();
    const entries = users.filter((u: any) => !u.bot).map((u: any) => u);

    if (entries.length === 0) {
      const embed = EmbedBuilder.from(message.embeds[0])
        .setColor(0xed4245)
        .setFooter({ text: 'Ended — No winners' });
      await message.edit({ embeds: [embed] });
      await message.reply('🎁 Giveaway ended — no one entered.');
      return;
    }

    // Fisher-Yates shuffle
    for (let i = entries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [entries[i], entries[j]] = [entries[j], entries[i]];
    }
    const winners = entries.slice(0, giveaway.winnerCount);

    const embed = EmbedBuilder.from(message.embeds[0])
      .setColor(0x57f287)
      .setFooter({ text: 'Ended' });
    await message.edit({ embeds: [embed] });
    await message.reply(
      `🎁 **${giveaway.prize}**\nWinner(s): ${winners.map((w: any) => w.toString()).join(', ')}`,
    );

    await Giveaway.findByIdAndUpdate(giveaway._id, { ended: true });
    Logger.info(`Giveaway ended: "${giveaway.prize}" — ${winners.length} winner(s)`);
  } catch (error) {
    Logger.error('Giveaway end error:', error);
  }
}
