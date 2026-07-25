import { config } from '../../config/index.js';

export function isOwner(userId: string): boolean {
  return config.ownerId ? userId === config.ownerId : false;
}

export function ownerOnly(userId: string): asserts userId is string {
  if (!isOwner(userId)) {
    throw new Error('This command is restricted to the bot owner.');
  }
}
