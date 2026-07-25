import { ChannelType } from 'discord.js';
import { defineCommand, Perm } from '../../utils/builders/define.js';
import { Guild } from '../../db/schemas/guild.js';
import { Logger } from '../../core/Logger.js';
import { updateAllStats } from '../../services/stats/statsService.js';

export default defineCommand({
  name: 'stats',
  description: 'Set up server stats voice channels.',
  defaultMemberPermissions: Perm.ManageGuild,
  options: [
    {
      type: 'channel',
      name: 'channel',
      description: 'Voice channel to rename',
      required: true,
      channelTypes: [ChannelType.GuildVoice],
    },
    {
      type: 'string',
      name: 'type',
      description: 'What stat to show',
      required: true,
      choices: [
        { name: 'Total Members', value: 'total' },
        { name: 'Online', value: 'online' },
        { name: 'Bots', value: 'bots' },
        { name: 'Humans', value: 'humans' },
      ],
    },
  ],
  execute: async (interaction) => {
    if (!interaction.guild) {
      await interaction.reply({ content: '❌ Server only.', ephemeral: true });
      return;
    }

    const channel = interaction.options.getChannel('channel', true);
    const type = interaction.options.getString('type', true);
    const updateKey = `statsChannel_${type}` as const;

    await Guild.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { [updateKey]: channel.id },
      { upsert: true },
    );

    const members = interaction.guild.members.cache;
    const labels: Record<string, string> = {
      total: `👥 Total: ${interaction.guild.memberCount}`,
      online: `🟢 Online: ${members.filter((m: any) => m.presence?.status === 'online').size}`,
      bots: `🤖 Bots: ${members.filter((m: any) => m.user.bot).size}`,
      humans: `👤 Humans: ${members.filter((m: any) => !m.user.bot).size}`,
    };

    await (channel as any).setName(labels[type]).catch(() => {});
    Logger.info(`Stats channel: ${type} → #${(channel as any).name}`);
    await interaction.reply({
      content: `✅ **${type}** stats set in ${channel}.`,
      ephemeral: true,
    });
  },
});
