import { Events, EmbedBuilder } from 'discord.js';
import { Guild } from '@db/schemas/guild';
import { Logger } from '@core/Logger';
import type { BotClient } from '@core/Client';
import { updateAllStats } from '@commands/moderation/stats';

export default {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member: any) {
    if (!member.guild) return;

    try {
      const settings = await Guild.findOne({ guildId: member.guild.id });

      const channelId = settings?.welcomeChannelId;
      if (!channelId) return;

      const channel = member.guild.channels.cache.get(channelId);
      if (!channel?.isTextBased()) return;

      let message = settings?.welcomeMessage ?? 'Welcome {user} to {guild}!';
      message = message
        .replace(/{user}/g, `<@${member.id}>`)
        .replace(/{guild}/g, member.guild.name)
        .replace(/{count}/g, member.guild.memberCount);

      const embed = new EmbedBuilder()
        .setColor(0x2b2d31)
        .setTitle('👋 Welcome!')
        .setDescription(message)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp();

      await channel.send({ embeds: [embed] });
      Logger.info(`Welcome message sent to ${member.user.tag} in ${member.guild.name}`);
    } catch (error) {
      Logger.error(`Welcome error for ${member.user?.tag}:`, error);
    }

    try {
      await updateAllStats(member.guild);
    } catch {
      /* stats update is best-effort */
    }
  },
};
