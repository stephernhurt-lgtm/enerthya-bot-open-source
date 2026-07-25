import { GuildTextBasedChannel } from 'discord.js';
import { Guild } from '../../db/schemas/guild.js';
import { Logger } from '../../core/Logger.js';
import { buildAuditEmbed } from './auditEmbed.js';
import type { AuditAction } from './auditTypes.js';

export type { AuditAction };
export { buildAuditEmbed } from './auditEmbed.js';

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
