import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { Logger } from './Logger.js';

export interface BotCommand {
  data: unknown;
  execute: (interaction: any) => Promise<void>;
  category?: string;
  prefixExecute?: (message: any, args: string[]) => Promise<void>;
}

export class BotClient extends Client {
  commands: Collection<string, BotCommand> = new Collection();

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences,
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    });
  }

  async start(token: string): Promise<void> {
    try {
      await this.login(token);
      Logger.green(`Logged in as ${this.user?.tag ?? 'Unknown'}`);
    } catch (err) {
      Logger.error('Failed to start client:', err);
      process.exit(1);
    }
  }
}
