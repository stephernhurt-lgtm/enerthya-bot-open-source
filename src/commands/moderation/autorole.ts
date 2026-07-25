import { Perm } from '../../utils/permissions.js';
import { defineCommand } from '../../utils/define.js';
import { Guild } from '../../db/schemas/guild.js';
import { Logger } from '../../core/Logger.js';

export default defineCommand({
  name: 'autorole',
  description: 'Set or remove the auto-role for new members.',
  defaultMemberPermissions: Perm.ManageRoles,
  subcommands: [
    {
      name: 'set',
      description: 'Set a role to assign on join.',
      options: [{ type: 'role', name: 'role', description: 'The role', required: true }],
    },
    { name: 'remove', description: 'Remove the auto-role.' },
    { name: 'view', description: 'View current auto-role.' },
  ],
  execute: async (interaction) => {
    if (!interaction.guild) {
      await interaction.reply({ content: '❌ Server only.', ephemeral: true });
      return;
    }

    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (sub === 'set') {
      const role = interaction.options.getRole('role', true);
      if (role.id === interaction.guild.roles.everyone.id || role.managed) {
        await interaction.reply({ content: '❌ Cannot auto-assign that role.', ephemeral: true });
        return;
      }
      await Guild.findOneAndUpdate({ guildId }, { autoRoleId: role.id }, { upsert: true });
      Logger.info(`Autorole set: ${role.name} in ${guildId}`);
      await interaction.reply({
        content: `✅ Auto-role set to **${role.name}**.`,
        ephemeral: true,
      });
      return;
    }

    if (sub === 'remove') {
      await Guild.findOneAndUpdate({ guildId }, { autoRoleId: null });
      await interaction.reply({ content: '✅ Auto-role removed.', ephemeral: true });
      return;
    }

    const settings = await Guild.findOne({ guildId });
    if (settings?.autoRoleId) {
      const role = interaction.guild.roles.cache.get(settings.autoRoleId);
      await interaction.reply({
        content: role ? `🔹 Auto-role: ${role}` : `⚠️ Role no longer exists.`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({ content: 'ℹ️ No auto-role.', ephemeral: true });
    }
  },
});
