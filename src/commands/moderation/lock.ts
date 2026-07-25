import { defineCommand, Perm } from '../../utils/builders/define.js';
import { Logger } from '../../core/Logger.js';

export default defineCommand({
  name: 'lock',
  description: 'Lock the current channel.',
  defaultMemberPermissions: Perm.ManageChannels,
  options: [{ type: 'channel', name: 'channel', description: 'Channel to lock', required: false }],
  execute: async (interaction) => {
    const channel = (interaction.options.getChannel('channel') ?? interaction.channel) as any;
    await channel.permissionOverwrites.edit(interaction.guild!.roles.everyone, {
      SendMessages: false,
    });
    Logger.info(`Locked #${channel.name}`);
    await interaction.reply({ content: `🔒 ${channel} locked.`, ephemeral: true });
  },
});
