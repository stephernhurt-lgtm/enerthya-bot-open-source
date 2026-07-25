import { Events } from 'discord.js';
import { Logger } from '@core/Logger';
import { updateAllStats } from '@commands/moderation/stats';

export default {
  name: Events.GuildMemberRemove,
  once: false,
  async execute(member: any) {
    if (!member.guild) return;

    Logger.info(`Member left: ${member.user?.tag} from ${member.guild.name}`);

    try {
      await updateAllStats(member.guild);
    } catch {
      /* stats update is best-effort */
    }
  },
};
