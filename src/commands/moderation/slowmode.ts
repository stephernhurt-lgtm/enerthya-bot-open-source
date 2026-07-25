import { Perm } from '../../utils/permissions.js';
import { defineCommand } from '../../utils/define.js';
import { Logger } from '../../core/Logger.js';

export default defineCommand({
  name: 'slowmode',
  description: 'Set slowmode in a channel.',
  defaultMemberPermissions: Perm.ManageChannels,
  options: [
    { type: 'channel', name: 'channel', description: 'Target channel', required: false },
    {
      type: 'integer',
      name: 'seconds',
      description: 'Slowmode in seconds (0 to disable)',
      required: true,
      min: 0,
      max: 21600,
    },
  ],
  execute: async (interaction) => {
    const channel = interaction.options.getChannel('channel') ?? interaction.channel;
    const seconds = interaction.options.getInteger('seconds', true);

    if (!channel || !('isTextBased' in channel) || !(channel as any).isTextBased?.()) {
      await interaction.reply({ content: '❌ Not a text channel.', ephemeral: true });
      return;
    }

    await (channel as any).setRateLimitPerUser(seconds);
    const label = seconds === 0 ? 'disabled' : `${seconds}s`;
    Logger.info(`Slowmode ${label} in #${(channel as any).name}`);
    await interaction.reply({ content: `✅ Slowmode set to **${label}**.` });
  },
});
