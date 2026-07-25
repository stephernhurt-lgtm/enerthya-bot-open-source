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

/* ===================================================================
   define.ts — Best of both worlds
   Use defineCommand() for Discord JSON-style, or cmd()/str()/usr()
   for quick chaining. All in one place.
   =================================================================== */

// ─── Option helpers (builder.ts style) ───

export function cmd(name: string, desc: string) {
  return new SlashCommandBuilder().setName(name).setDescription(desc);
}

export function sub(name: string, desc: string) {
  return new SlashCommandSubcommandBuilder().setName(name).setDescription(desc);
}

export function str(name: string, desc: string, required = true) {
  return new SlashCommandStringOption().setName(name).setDescription(desc).setRequired(required);
}

export function int(name: string, desc: string, required = true) {
  return new SlashCommandIntegerOption().setName(name).setDescription(desc).setRequired(required);
}

export function bool(name: string, desc: string, required = true) {
  return new SlashCommandBooleanOption().setName(name).setDescription(desc).setRequired(required);
}

export function usr(name: string, desc: string, required = true) {
  return new SlashCommandUserOption().setName(name).setDescription(desc).setRequired(required);
}

export function role(name: string, desc: string, required = true) {
  return new SlashCommandRoleOption().setName(name).setDescription(desc).setRequired(required);
}

export function ch(name: string, desc: string, required = true) {
  return new SlashCommandChannelOption().setName(name).setDescription(desc).setRequired(required);
}

// ─── Permission shorthands ───

export function modCmd(
  name: string,
  desc: string,
  perms: bigint = PermissionFlagsBits.ManageMessages,
) {
  return cmd(name, desc).setDefaultMemberPermissions(perms);
}

export function adminCmd(name: string, desc: string) {
  return cmd(name, desc).setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
}

// ─── Quick command factories ───

type SlashHandler = (interaction: ChatInputCommandInteraction) => Promise<void>;
type PrefixHandler = (message: any, args: string[]) => Promise<void>;

export function simple(name: string, desc: string, handler: SlashHandler) {
  return { data: cmd(name, desc), execute: handler };
}

export function modOnly(name: string, desc: string, handler: SlashHandler) {
  return { data: modCmd(name, desc), execute: handler };
}

export function dual(name: string, desc: string, handler: SlashHandler, legacy?: PrefixHandler) {
  return { data: cmd(name, desc), execute: handler, prefixExecute: legacy ?? handler };
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

  return { data: builder, execute: config.execute };
}
