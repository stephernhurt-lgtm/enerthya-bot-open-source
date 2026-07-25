import { EmbedBuilder } from 'discord.js';

export function baseEmbed(): EmbedBuilder {
  return new EmbedBuilder().setColor(0x2b2d31).setTimestamp();
}

export function successEmbed(title: string, desc?: string): EmbedBuilder {
  return baseEmbed()
    .setColor(0x57f287)
    .setTitle(title)
    .setDescription(desc ?? '');
}

export function errorEmbed(title: string, desc?: string): EmbedBuilder {
  return baseEmbed()
    .setColor(0xed4245)
    .setTitle(title)
    .setDescription(desc ?? '');
}
