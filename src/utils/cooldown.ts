import { Collection } from 'discord.js';

const cooldowns = new Collection<string, Collection<string, number>>();

/**
 * Check if a user is on cooldown for a specific command.
 * Returns `0` if not on cooldown, or the remaining seconds if on cooldown.
 */
export function getCooldown(
  userId: string,
  commandName: string,
  durationSeconds: number = 3,
): number {
  const now = Date.now();

  if (!cooldowns.has(commandName)) {
    cooldowns.set(commandName, new Collection());
  }

  const timers = cooldowns.get(commandName)!;

  if (timers.has(userId)) {
    const expiresAt = timers.get(userId)!;

    if (now < expiresAt) {
      return Math.ceil((expiresAt - now) / 1000);
    }

    timers.delete(userId);
  }

  timers.set(userId, now + durationSeconds * 1000);
  return 0;
}

/**
 * Clear all cooldowns (useful for testing or bot restart).
 */
export function clearCooldowns(): void {
  cooldowns.clear();
}
