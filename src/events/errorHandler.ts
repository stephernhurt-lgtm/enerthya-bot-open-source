import { Events } from 'discord.js';
import { Logger } from '../core/Logger.js';

export default {
  name: Events.Error,
  once: false,
  execute(error: Error) {
    Logger.error('Client error:', error.message);
  },
};

process.on('unhandledRejection', (reason: unknown) => {
  Logger.error('Unhandled rejection:', reason instanceof Error ? reason.message : reason);
});
process.on('uncaughtException', (error: Error) => {
  Logger.error('Uncaught exception:', error.message);
  process.exit(1);
});
