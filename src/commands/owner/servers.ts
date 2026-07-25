import { defineCommand } from '../../utils/define.js';

export default defineCommand({
  name: 'servers',
  description: 'List all servers the bot is in.',
  ownerOnly: true,
  paginate: { title: '📋 Servers', itemsPerPage: 5 },
  execute: async (interaction) => {
    const client = interaction.client as any;
    return client.guilds.cache.map((g: any) => ({
      name: g.name,
      value: `${g.memberCount} members (${g.id})`,
    }));
  },
});
