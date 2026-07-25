import { Events } from 'discord.js';
import { RoleMenu } from '@db/schemas/rolemenu';
import { Logger } from '@core/Logger';

export default {
  name: Events.MessageReactionRemove,
  once: false,
  async execute(reaction: any, user: any) {
    if (user.bot) return;

    try {
      if (reaction.partial) await reaction.fetch();
      if (reaction.message.partial) await reaction.message.fetch();

      const menu = await RoleMenu.findOne({
        guildId: reaction.message.guildId,
        channelId: reaction.message.channelId,
        messageId: reaction.message.id,
      });

      if (!menu) return;

      const entry = menu.roles.find((r) => r.emoji === reaction.emoji.name);
      if (!entry) return;

      const member = await reaction.message.guild.members.fetch(user.id);
      if (!member) return;

      await member.roles.remove(entry.roleId);
      Logger.info(`Removed role ${entry.roleId} from ${user.tag} via reaction`);
    } catch (error) {
      Logger.error('Reaction role remove error:', error);
    }
  },
};
