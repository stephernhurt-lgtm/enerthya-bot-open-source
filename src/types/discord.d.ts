import { Collection } from 'discord.js';
import type { BotCommand } from '../core/Client';

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, BotCommand>;
  }
}
