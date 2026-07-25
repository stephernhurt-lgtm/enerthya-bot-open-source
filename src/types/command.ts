import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface TypedCommand {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  category?: string;
}

export function command(
  builder: SlashCommandBuilder,
  handler: (interaction: ChatInputCommandInteraction) => Promise<void>,
): TypedCommand {
  return {
    data: builder,
    execute: handler,
  };
}
