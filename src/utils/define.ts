import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandStringOption,
  SlashCommandIntegerOption,
  SlashCommandBooleanOption,
  SlashCommandUserOption,
  SlashCommandChannelOption,
  SlashCommandRoleOption,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ChannelType,
} from 'discord.js';
import { isOwner } from './owner.js';

/* ===================================================================
   define.ts — defineCommand + helpers
   =================================================================== */

// ─── Quick factories ───

type SlashHandler = (interaction: ChatInputCommandInteraction) => Promise<void>;
type PrefixHandler = (message: any, args: string[]) => Promise<void>;

export function simple(name: string, desc: string, handler: SlashHandler) {
  return { data: new SlashCommandBuilder().setName(name).setDescription(desc), execute: handler };
}
export function dual(name: string, desc: string, handler: SlashHandler, legacy?: PrefixHandler) {
  return {
    data: new SlashCommandBuilder().setName(name).setDescription(desc),
    execute: handler,
    prefixExecute: legacy ?? handler,
  };
}
export function modOnly(name: string, desc: string, perms: bigint, handler: SlashHandler) {
  return {
    data: new SlashCommandBuilder()
      .setName(name)
      .setDescription(desc)
      .setDefaultMemberPermissions(perms),
    execute: handler,
  };
}

// ─── Owner-only wrapper ───

export function ownerOnly(name: string, desc: string, handler: SlashHandler) {
  return {
    data: new SlashCommandBuilder().setName(name).setDescription(desc),
    execute: async (interaction: any) => {
      if (!isOwner(interaction.user.id)) {
        await interaction.reply({
          content: '❌ Only the bot owner can use this.',
          ephemeral: true,
        });
        return;
      }
      await handler(interaction);
    },
  };
}

// ─── Paginated helper ───

export async function paginated(
  interaction: ChatInputCommandInteraction,
  title: string,
  items: { name: string; value: string; inline?: boolean }[],
  itemsPerPage = 5,
) {
  const { paginate } = await import('./pagination.js');
  await paginate(interaction, title, items, itemsPerPage);
}

// ─── defineCommand — Discord JSON-style config ───

type OptionType = 'string' | 'integer' | 'boolean' | 'user' | 'channel' | 'role';

interface OptionConfig {
  type: OptionType;
  name: string;
  description: string;
  required?: boolean;
  min?: number;
  max?: number;
  choices?: { name: string; value: string }[];
  channelTypes?: ChannelType[];
}
interface SubConfig {
  name: string;
  description: string;
  options?: OptionConfig[];
}

export interface CommandConfig {
  name: string;
  description: string;
  defaultMemberPermissions?: bigint;
  dmPermission?: boolean;
  ownerOnly?: boolean;
  options?: OptionConfig[];
  subcommands?: SubConfig[];
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
type CommandResult = { data: SlashCommandBuilder; execute: (interaction: any) => Promise<void> };

function addOption(
  builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
  opt: OptionConfig,
) {
  const { type, name, description, required, min, max, choices, channelTypes } = opt;
  const req = required ?? false;

  switch (type) {
    case 'string': {
      const o = new SlashCommandStringOption()
        .setName(name)
        .setDescription(description)
        .setRequired(req);
      if (min !== undefined) o.setMinLength(min);
      if (max !== undefined) o.setMaxLength(max);
      if (choices) o.addChoices(...choices.map((c) => ({ name: c.name, value: String(c.value) })));
      builder.addStringOption(o);
      break;
    }
    case 'integer': {
      const o = new SlashCommandIntegerOption()
        .setName(name)
        .setDescription(description)
        .setRequired(req);
      if (min !== undefined) o.setMinValue(min);
      if (max !== undefined) o.setMaxValue(max);
      if (choices) o.addChoices(...choices.map((c) => ({ name: c.name, value: Number(c.value) })));
      builder.addIntegerOption(o);
      break;
    }
    case 'boolean':
      builder.addBooleanOption(
        new SlashCommandBooleanOption().setName(name).setDescription(description).setRequired(req),
      );
      break;
    case 'user':
      builder.addUserOption(
        new SlashCommandUserOption().setName(name).setDescription(description).setRequired(req),
      );
      break;
    case 'channel': {
      const o = new SlashCommandChannelOption()
        .setName(name)
        .setDescription(description)
        .setRequired(req);
      if (channelTypes) (o as any).addChannelTypes(...channelTypes);
      builder.addChannelOption(o);
      break;
    }
    case 'role':
      builder.addRoleOption(
        new SlashCommandRoleOption().setName(name).setDescription(description).setRequired(req),
      );
      break;
  }
}

export function defineCommand(config: CommandConfig): CommandResult {
  const builder = new SlashCommandBuilder().setName(config.name).setDescription(config.description);
  if (config.defaultMemberPermissions)
    builder.setDefaultMemberPermissions(config.defaultMemberPermissions);
  if (config.dmPermission !== undefined) builder.setDMPermission(config.dmPermission);

  const originalExecute = config.execute;
  const execute = config.ownerOnly
    ? async (interaction: any) => {
        if (!isOwner(interaction.user.id)) {
          await interaction.reply({
            content: '❌ Only the bot owner can use this.',
            ephemeral: true,
          });
          return;
        }
        await originalExecute(interaction);
      }
    : originalExecute;

  if (config.subcommands) {
    for (const sub of config.subcommands) {
      const subBuilder = new SlashCommandSubcommandBuilder()
        .setName(sub.name)
        .setDescription(sub.description);
      if (sub.options) for (const opt of sub.options) addOption(subBuilder, opt);
      builder.addSubcommand(subBuilder);
    }
  }
  if (config.options) for (const opt of config.options) addOption(builder, opt);

  return { data: builder, execute };
}
