import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('serverinfo')
  .setDescription('Display information about this server.');

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ content: '❌ Server only.', ephemeral: true });
    return;
  }

  const guild = interaction.guild;
  const owner = await guild.fetchOwner().catch(() => null);

  const totalChannels = guild.channels.cache.size;
  const textChannels = guild.channels.cache.filter((c) => c.isTextBased()).size;
  const voiceChannels = guild.channels.cache.filter((c) => c.isVoiceBased()).size;

  const bots = guild.members.cache.filter((m) => m.user.bot).size;
  const humans = guild.members.cache.filter((m) => !m.user.bot).size;

  const boostLevel = guild.premiumTier ?? 0;
  const boostCount = guild.premiumSubscriptionCount ?? 0;

  const embed = new EmbedBuilder()
    .setColor(0x2b2d31)
    .setTitle(guild.name)
    .setThumbnail(guild.iconURL({ size: 256 }))
    .addFields(
      { name: 'Owner', value: owner?.user?.tag ?? 'Unknown', inline: true },
      { name: 'ID', value: guild.id, inline: true },
      {
        name: 'Created',
        value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
        inline: true,
      },
      { name: 'Members', value: `👤 ${humans} humans | 🤖 ${bots} bots`, inline: true },
      {
        name: 'Channels',
        value: `💬 ${textChannels} text | 🔊 ${voiceChannels} voice`,
        inline: true,
      },
      { name: 'Boosts', value: `⭐ Level ${boostLevel} (${boostCount} boosts)`, inline: true },
      { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
    )
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
