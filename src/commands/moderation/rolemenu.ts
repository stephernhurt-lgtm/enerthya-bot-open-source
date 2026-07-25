import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { defineCommand } from '../../utils/define.js';
import { RoleMenu } from '../../db/schemas/rolemenu.js';
import { Logger } from '../../core/Logger.js';

export default defineCommand({
  name: 'rolemenu',
  description: 'Create a reaction role message.',
  defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
  options: [
    { type: 'string', name: 'title', description: 'Embed title', required: true, max: 100 },
    {
      type: 'string',
      name: 'roles',
      description: 'Format: 🎯:roleID | 📢:roleID',
      required: true,
      max: 500,
    },
  ],
  execute: async (interaction) => {
    if (!interaction.guild?.members) {
      await interaction.reply({ content: '❌ Server only.', ephemeral: true });
      return;
    }

    const title = interaction.options.getString('title', true);
    const rolesRaw = interaction.options.getString('roles', true);
    const pairs = rolesRaw
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean);
    const roles: { emoji: string; roleId: string }[] = [];

    for (const pair of pairs) {
      const [emoji, roleId] = pair.split(':').map((s) => s.trim());
      const role = await interaction.guild.roles.fetch(roleId).catch(() => null);
      if (!role || !emoji) {
        await interaction.reply({
          content: `❌ Invalid: \`${pair}\`. Use \`🎯:roleID\``,
          ephemeral: true,
        });
        return;
      }
      roles.push({ emoji, roleId });
    }

    const embed = new EmbedBuilder()
      .setColor(0x2b2d31)
      .setTitle(title)
      .setDescription('React to get the corresponding role:')
      .addFields(
        roles.map((r) => ({
          name: `${r.emoji} <@&${r.roleId}>`,
          value: `React with ${r.emoji}`,
          inline: true,
        })),
      )
      .setFooter({ text: 'Reaction roles' })
      .setTimestamp();

    const message = await (interaction.channel as any).send({ embeds: [embed] });
    for (const r of roles) await message.react(r.emoji);

    await RoleMenu.create({
      guildId: interaction.guild.id,
      channelId: interaction.channel!.id,
      messageId: message.id,
      roles,
    });
    Logger.info(`RoleMenu created: ${title}`);
    await interaction.reply({
      content: `✅ Reaction role created! [Jump](${message.url})`,
      ephemeral: true,
    });
  },
});
