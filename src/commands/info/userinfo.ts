import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('userinfo')
  .setDescription('Display information about a user.')
  .addUserOption((opt) => opt.setName('target').setDescription('The user to inspect'));

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getUser('target') ?? interaction.user;
  const member = interaction.guild
    ? await interaction.guild.members.fetch(target.id).catch(() => null)
    : null;

  const embed = new EmbedBuilder()
    .setColor(0x2b2d31)
    .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL() })
    .setThumbnail(target.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: 'ID', value: target.id, inline: true },
      { name: 'Bot', value: target.bot ? 'Yes' : 'No', inline: true },
      {
        name: 'Created',
        value: `<t:${Math.floor(target.createdTimestamp / 1000)}:R>`,
        inline: true,
      },
    )
    .setTimestamp();

  if (member) {
    const roles = member.roles.cache
      .filter((r) => r.id !== interaction.guild?.roles.everyone.id)
      .sort((a, b) => b.position - a.position)
      .map((r) => r.toString());

    embed.addFields(
      {
        name: 'Joined',
        value: `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>`,
        inline: true,
      },
      { name: `Roles (${roles.length})`, value: roles.slice(0, 10).join(', ') || 'None' },
    );
  }

  await interaction.reply({ embeds: [embed] });
}
