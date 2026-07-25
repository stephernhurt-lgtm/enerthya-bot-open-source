import { Guild } from '../db/schemas/guild.js';
import { Logger } from '../core/Logger.js';

export async function updateAllStats(guild: any): Promise<void> {
  try {
    const settings = await Guild.findOne({ guildId: guild.id });
    if (!settings) return;

    const members = await guild.members.fetch();
    const total = guild.memberCount;
    const bots = members.filter((m: any) => m.user.bot).size;
    const humans = total - bots;
    const online = members.filter((m: any) => m.presence?.status === 'online' && !m.user.bot).size;

    const statChannels = [
      { id: settings.statsChannel_total, value: `📊 Total: ${total}` },
      { id: settings.statsChannel_online, value: `🟢 Online: ${online}` },
      { id: settings.statsChannel_bots, value: `🤖 Bots: ${bots}` },
      { id: settings.statsChannel_humans, value: `👤 Humans: ${humans}` },
    ];

    for (const sc of statChannels) {
      if (!sc.id) continue;
      const channel = guild.channels.cache.get(sc.id);
      if (channel) await channel.setName(sc.value);
    }
  } catch (error) {
    Logger.error('Stats update error:', error);
  }
}
