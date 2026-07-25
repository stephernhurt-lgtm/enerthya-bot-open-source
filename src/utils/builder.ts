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
} from 'discord.js';
import { isOwner } from '../utils/owner.js';

/* ─── Option shortcuts ─── */

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

/* ─── Permission shorthands ─── */

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

/* ─── Quick factories ─── */

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

/* ─── Owner-only wrapper ─── */

export function ownerOnly(name: string, desc: string, handler: SlashHandler) {
  return {
    data: cmd(name, desc),
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

/* ─── Paginated command helper ─── */

export async function paginated(
  interaction: ChatInputCommandInteraction,
  title: string,
  items: { name: string; value: string; inline?: boolean }[],
  itemsPerPage = 5,
) {
  const { paginate } = await import('./pagination.js');
  await paginate(interaction, title, items, itemsPerPage);
}

/* ─── Autocomplete option helper ─── */

export function autocomplete(
  name: string,
  description: string,
  _choices?: { name: string; value: string }[],
) {
  // Returns a string option suitable for dynamic autocomplete.
  // The `choices` field on defineCommand already provides static choices,
  // this is for dynamic autocomplete (to be handled via an event).
  return { type: 'string' as const, name, description, required: true, autocomplete: true };
}
