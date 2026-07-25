import { Events } from 'discord.js';
import { Logger } from '../core/Logger.js';

export default {
  name: Events.GuildMemberRemove,
  once: false,
  async execute(member: any) {
    if (!member.guild) return;
    Logger.info(`Member left: ${member.user?.tag} from ${member.guild.name}`);
    try {
      const { updateAllStats } = await import('../commands/moderation/stats.js');
      await updateAllStats(member.guild);
    } catch {}
  },
};
