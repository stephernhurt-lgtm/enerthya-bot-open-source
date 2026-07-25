import { Events } from 'discord.js';
import { Logger } from '@core/Logger';

export default {
  name: Events.Error,
  once: false,
  execute(error: Error) {
    Logger.error('Discord client error:', error.message);
  },
};

// ── Global process errors ──

process.on('unhandledRejection', (reason: unknown) => {
  Logger.error('Unhandled rejection:', reason instanceof Error ? reason.message : reason);
});

process.on('uncaughtException', (error: Error) => {
  Logger.error('Uncaught exception:', error.message);
  Logger.error(error.stack ?? 'No stack trace');
  process.exit(1);
});
