import { EmbedBuilder } from 'discord.js';
import { defineCommand, Perm } from '../../utils/builders/define.js';
import { Giveaway } from '../../db/schemas/giveaway.js';
import { Logger } from '../../core/Logger.js';
import { timestamp } from '../../utils/format/time.js';
import { endGiveaway } from '../../services/giveawayService.js';

export default defineCommand({
  name: 'giveaway',
  description: 'Manage giveaways.',
  defaultMemberPermissions: Perm.ManageGuild,
  subcommands: [
    {
      name: 'start',
      description: 'Start a giveaway.',
      options: [
        { type: 'string', name: 'prize', description: 'Prize name', required: true, max: 200 },
        {
          type: 'integer',
          name: 'duration',
          description: 'Duration in minutes',
          required: true,
          min: 1,
          max: 10080,
        },
        {
          type: 'integer',
          name: 'winners',
          description: 'Number of winners (default 1)',
          min: 1,
          max: 10,
        },
      ],
    },
    {
      name: 'end',
      description: 'End a giveaway early.',
      options: [
        {
          type: 'string',
          name: 'message_id',
          description: 'Message ID of the giveaway',
          required: true,
        },
      ],
    },
  ],
  execute: async (interaction) => {
    if (!interaction.guild) {
      await interaction.reply({ content: '❌ Server only.', ephemeral: true });
      return;
    }

    const sub = interaction.options.getSubcommand();

    if (sub === 'start') {
      const prize = interaction.options.getString('prize', true);
      const durationMin = interaction.options.getInteger('duration', true);
      const winnerCount = interaction.options.getInteger('winners') ?? 1;
      const endsAt = new Date(Date.now() + durationMin * 60_000);

      const embed = new EmbedBuilder()
        .setColor(0x2b2d31)
        .setTitle('🎁 Giveaway')
        .setDescription(`**${prize}**`)
        .addFields(
          { name: 'Ends', value: timestamp(endsAt, 'R'), inline: true },
          { name: 'Winners', value: `${winnerCount}`, inline: true },
          { name: 'Hosted by', value: interaction.user.toString(), inline: true },
        )
        .setFooter({ text: 'React with 🎉 to enter' })
        .setTimestamp();

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
      Logger.info(`Giveaway: "${prize}" (${durationMin}min)`);
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
        await interaction.reply({ content: '❌ Not found or already ended.', ephemeral: true });
        return;
      }
      giveaway.endsAt = new Date();
      await giveaway.save();
      await endGiveaway(giveaway, interaction.client);
      await interaction.reply({ content: '✅ Giveaway ended early!', ephemeral: true });
    }
  },
});
