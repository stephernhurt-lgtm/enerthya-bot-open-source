import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { Logger } from '@core/Logger';

export const data = new SlashCommandBuilder()
  .setName('slowmode')
  .setDescription('Set slowmode in a channel.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
  .addIntegerOption((opt) =>
    opt
      .setName('seconds')
      .setDescription('Slowmode in seconds (0 to disable)')
      .setRequired(true)
      .setMinValue(0)
      .setMaxValue(21600),
  )
  .addChannelOption((opt) =>
    opt.setName('channel').setDescription('Target channel (defaults to current)'),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const seconds = interaction.options.getInteger('seconds', true);
  const channel = (interaction.options.getChannel('channel') ?? interaction.channel) as any;

  if (!channel?.isTextBased?.()) {
    await interaction.reply({ content: '❌ Not a text channel.', ephemeral: true });
    return;
  }

  await channel.setRateLimitPerUser(seconds);
  Logger.info(`Slowmode set to ${seconds}s in #${channel.name}`);

  const label = seconds === 0 ? 'disabled' : `${seconds} second(s)`;
  await interaction.reply({
    content: `✅ Slowmode set to **${label}** in ${channel}.`,
  });
}
