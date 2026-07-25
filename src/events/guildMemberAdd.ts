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
      if (settings?.welcomeChannelId) {
        const channel = member.guild.channels.cache.get(settings.welcomeChannelId);
        if (channel?.isTextBased()) {
          let msg = (settings.welcomeMessage ?? 'Welcome {user} to {guild}!')
            .replace(/{user}/g, `<@${member.id}>`)
            .replace(/{guild}/g, member.guild.name)
            .replace(/{count}/g, member.guild.memberCount);
          const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle('👋 Welcome!')
            .setDescription(msg)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();
          await channel.send({ embeds: [embed] });
          Logger.info(`Welcome: ${member.user.tag}`);
        }
      }
    } catch (e) {
      Logger.error('Welcome:', e);
    }
    try {
      const s = await Guild.findOne({ guildId: member.guild.id });
      if (s?.autoRoleId) {
        const r = member.guild.roles.cache.get(s.autoRoleId);
        if (r) {
          await member.roles.add(r);
          Logger.info(`Autorole: ${r.name} to ${member.user.tag}`);
        }
      }
    } catch {}
    try {
      const { updateAllStats } = await import('../commands/moderation/stats.js');
      await updateAllStats(member.guild);
    } catch {}
  },
};
