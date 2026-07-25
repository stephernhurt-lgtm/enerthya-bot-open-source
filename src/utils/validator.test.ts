import { describe, it, expect, vi } from 'vitest';

vi.mock('@config/index', () => ({
  config: {
    token: 'TEST_DISCORD_TOKEN_1234567890abcdef1234567890abcdef1234567890abc',
    clientId: '123456789012345678',
    guildId: null,
    mongoUri: 'mongodb://localhost:27017/bot',
  },
}));

describe('validateCredentials', () => {
  it('exports a function', async () => {
    const { validateCredentials } = await import('./validator');
    expect(typeof validateCredentials).toBe('function');
  });

  it('returns valid: true with good credentials', async () => {
    const { validateCredentials } = await import('./validator');
    const result = validateCredentials();
    expect(result.valid).toBe(true);
  });

  it('returns 4 check results', async () => {
    const { validateCredentials } = await import('./validator');
    const result = validateCredentials();
    expect(result.checks).toHaveLength(4);
  });

  it('each check has name and passed fields', async () => {
    const { validateCredentials } = await import('./validator');
    const result = validateCredentials();
    for (const check of result.checks) {
      expect(typeof check.name).toBe('string');
      expect(typeof check.passed).toBe('boolean');
    }
  });
});
