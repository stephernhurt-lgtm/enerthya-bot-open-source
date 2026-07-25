import { Events, EmbedBuilder } from 'discord.js';
import { Guild } from '../db/schemas/guild.js';
import { Logger } from '../core/Logger.js';

export default {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member: any) {
    if (!member.guild) return;
    try {
      const settings = await Guild.findOne({ guildId: member.guild.id });

      // Welcome message
      if (settings?.welcomeChannelId) {
        const channel = member.guild.channels.cache.get(settings.welcomeChannelId);
        if (channel?.isTextBased()) {
          let msg = (settings.welcomeMessage ?? 'Welcome {user} to {guild}!')
            .replace(/{user}/g, `<@${member.id}>`)
            .replace(/{guild}/g, member.guild.name)
            .replace(/{count}/g, member.guild.memberCount);
          await channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(0x2b2d31)
                .setTitle('👋 Welcome!')
                .setDescription(msg)
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp(),
            ],
          });
        }
      }

      // Auto-role
      if (settings?.autoRoleId) {
        const role = member.guild.roles.cache.get(settings.autoRoleId);
        if (role) {
          await member.roles.add(role);
          Logger.info(`Autorole: ${role.name} to ${member.user.tag}`);
        }
      }

      // Stats update
      const { updateAllStats } = await import('../services/statsService.js');
      await updateAllStats(member.guild).catch(() => {});
    } catch (e) {
      Logger.error('GuildMemberAdd:', e);
    }
  },
};
