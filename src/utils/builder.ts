import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandStringOption,
  SlashCommandIntegerOption,
  SlashCommandBooleanOption,
  SlashCommandUserOption,
  SlashCommandRoleOption,
  SlashCommandChannelOption,
  PermissionFlagsBits,
  PermissionResolvable,
  ChatInputCommandInteraction,
} from 'discord.js';

/* ─── Shortcuts ─── */

export function cmd(name: string, description: string) {
  return new SlashCommandBuilder().setName(name).setDescription(description);
}

export function sub(name: string, description: string) {
  return new SlashCommandSubcommandBuilder().setName(name).setDescription(description);
}

/* ─── Permissions shorthand ─── */

export function modCmd(
  name: string,
  description: string,
  perms: bigint = PermissionFlagsBits.ManageMessages,
) {
  return cmd(name, description).setDefaultMemberPermissions(perms);
}

export function adminCmd(name: string, description: string) {
  return cmd(name, description).setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
}

/* ─── Options ─── */

export function str(name: string, description: string, required = true) {
  return new SlashCommandStringOption()
    .setName(name)
    .setDescription(description)
    .setRequired(required);
}

export function int(name: string, description: string, required = true) {
  return new SlashCommandIntegerOption()
    .setName(name)
    .setDescription(description)
    .setRequired(required);
}

export function bool(name: string, description: string, required = true) {
  return new SlashCommandBooleanOption()
    .setName(name)
    .setDescription(description)
    .setRequired(required);
}

export function usr(name: string, description: string, required = true) {
  return new SlashCommandUserOption()
    .setName(name)
    .setDescription(description)
    .setRequired(required);
}

export function role(name: string, description: string, required = true) {
  return new SlashCommandRoleOption()
    .setName(name)
    .setDescription(description)
    .setRequired(required);
}

export function ch(name: string, description: string, required = true) {
  return new SlashCommandChannelOption()
    .setName(name)
    .setDescription(description)
    .setRequired(required);
}

/* ─── Simple command factory ─── */

type SimpleHandler = (interaction: ChatInputCommandInteraction) => Promise<void>;
type LegacyHandler = (message: any, args: string[]) => Promise<void>;

export function simple(name: string, description: string, handler: SimpleHandler) {
  return {
    data: cmd(name, description),
    execute: handler,
  };
}

export function modOnly(name: string, description: string, handler: SimpleHandler) {
  return {
    data: modCmd(name, description),
    execute: handler,
  };
}

/** Command that works with both /slash and prefix (!) */
export function dual(
  name: string,
  description: string,
  handler: SimpleHandler,
  legacy?: LegacyHandler,
) {
  return {
    data: cmd(name, description),
    execute: handler,
    prefixExecute: legacy ?? handler,
  };
}
