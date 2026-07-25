import { EmbedBuilder } from 'discord.js';
import { defineCommand } from '../../utils/builders/define.js';

export default defineCommand({
  name: 'userinfo',
  description: 'Display information about a user.',
  options: [{ type: 'user', name: 'target', description: 'The user to inspect', required: false }],
  execute: async (interaction) => {
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
        .filter((r: any) => r.id !== interaction.guild?.roles.everyone.id)
        .sort((a: any, b: any) => b.position - a.position)
        .map((r: any) => r.toString());
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
  },
});
