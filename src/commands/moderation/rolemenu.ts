import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
} from 'discord.js';
import { RoleMenu } from '@db/schemas/rolemenu';
import { Logger } from '@core/Logger';

export const data = new SlashCommandBuilder()
  .setName('rolemenu')
  .setDescription('Manage reaction role menus.')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .addSubcommand((sub) =>
    sub
      .setName('create')
      .setDescription('Create a reaction role message.')
      .addStringOption((opt) =>
        opt.setName('title').setDescription('Embed title').setRequired(true).setMaxLength(100),
      )
      .addStringOption((opt) =>
        opt
          .setName('roles')
          .setDescription('Roles in format: 🎯:roleID | 📢:roleID')
          .setRequired(true)
          .setMaxLength(500),
      ),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  if (!interaction.guild) {
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
    if (!emoji || !roleId) {
      await interaction.reply({
        content: `❌ Invalid format: \`${pair}\`. Use \`🎯:roleID\``,
        ephemeral: true,
      });
      return;
    }

    const role = await interaction.guild.roles.fetch(roleId).catch(() => null);
    if (!role) {
      await interaction.reply({
        content: `❌ Role \`${roleId}\` not found in this server.`,
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

  if (!interaction.channel || !('send' in interaction.channel)) {
    await interaction.reply({
      content: '❌ Cannot send messages in this channel.',
      ephemeral: true,
    });
    return;
  }

  const message = await (interaction.channel as any).send({ embeds: [embed] });

  for (const r of roles) {
    await message.react(r.emoji);
  }

  await RoleMenu.create({
    guildId: interaction.guild.id,
    channelId: interaction.channel!.id,
    messageId: message.id,
    roles,
  });

  Logger.info(`RoleMenu created in ${interaction.guild.id}: ${title}`);

  await interaction.reply({
    content: `✅ Reaction role menu created! [Jump](${message.url})`,
    ephemeral: true,
  });
}
