import { defineCommand, Perm } from '../../utils/builders/define.js';
import { Logger } from '../../core/Logger.js';

export default defineCommand({
  name: 'unlock',
  description: 'Unlock the current channel.',
  defaultMemberPermissions: Perm.ManageChannels,
  options: [
    { type: 'channel', name: 'channel', description: 'Channel to unlock', required: false },
  ],
  execute: async (interaction) => {
    const channel = (interaction.options.getChannel('channel') ?? interaction.channel) as any;
    await channel.permissionOverwrites.edit(interaction.guild!.roles.everyone, {
      SendMessages: null,
    });
    Logger.info(`Unlocked #${channel.name}`);
    await interaction.reply({ content: `🔓 ${channel} unlocked.`, ephemeral: true });
  },
});
