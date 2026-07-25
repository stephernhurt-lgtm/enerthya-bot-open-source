import { defineCommand } from '../../utils/define.js';

export default defineCommand({
  name: 'invite',
  description: 'Get bot invite link.',
  execute: async (interaction) => {
    const id = interaction.client.user?.id;
    await interaction.reply(
      `🔗 https://discord.com/oauth2/authorize?client_id=${id}&permissions=8&scope=bot%20applications.commands`,
    );
  },
});
