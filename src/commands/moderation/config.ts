import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} from 'discord.js';
import { Guild } from '@db/schemas/guild';
import { Logger } from '@core/Logger';

const validSettings: string[] = ['prefix', 'language', 'welcome_message'];

export const data = new SlashCommandBuilder()
  .setName('config')
  .setDescription('View or update guild settings.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addSubcommand((sub) => sub.setName('view').setDescription('Show current guild settings.'))
  .addSubcommand((sub) =>
    sub
      .setName('set')
      .setDescription('Update a guild setting.')
      .addStringOption((opt) =>
        opt
          .setName('key')
          .setDescription('Setting to update')
          .setRequired(true)
          .addChoices(
            { name: 'prefix', value: 'prefix' },
            { name: 'language', value: 'language' },
            { name: 'welcome_message', value: 'welcome_message' },
          ),
      )
      .addStringOption((opt) =>
        opt.setName('value').setDescription('New value').setRequired(true).setMaxLength(500),
      ),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
    await interaction.reply({
      content: '❌ This command can only be used in a server.',
      ephemeral: true,
    });
    return;
  }

  const sub = interaction.options.getSubcommand();

  if (sub === 'view') {
    let settings = await Guild.findOne({ guildId: interaction.guild.id });

    if (!settings) {
      settings = await Guild.create({ guildId: interaction.guild.id });
    }

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle('⚙️ Guild Settings')
      .addFields(
        { name: 'Prefix', value: `\`${settings.prefix}\``, inline: true },
        { name: 'Language', value: settings.language, inline: true },
        { name: 'Welcome Message', value: settings.welcomeMessage ?? 'Not set' },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
    return;
  }

  if (sub === 'set') {
    const key = interaction.options.getString('key', true);
    const value = interaction.options.getString('value', true);

    if (!validSettings.includes(key)) {
      await interaction.reply({ content: '❌ Invalid setting key.', ephemeral: true });
      return;
    }

    await Guild.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { [key]: value },
      { upsert: true },
    );

    Logger.info(`Guild ${interaction.guild.id}: ${key} = "${value}"`);

    await interaction.reply({
      content: `✅ **${key}** updated successfully.`,
      ephemeral: true,
    });
  }
}
