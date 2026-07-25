import { EmbedBuilder } from 'discord.js';
import { Logger } from '../core/Logger';

export function createEmbed(): EmbedBuilder {
  return new EmbedBuilder().setColor(0x2b2d31);
}

export function replyError(interaction: any, message: string): Promise<any> {
  return interaction.reply({ content: `❌ ${message}`, ephemeral: true });
}

export function replySuccess(interaction: any, message: string): Promise<any> {
  return interaction.reply({ content: `✅ ${message}`, ephemeral: true });
}

export { Logger };
