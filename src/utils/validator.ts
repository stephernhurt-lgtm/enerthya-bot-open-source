import { Logger } from '@core/Logger';
import { config } from '@config/index';

export interface ValidationResult {
  valid: boolean;
  checks: CheckResult[];
}

interface CheckResult {
  name: string;
  passed: boolean;
  value?: string;
  hint?: string;
}

export function validateCredentials(): ValidationResult {
  const checks: CheckResult[] = [];
  let allPassed = true;

  Logger.section('VALIDATING CREDENTIALS');

  // ── DISCORD_TOKEN ──
  const token = config.token;
  if (!token) {
    checks.push({ name: 'DISCORD_TOKEN', passed: false, hint: 'Required — get it from https://discord.com/developers/applications' });
    allPassed = false;
  } else if (token.length < 60) {
    checks.push({ name: 'DISCORD_TOKEN', passed: false, value: token.slice(0, 10) + '...', hint: 'Looks too short for a valid bot token' });
    allPassed = false;
  } else {
    checks.push({ name: 'DISCORD_TOKEN', passed: true, value: token.slice(0, 10) + '...' });
  }

  // ── CLIENT_ID ──
  const clientId = config.clientId;
  if (!clientId) {
    checks.push({ name: 'CLIENT_ID', passed: false, hint: 'Required — get it from Discord Developer Portal → OAuth2' });
    allPassed = false;
  } else if (!/^\d{17,20}$/.test(clientId)) {
    checks.push({ name: 'CLIENT_ID', passed: false, value: clientId, hint: 'Should be a 17–20 digit numeric snowflake' });
    allPassed = false;
  } else {
    checks.push({ name: 'CLIENT_ID', passed: true, value: clientId });
  }

  // ── MONGO_URI ──
  const mongoUri = config.mongoUri;
  if (!mongoUri) {
    checks.push({ name: 'MONGO_URI', passed: false, hint: 'Required — use mongodb://localhost:27017/bot or MongoDB Atlas' });
    allPassed = false;
  } else if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    checks.push({ name: 'MONGO_URI', passed: false, value: mongoUri.slice(0, 20) + '...', hint: 'Must start with mongodb:// or mongodb+srv://' });
    allPassed = false;
  } else {
    checks.push({ name: 'MONGO_URI', passed: true, value: mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//****:****@') });
  }

  // ── GUILD_ID (optional) ──
  const guildId = config.guildId;
  if (guildId) {
    if (/^\d{17,20}$/.test(guildId)) {
      checks.push({ name: 'GUILD_ID', passed: true, value: guildId });
    } else {
      checks.push({ name: 'GUILD_ID', passed: false, value: guildId, hint: 'Should be a 17–20 digit numeric snowflake' });
      allPassed = false;
    }
  } else {
    checks.push({ name: 'GUILD_ID', passed: true, value: 'Not set (global commands)' });
  }

  // ── Display results ──
  Logger.divider();

  for (const check of checks) {
    const icon = check.passed ? '✓' : '✗';
    const method = check.passed ? Logger.green : Logger.warn;
    method(`${icon} ${check.name}`);
    if (check.value) {
      Logger.info(`   → ${check.value}`);
    }
    if (!check.passed && check.hint) {
      Logger.warn(`   ⓘ ${check.hint}`);
    }
  }

  Logger.divider();

  if (allPassed) {
    Logger.green('All credentials are valid!');
  } else {
    Logger.warn('Some credentials need attention — check the warnings above.');
  }

  return { valid: allPassed, checks };
}
