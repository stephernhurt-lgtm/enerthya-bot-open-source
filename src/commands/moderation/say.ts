import { Perm } from '../../utils/permissions.js';
import { defineCommand } from '../../utils/define.js';
import { Logger } from '../../core/Logger.js';

export default defineCommand({
  name: 'say',
  description: 'Make the bot say something in a channel.',
  defaultMemberPermissions: Perm.ManageMessages,
  options: [
    {
      type: 'string',
      name: 'message',
      description: 'The message to send',
      required: true,
      max: 2000,
    },
    { type: 'channel', name: 'channel', description: 'Target channel', required: false },
  ],
  execute: async (interaction) => {
    const message = interaction.options.getString('message', true);
    const channelOpt = interaction.options.getChannel('channel');
    const channel = channelOpt ?? interaction.channel;

    if (!channel || !('send' in channel)) {
      await interaction.reply({ content: '❌ Invalid channel.', ephemeral: true });
      return;
    }

    Logger.info(`Say: "${message}"`);
    await (channel as any).send(message);
    await interaction.reply({ content: '✅ Message sent!', ephemeral: true });
  },
});
