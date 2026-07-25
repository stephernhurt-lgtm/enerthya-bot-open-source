import { EmbedBuilder } from 'discord.js';
import { defineCommand } from '../../utils/define.js';

export default defineCommand({
  name: 'serverinfo',
  description: 'Display information about this server.',
  execute: async (interaction) => {
    if (!interaction.guild) {
      await interaction.reply({ content: '❌ Server only.', ephemeral: true });
      return;
    }

    const guild = interaction.guild;
    const owner = await guild.fetchOwner().catch(() => null);
    const bots = guild.members.cache.filter((m: any) => m.user.bot).size;
    const humans = guild.members.cache.filter((m: any) => !m.user.bot).size;

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL({ size: 256 })!)
      .addFields(
        { name: 'Owner', value: owner?.user?.tag ?? 'Unknown', inline: true },
        { name: 'ID', value: guild.id, inline: true },
        {
          name: 'Created',
          value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        { name: 'Members', value: `👤 ${humans} humans | 🤖 ${bots} bots`, inline: true },
        { name: 'Channels', value: `${guild.channels.cache.size} total`, inline: true },
        {
          name: 'Boosts',
          value: `⭐ Level ${guild.premiumTier ?? 0} (${guild.premiumSubscriptionCount ?? 0})`,
          inline: true,
        },
        { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
});
