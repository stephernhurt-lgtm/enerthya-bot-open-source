import { EmbedBuilder } from 'discord.js';
import { defineCommand, Perm } from '../../utils/define.js';
import { Logger } from '../../core/Logger.js';
import { getAuditChannel, sendAudit } from '../../utils/audit.js';

export default defineCommand({
  name: 'kick',
  description: 'Kick a member from the server.',
  defaultMemberPermissions: Perm.KickMembers,
  options: [
    { type: 'user', name: 'target', description: 'The member to kick', required: true },
    {
      type: 'string',
      name: 'reason',
      description: 'Reason for the kick',
      max: 512,
      required: false,
    },
  ],
  execute: async (interaction) => {
    const target = interaction.options.getUser('target', true);
    const reason = interaction.options.getString('reason') ?? 'No reason provided.';

    if (!interaction.guild) {
      await interaction.reply({ content: '❌ Server only.', ephemeral: true });
      return;
    }

    const member = await interaction.guild.members.fetch(target.id).catch(() => null);
    if (!member?.kickable) {
      await interaction.reply({ content: '❌ Cannot kick that member.', ephemeral: true });
      return;
    }

    await member.kick(reason);
    Logger.info(`Kicked ${target.tag} | Reason: ${reason}`);

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle('👢 Member Kicked')
      .addFields(
        { name: 'User', value: `${target.tag} (${target.id})`, inline: true },
        { name: 'Reason', value: reason, inline: true },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    const auditCh = await getAuditChannel(interaction.guild.id, interaction.client.channels);
    if (auditCh) {
      await sendAudit(auditCh, 'kick', [
        { name: 'Target', value: `${target.tag} (${target.id})`, inline: true },
        { name: 'Reason', value: reason, inline: true },
        { name: 'Moderator', value: interaction.user.tag },
      ]);
    }
  },
});
