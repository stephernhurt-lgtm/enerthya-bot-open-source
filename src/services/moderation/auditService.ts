import { EmbedBuilder, GuildTextBasedChannel } from 'discord.js';
import { Guild } from '../../db/schemas/guild.js';
import { Logger } from '../../core/Logger.js';

type AuditAction = 'ban' | 'kick' | 'clear' | 'config_update' | 'welcome_update';

const actionColors: Record<AuditAction, number> = {
  ban: 0xed4245,
  kick: 0xfee75c,
  clear: 0x5865f2,
  config_update: 0x57f287,
  welcome_update: 0x57f287,
};
const actionLabels: Record<AuditAction, string> = {
  ban: '🔨 Ban',
  kick: '👢 Kick',
  clear: '🧹 Clear Messages',
  config_update: '⚙️ Config Update',
  welcome_update: '👋 Welcome Update',
};

export function buildAuditEmbed(
  action: AuditAction,
  fields: { name: string; value: string; inline?: boolean }[],
  author?: { tag: string; iconURL?: string },
): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(actionColors[action])
    .setTitle(actionLabels[action])
    .addFields(fields.map((f) => ({ name: f.name, value: f.value, inline: f.inline ?? false })))
    .setTimestamp();
  if (author) embed.setAuthor({ name: author.tag, iconURL: author.iconURL });
  return embed;
}

export async function sendAudit(
  channel: GuildTextBasedChannel,
  action: AuditAction,
  fields: { name: string; value: string; inline?: boolean }[],
  author?: { tag: string; iconURL?: string },
): Promise<void> {
  try {
    await channel.send({ embeds: [buildAuditEmbed(action, fields, author)] });
  } catch (error) {
    Logger.error('Failed to send audit log:', error);
  }
}

export async function getAuditChannel(
  guildId: string,
  clientChannels: any,
): Promise<GuildTextBasedChannel | null> {
  try {
    const settings = await Guild.findOne({ guildId });
    if (!settings?.auditChannelId) return null;
    const channel = clientChannels.cache.get(settings.auditChannelId);
    if (!channel?.isTextBased()) return null;
    return channel as GuildTextBasedChannel;
  } catch {
    return null;
  }
}
