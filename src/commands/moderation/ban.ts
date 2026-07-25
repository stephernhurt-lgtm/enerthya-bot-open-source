import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} from 'discord.js';
import { Logger } from '@core/Logger';

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Ban a member from the server.')
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .addUserOption((option) =>
    option.setName('target').setDescription('The member to ban.').setRequired(true),
  )
  .addStringOption((option) =>
    option.setName('reason').setDescription('Reason for the ban.').setMaxLength(512),
  )
  .addIntegerOption((option) =>
    option
      .setName('delete_messages')
      .setDescription('Delete recent messages (0–7 days).')
      .setMinValue(0)
      .setMaxValue(7),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getUser('target', true);
  const reason = interaction.options.getString('reason') ?? 'No reason provided.';
  const deleteDays = interaction.options.getInteger('delete_messages') ?? 0;

  if (!interaction.guild) {
    await interaction.reply({
      content: '❌ This command can only be used in a server.',
      ephemeral: true,
    });
    return;
  }

  const member = await interaction.guild.members.fetch(target.id).catch(() => null);

  if (!member) {
    await interaction.reply({ content: '❌ That user is not in this server.', ephemeral: true });
    return;
  }

  if (!member.bannable) {
    await interaction.reply({ content: '❌ I cannot ban that member.', ephemeral: true });
    return;
  }

  if (
    interaction.member &&
    member.roles.highest.position >= (interaction.member as any).roles.highest.position
  ) {
    await interaction.reply({
      content: '❌ You cannot ban someone with an equal or higher role.',
      ephemeral: true,
    });
    return;
  }

  await member.ban({ reason, deleteMessageDays: deleteDays });
  Logger.info(`Banned ${target.tag} | Reason: ${reason} | Delete days: ${deleteDays}`);

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
}
