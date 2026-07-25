import { PermissionFlagsBits } from 'discord.js';
import { defineCommand } from '../../utils/define.js';
import { Logger } from '../../core/Logger.js';
import { getAuditChannel, sendAudit } from '../../utils/audit.js';

export default defineCommand({
  name: 'clear',
  description: 'Bulk delete messages in the channel.',
  defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
  options: [
    {
      type: 'integer',
      name: 'amount',
      description: 'Number of messages to delete (1–100)',
      required: true,
      min: 1,
      max: 100,
    },
  ],
  execute: async (interaction) => {
    const amount = interaction.options.getInteger('amount', true);

    if (!interaction.guild || !interaction.channel) {
      await interaction.reply({ content: '❌ Server only.', ephemeral: true });
      return;
    }

    if (!interaction.channel.isTextBased?.() || !('bulkDelete' in interaction.channel)) {
      await interaction.reply({ content: '❌ Not available in this channel.', ephemeral: true });
      return;
    }

    try {
      const messages = await (interaction.channel as any).bulkDelete(amount, true);
      const deleted = messages?.size ?? 0;

      const reply = await interaction.reply({
        content: `✅ Cleared **${deleted}** message${deleted !== 1 ? 's' : ''}.`,
      });
      setTimeout(() => reply.delete().catch(() => {}), 5000);

      const auditCh = await getAuditChannel(interaction.guild.id, interaction.client.channels);
      if (auditCh) {
        await sendAudit(auditCh, 'clear', [
          { name: 'Channel', value: `<#${interaction.channel.id}>`, inline: true },
          { name: 'Messages', value: `${deleted}`, inline: true },
          { name: 'Moderator', value: interaction.user.tag },
        ]);
      }
    } catch {
      await interaction.reply({
        content: '❌ Could not delete messages. They may be older than 14 days.',
        ephemeral: true,
      });
    }
  },
});
