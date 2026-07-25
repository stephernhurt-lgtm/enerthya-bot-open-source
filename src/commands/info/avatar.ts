import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('avatar')
  .setDescription("Display a user's avatar.")
  .addUserOption((opt) => opt.setName('target').setDescription('The user'));

export async function execute(interaction: ChatInputCommandInteraction) {
  const target = interaction.options.getUser('target') ?? interaction.user;

  const embed = new EmbedBuilder()
    .setColor(0x2b2d31)
    .setTitle(`${target.tag}'s Avatar`)
    .setImage(target.displayAvatarURL({ size: 1024 }))
    .setURL(target.displayAvatarURL())
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
