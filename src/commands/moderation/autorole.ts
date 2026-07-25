import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { Guild } from '@db/schemas/guild';
import { Logger } from '@core/Logger';

export const data = new SlashCommandBuilder()
  .setName('autorole')
  .setDescription('Set or remove the auto-role for new members.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .addSubcommand((sub) =>
    sub
      .setName('set')
      .setDescription('Set a role to be assigned automatically on join.')
      .addRoleOption((opt) =>
        opt.setName('role').setDescription('The role to assign').setRequired(true),
      ),
  )
  .addSubcommand((sub) => sub.setName('remove').setDescription('Remove the auto-role.'))
  .addSubcommand((sub) => sub.setName('view').setDescription('View current auto-role.'));

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ content: '❌ Server only.', ephemeral: true });
    return;
  }

  const sub = interaction.options.getSubcommand();
  const guildId = interaction.guild.id;

  if (sub === 'set') {
    const role = interaction.options.getRole('role', true);

    if (role.id === interaction.guild.roles.everyone.id) {
      await interaction.reply({ content: '❌ Cannot auto-assign @everyone.', ephemeral: true });
      return;
    }

    if (role.managed) {
      await interaction.reply({
        content: '❌ Cannot auto-assign bot-managed roles.',
        ephemeral: true,
      });
      return;
    }

    await Guild.findOneAndUpdate({ guildId }, { autoRoleId: role.id }, { upsert: true });
    Logger.info(`Autorole set: ${role.name} (${role.id}) in ${guildId}`);

    await interaction.reply({
      content: `✅ Auto-role set to **${role.name}**. New members will receive it on join.`,
      ephemeral: true,
    });
    return;
  }

  if (sub === 'remove') {
    await Guild.findOneAndUpdate({ guildId }, { autoRoleId: null });
    Logger.info(`Autorole removed in ${guildId}`);

    await interaction.reply({
      content: '✅ Auto-role removed.',
      ephemeral: true,
    });
    return;
  }

  if (sub === 'view') {
    const settings = await Guild.findOne({ guildId });

    if (settings?.autoRoleId) {
      const role = interaction.guild.roles.cache.get(settings.autoRoleId);
      await interaction.reply({
        content: role
          ? `🔹 Current auto-role: ${role}`
          : `⚠️ Auto-role set but the role no longer exists (ID: \`${settings.autoRoleId}\`).`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'ℹ️ No auto-role configured.',
        ephemeral: true,
      });
    }
  }
}
