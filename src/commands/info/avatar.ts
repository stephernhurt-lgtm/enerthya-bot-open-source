import { EmbedBuilder } from 'discord.js';
import { defineCommand } from '../../utils/builders/define.js';

export default defineCommand({
  name: 'avatar',
  description: "Display a user's avatar.",
  options: [{ type: 'user', name: 'target', description: 'The user', required: false }],
  execute: async (interaction) => {
    const target = interaction.options.getUser('target') ?? interaction.user;

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle(`${target.tag}'s Avatar`)
      .setImage(target.displayAvatarURL({ size: 1024 }))
      .setURL(target.displayAvatarURL())
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
});
