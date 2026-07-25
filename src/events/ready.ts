import { Events } from 'discord.js';
import { Giveaway } from '../db/schemas/giveaway.js';
import { Logger } from '../core/Logger.js';
import type { BotClient } from '../core/Client.js';
import { endGiveaway } from '../commands/admin/giveaway.js';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: BotClient) {
    Logger.section('CLIENT READY');
    Logger.info(`Tag:        ${client.user?.tag}`);
    Logger.info(`ID:         ${client.user?.id}`);
    Logger.info(`Guilds:     ${client.guilds.cache.size}`);
    Logger.info(`Commands:   ${client.commands.size}`);
    Logger.green('Bot is online and ready!');
    if (client.user) {
      const activities = ['/help', 'discord.js v14', 'Enerthya Bot'];
      let i = 0;
      setInterval(() => {
        client.user?.setActivity(activities[i % activities.length]);
        i++;
      }, 30_000);
    }
    async function checkGiveaways() {
      try {
        const expired = await Giveaway.find({ ended: false, endsAt: { $lte: new Date() } });
        for (const g of expired) await endGiveaway(g, client);
      } catch (error) {
        Logger.error('Giveaway check:', error);
      }
    }
    checkGiveaways();
    setInterval(checkGiveaways, 30_000);
  },
};
