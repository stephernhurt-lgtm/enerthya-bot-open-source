import { Events } from 'discord.js';
import { Logger } from '@core/Logger';
import type { BotClient } from '@core/Client';

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
      const activities = ['/help', 'open-source', 'discord.js v14'];
      let i = 0;
      setInterval(() => {
        client.user?.setActivity(activities[i % activities.length]);
        i++;
      }, 30_000);
    }
  },
};
