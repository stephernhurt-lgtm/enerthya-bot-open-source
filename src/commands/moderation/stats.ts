import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ChannelType,
} from 'discord.js';
import { Guild } from '@db/schemas/guild';
import { Logger } from '@core/Logger';

export const data = new SlashCommandBuilder()
  .setName('stats')
  .setDescription('Set up server stats voice channels.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addChannelOption((opt) =>
    opt
      .setName('channel')
      .setDescription('Voice channel to rename with stats')
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildVoice),
  )
  .addStringOption((opt) =>
    opt
      .setName('type')
      .setDescription('What stat to show')
      .setRequired(true)
      .addChoices(
        { name: 'Total Members', value: 'total' },
        { name: 'Online Members', value: 'online' },
        { name: 'Bots', value: 'bots' },
        { name: 'Humans', value: 'humans' },
      ),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({ content: '❌ Server only.', ephemeral: true });
    return;
  }

  const channel = interaction.options.getChannel('channel', true);
  const type = interaction.options.getString('type', true);

  await interaction.deferReply({ ephemeral: true });

  const updateKey = `statsChannel_${type}` as const;
  await Guild.findOneAndUpdate(
    { guildId: interaction.guild.id },
    { [updateKey]: channel.id },
    { upsert: true },
  );

  await updateStatChannel(interaction.guild, channel.id, type);

  Logger.info(`Stats channel set: ${type} → #${channel.name}`);

  await interaction.editReply({
    content: `✅ **${type}** stats will be shown in ${channel}.`,
  });
}

async function updateStatChannel(guild: any, channelId: string, type: string): Promise<void> {
  const channel = guild.channels.cache.get(channelId);
  if (!channel) return;

  const members = guild.members.cache;
  let label = '';

  switch (type) {
    case 'total':
      label = `👥 Total: ${guild.memberCount}`;
      break;
    case 'online':
      label = `🟢 Online: ${members.filter((m: any) => m.presence?.status === 'online').size}`;
      break;
    case 'bots':
      label = `🤖 Bots: ${members.filter((m: any) => m.user.bot).size}`;
      break;
    case 'humans':
      label = `👤 Humans: ${members.filter((m: any) => !m.user.bot).size}`;
      break;
  }

  await channel.setName(label).catch(() => {});
}

export async function updateAllStats(guild: any): Promise<void> {
  const settings = await Guild.findOne({ guildId: guild.id });
  if (!settings) return;

  const types = ['total', 'online', 'bots', 'humans'] as const;
  for (const type of types) {
    const key = `statsChannel_${type}` as keyof typeof settings;
    const channelId = (settings as any)[key];
    if (channelId) {
      await updateStatChannel(guild, channelId, type);
    }
  }
}
