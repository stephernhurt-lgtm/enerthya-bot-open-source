import { EmbedBuilder } from 'discord.js';
import { defineCommand, Perm } from '../../utils/define.js';
import { getAuditChannel, sendAudit } from '../../utils/audit.js';

export default defineCommand({
  name: 'ban',
  description: 'Ban a member from the server.',
  defaultMemberPermissions: Perm.BanMembers,
  options: [
    { type: 'user', name: 'target', description: 'The member to ban', required: true },
    { type: 'string', name: 'reason', description: 'Reason for the ban', max: 512 },
    {
      type: 'integer',
      name: 'delete_messages',
      description: 'Delete recent messages (0–7 days)',
      min: 0,
      max: 7,
    },
  ],
  execute: async (interaction) => {
    const target = interaction.options.getUser('target', true);
    const reason = interaction.options.getString('reason') ?? 'No reason provided.';
    const deleteDays = interaction.options.getInteger('delete_messages') ?? 0;

    if (!interaction.guild) {
      await interaction.reply({ content: '❌ Server only.', ephemeral: true });
      return;
    }

    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member) {
      await interaction.reply({ content: '❌ Not in this server.', ephemeral: true });
      return;
    }

    if (!member.bannable) {
      await interaction.reply({ content: '❌ I cannot ban that member.', ephemeral: true });
      return;
    }

    await member.ban({ reason, deleteMessageDays: deleteDays });

    const { EmbedBuilder } = await import('discord.js');
    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle('🔨 Member Banned')
      .addFields(
        { name: 'User', value: `${target.tag} (${target.id})`, inline: true },
        { name: 'Reason', value: reason, inline: true },
        {
          name: 'Messages Deleted',
          value: deleteDays > 0 ? `${deleteDays} day(s)` : 'None',
          inline: true,
        },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // Audit log
    const auditCh = await getAuditChannel(interaction.guild.id, interaction.client.channels);
    if (auditCh) {
      await sendAudit(auditCh, 'ban', [
        { name: 'Target', value: `${target.tag} (${target.id})`, inline: true },
        { name: 'Reason', value: reason, inline: true },
        {
          name: 'Messages Deleted',
          value: deleteDays > 0 ? `${deleteDays} day(s)` : 'None',
          inline: true,
        },
        { name: 'Moderator', value: interaction.user.tag },
      ]);
    }
  },
});
