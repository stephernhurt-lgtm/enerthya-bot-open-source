import { defineCommand, Perm } from '../../utils/builders/define.js';
import { Logger } from '../../core/Logger.js';

export default defineCommand({
  name: 'slowmode',
  description: 'Set slowmode in a channel.',
  defaultMemberPermissions: Perm.ManageChannels,
  options: [
    {
      type: 'integer',
      name: 'seconds',
      description: 'Slowmode in seconds (0 to disable)',
      required: true,
      min: 0,
      max: 21600,
    },
    { type: 'channel', name: 'channel', description: 'Target channel', required: false },
  ],
  execute: async (interaction) => {
    const seconds = interaction.options.getInteger('seconds', true);
    const channel = (interaction.options.getChannel('channel') ?? interaction.channel) as any;

    if (!channel?.isTextBased()) {
      await interaction.reply({ content: '❌ Invalid channel.', ephemeral: true });
      return;
    }

    await (channel as any).setRateLimitPerUser(seconds);
    Logger.info(`Slowmode set to ${seconds}s in #${(channel as any).name}`);
    await interaction.reply({
      content: `✅ Slowmode set to **${seconds}s** in ${channel}.`,
      ephemeral: true,
    });
  },
});
