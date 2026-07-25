import { EmbedBuilder } from 'discord.js';
import type { AuditAction } from './auditTypes.js';
import { auditColors, auditLabels } from './auditTypes.js';

export function buildAuditEmbed(
  action: AuditAction,
  fields: { name: string; value: string; inline?: boolean }[],
  author?: { tag: string; iconURL?: string },
): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(auditColors[action])
    .setTitle(auditLabels[action])
    .addFields(fields.map((f) => ({ name: f.name, value: f.value, inline: f.inline ?? false })))
    .setTimestamp();
  if (author) embed.setAuthor({ name: author.tag, iconURL: author.iconURL });
  return embed;
}
