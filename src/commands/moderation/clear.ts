import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { Logger } from '@core/Logger';
import { getAuditChannel, sendAudit } from '@utils/audit';

export const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Bulk delete messages in the channel.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addIntegerOption((option) =>
    option
      .setName('amount')
      .setDescription('Number of messages to delete (1–100).')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(100),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const amount = interaction.options.getInteger('amount', true);

  if (!interaction.guild) {
    await interaction.reply({
      content: '❌ This command can only be used in a server.',
      ephemeral: true,
    });
    return;
  }

  if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages)) {
    await interaction.reply({
      content: '❌ You need `Manage Messages` permission.',
      ephemeral: true,
    });
    return;
  }

  try {
    if (!interaction.channel || !interaction.channel.isTextBased()) {
      await interaction.reply({
        content: '❌ This command can only be used in a text channel.',
        ephemeral: true,
      });
      return;
    }

    if (
      !('bulkDelete' in interaction.channel) ||
      typeof interaction.channel.bulkDelete !== 'function'
    ) {
      await interaction.reply({
        content: '❌ Bulk delete is not available in this channel type.',
        ephemeral: true,
      });
      return;
    }

    const messages = await interaction.channel.bulkDelete(amount, true);
    const deleted = messages?.size ?? 0;

    const reply = await interaction.reply({
      content: `✅ Cleared **${deleted}** message${deleted !== 1 ? 's' : ''}.`,
    });

    setTimeout(() => reply.delete().catch(() => {}), 5000);

    if (interaction.guild) {
      const auditCh = await getAuditChannel(interaction.guild.id, interaction.client.channels);
      if (auditCh) {
        await sendAudit(auditCh, 'clear', [
          { name: 'Channel', value: `<#${interaction.channel.id}>`, inline: true },
          { name: 'Messages', value: `${deleted}`, inline: true },
          { name: 'Moderator', value: interaction.user.tag },
        ]);
      }
    }
  } catch {
    await interaction.reply({
      content: '❌ Could not delete messages. They may be older than 14 days.',
      ephemeral: true,
    });
  }
}
