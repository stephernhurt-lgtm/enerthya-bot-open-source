import { Logger } from '@core/Logger.js';
import { Guild } from './schemas/guild.js';

export function initSchema(): void {
  // Ensure all models are registered by referencing them
  Logger.info('Database models loaded');

  // Example: create indexes
  Guild.createIndexes().catch(() => {});
}
