import { Events } from 'discord.js';
import { Logger } from '../core/Logger.js';
import { reportError } from '../utils/system/errorReporter.js';

export default {
  name: Events.Error,
  once: false,
  execute(error: Error) {
    Logger.error('Client error:', error.message);
    reportError('Client Error', error);
  },
};

process.on('unhandledRejection', (reason: unknown) => {
  const error = reason instanceof Error ? reason : new Error(String(reason));
  Logger.error('Unhandled rejection:', error.message);
  reportError('Unhandled Rejection', error);
});

process.on('uncaughtException', (error: Error) => {
  Logger.error('Uncaught exception:', error.message);
  reportError('Uncaught Exception', error);
  process.exit(1);
});
