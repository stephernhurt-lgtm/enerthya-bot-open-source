import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} from 'discord.js';
import { Giveaway, IGiveaway } from '@db/schemas/giveaway';
import { Logger } from '@core/Logger';

export const data = new SlashCommandBuilder()
  .setName('giveaway')
  .setDescription('Manage giveaways.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addSubcommand((sub) =>
    sub
      .setName('start')
      .setDescription('Start a giveaway.')
      .addStringOption((opt) =>
        opt.setName('prize').setDescription('Prize name').setRequired(true).setMaxLength(200),
      )
      .addIntegerOption((opt) =>
        opt
          .setName('duration')
          .setDescription('Duration in minutes')
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(10080),
      )
      .addIntegerOption((opt) =>
        opt
          .setName('winners')
          .setDescription('Number of winners (default 1)')
          .setMinValue(1)
          .setMaxValue(10),
      ),
  )
  .addSubcommand((sub) =>
    sub
      .setName('end')
      .setDescription('End a giveaway early.')
      .addStringOption((opt) =>
        opt.setName('message_id').setDescription('Message ID of the giveaway').setRequired(true),
      ),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ content: '❌ Server only.', ephemeral: true });
    return;
  }

  const sub = interaction.options.getSubcommand();

  if (sub === 'start') {
    const prize = interaction.options.getString('prize', true);
    const durationMin = interaction.options.getInteger('duration', true);
    const winnerCount = interaction.options.getInteger('winners') ?? 1;
    const endsAt = new Date(Date.now() + durationMin * 60 * 1000);

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle('🎁 Giveaway')
      .setDescription(`**${prize}**`)
      .addFields(
        { name: 'Ends', value: `<t:${Math.floor(endsAt.getTime() / 1000)}:R>`, inline: true },
        { name: 'Winners', value: `${winnerCount}`, inline: true },
        { name: 'Hosted by', value: interaction.user.toString(), inline: true },
      )
      .setFooter({ text: 'React with 🎉 to enter' })
      .setTimestamp();

    if (!interaction.channel || !('send' in interaction.channel)) {
      await interaction.reply({ content: '❌ Cannot send messages here.', ephemeral: true });
      return;
    }

    const message = await (interaction.channel as any).send({ embeds: [embed] });
    await message.react('🎉');

    await Giveaway.create({
      guildId: interaction.guild.id,
      channelId: interaction.channel!.id,
      messageId: message.id,
      prize,
      winnerCount,
      endsAt,
      hosterId: interaction.user.id,
    });

    Logger.info(`Giveaway started: "${prize}" (${durationMin}min)`);

    await interaction.reply({
      content: `✅ Giveaway started! [Jump](${message.url})`,
      ephemeral: true,
    });
    return;
  }

  if (sub === 'end') {
    const messageId = interaction.options.getString('message_id', true);

    const giveaway = await Giveaway.findOne({
      guildId: interaction.guild.id,
      messageId,
      ended: false,
    });

    if (!giveaway) {
      await interaction.reply({
        content: '❌ Giveaway not found or already ended.',
        ephemeral: true,
      });
      return;
    }

    giveaway.endsAt = new Date();
    await giveaway.save();

    await endGiveaway(giveaway, interaction.client);

    await interaction.reply({
      content: '✅ Giveaway ended early!',
      ephemeral: true,
    });
  }
}

export async function endGiveaway(giveaway: IGiveaway, client: any): Promise<void> {
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

    const winners = entries.sort(() => Math.random() - 0.5).slice(0, giveaway.winnerCount);

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
