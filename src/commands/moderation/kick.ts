import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} from 'discord.js';
import { Logger } from '@core/Logger';

export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Kick a member from the server.')
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
  .addUserOption((option) =>
    option.setName('target').setDescription('The member to kick.').setRequired(true),
  )
  .addStringOption((option) =>
    option.setName('reason').setDescription('Reason for the kick.').setMaxLength(512),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getUser('target', true);
  const reason = interaction.options.getString('reason') ?? 'No reason provided.';

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

  if (!member.kickable) {
    await interaction.reply({
      content: '❌ I cannot kick that member. They may have a higher role.',
      ephemeral: true,
    });
    return;
  }

  if (
    interaction.member &&
    member.roles.highest.position >= (interaction.member as any).roles.highest.position
  ) {
    await interaction.reply({
      content: '❌ You cannot kick someone with an equal or higher role.',
      ephemeral: true,
    });
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
}
