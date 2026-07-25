import { Logger } from '@core/Logger';
import { Guild } from './schemas/guild';

export function initSchema(): void {
  // Ensure all models are registered by referencing them
  Logger.info('Database models loaded');

  // Example: create indexes
  Guild.createIndexes().catch(() => {});
}
