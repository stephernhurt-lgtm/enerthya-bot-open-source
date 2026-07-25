import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ChannelType,
} from 'discord.js';
import { Logger } from '@core/Logger';

export const data = new SlashCommandBuilder()
  .setName('say')
  .setDescription('Make the bot say something in a channel.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addStringOption((option) =>
    option
      .setName('message')
      .setDescription('The message to send.')
      .setRequired(true)
      .setMaxLength(2000),
  )
  .addChannelOption((option) =>
    option
      .setName('channel')
      .setDescription('Target channel (defaults to current).')
      .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const message = interaction.options.getString('message', true);
  const channelOpt = interaction.options.getChannel('channel');
  const channel = channelOpt ?? interaction.channel;

  if (!channel || !('send' in channel) || typeof channel.send !== 'function') {
    await interaction.reply({ content: '❌ Invalid or non-text channel.', ephemeral: true });
    return;
  }

  const channelName = 'name' in channel ? (channel as any).name : 'unknown';
  Logger.info(`Say command: "${message}" in #${channelName}`);
  await (channel as any).send(message);
  await interaction.reply({ content: '✅ Message sent!', ephemeral: true });
}
