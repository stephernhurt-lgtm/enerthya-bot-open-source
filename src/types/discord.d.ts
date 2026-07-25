import { Collection } from 'discord.js';
import type { BotCommand } from '../core/Client.js';

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, BotCommand>;
  }
}
