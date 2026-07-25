import { Guild } from '../../db/schemas/guild.js';

export async function getPrefix(guildId: string): Promise<string> {
  const settings = await Guild.findOne({ guildId });
  return settings?.prefix ?? '/';
}
