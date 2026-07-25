import { Events } from 'discord.js';
import { RoleMenu } from '../db/schemas/rolemenu.js';
import { Logger } from '../core/Logger.js';

export default {
  name: Events.MessageReactionAdd,
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
      const entry = menu?.roles.find((r: any) => r.emoji === reaction.emoji.name);
      if (!entry) return;
      const member = await reaction.message.guild.members.fetch(user.id);
      if (member) {
        await member.roles.add(entry.roleId);
        Logger.info(`Reaction role + ${entry.roleId} to ${user.tag}`);
      }
    } catch (error) {
      Logger.error('Reaction add:', error);
    }
  },
};
