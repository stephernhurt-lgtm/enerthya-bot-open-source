import { describe, it, expect } from 'vitest';
import { getCooldown, clearCooldowns } from './cooldown';

describe('getCooldown', () => {
  const userId = '123456789';
  const cmd = 'ping';

  it('returns 0 on first call (no cooldown)', () => {
    clearCooldowns();
    expect(getCooldown(userId, cmd, 10)).toBe(0);
  });

  it('returns remaining seconds if called again within duration', () => {
    clearCooldowns();
    getCooldown(userId, cmd, 10);
    const remaining = getCooldown(userId, cmd, 10);
    expect(remaining).toBeGreaterThan(0);
    expect(remaining).toBeLessThanOrEqual(10);
  });

  it('returns 0 for different users', () => {
    clearCooldowns();
    getCooldown('user1', cmd, 30);
    expect(getCooldown('user2', cmd, 30)).toBe(0);
  });

  it('returns 0 for different commands', () => {
    clearCooldowns();
    getCooldown(userId, 'ban', 10);
    expect(getCooldown(userId, 'kick', 10)).toBe(0);
  });

  it('returns 0 after cooldown expires', async () => {
    clearCooldowns();
    getCooldown(userId, cmd, 0);
    expect(getCooldown(userId, cmd, 0)).toBe(0);
  });
});

describe('clearCooldowns', () => {
  it('clears all cooldowns', () => {
    getCooldown('user1', 'cmd1', 60);
    getCooldown('user2', 'cmd2', 60);
    clearCooldowns();
    expect(getCooldown('user1', 'cmd1', 60)).toBe(0);
    expect(getCooldown('user2', 'cmd2', 60)).toBe(0);
  });
});
