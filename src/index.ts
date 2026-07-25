import { BotClient } from '@core/Client';
import { config } from '@config/index';
import { Logger } from '@core/Logger';
import { loadEvents } from '@events/index';
import { loadCommands } from '@commands/index';
import { deployCommands } from './deploy-commands';
import { connectDb } from '@db/index';
import { initSchema } from '@db/schema';
import { validateCredentials } from '@utils/validator';

async function main() {
  Logger.section('ENERTHYA BOT — OPEN SOURCE');

  // Validate all credentials before starting
  const { valid } = validateCredentials();
  if (!valid) {
    Logger.error('Validation failed — stopping startup.');
    process.exit(1);
  }

  // Connect to database
  await connectDb(config.mongoUri);
  initSchema();

  // Build client
  const client = new BotClient();
  await loadEvents(client);
  await loadCommands(client);
  await deployCommands(client);

  // Login
  await client.start(config.token);
}

main().catch(err => {
  Logger.error('Fatal error:', err);
  process.exit(1);
});
