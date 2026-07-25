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
  ChannelType,
} from 'discord.js';

/* ─── Types ─── */

type OptionTypeName = 'string' | 'integer' | 'boolean' | 'user' | 'channel' | 'role';

interface OptionConfig {
  type: OptionTypeName;
  name: string;
  description: string;
  required?: boolean;
  min?: number;
  max?: number;
  choices?: { name: string; value: string }[];
  channelTypes?: ChannelType[];
}

interface SubCommandConfig {
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
  subcommands?: SubCommandConfig[];
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export type CommandResult = {
  data: SlashCommandBuilder;
  execute: (interaction: any) => Promise<void>;
};

/* ─── Option builder ─── */

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
    case 'boolean': {
      builder.addBooleanOption(
        new SlashCommandBooleanOption().setName(name).setDescription(description).setRequired(req),
      );
      break;
    }
    case 'user': {
      builder.addUserOption(
        new SlashCommandUserOption().setName(name).setDescription(description).setRequired(req),
      );
      break;
    }
    case 'channel': {
      const o = new SlashCommandChannelOption()
        .setName(name)
        .setDescription(description)
        .setRequired(req);
      if (channelTypes) (o as any).addChannelTypes(...channelTypes);
      builder.addChannelOption(o);
      break;
    }
    case 'role': {
      builder.addRoleOption(
        new SlashCommandRoleOption().setName(name).setDescription(description).setRequired(req),
      );
      break;
    }
  }
}

/* ─── defineCommand ─── */

export function defineCommand(config: CommandConfig): CommandResult {
  const builder = new SlashCommandBuilder().setName(config.name).setDescription(config.description);

  if (config.defaultMemberPermissions) {
    builder.setDefaultMemberPermissions(config.defaultMemberPermissions);
  }

  if (config.dmPermission !== undefined) {
    builder.setDMPermission(config.dmPermission);
  }

  if (config.subcommands) {
    for (const sub of config.subcommands) {
      const subBuilder = new SlashCommandSubcommandBuilder()
        .setName(sub.name)
        .setDescription(sub.description);
      if (sub.options) {
        for (const opt of sub.options) addOption(subBuilder, opt);
      }
      builder.addSubcommand(subBuilder);
    }
  }

  if (config.options) {
    for (const opt of config.options) addOption(builder, opt);
  }

  return { data: builder, execute: config.execute };
}
