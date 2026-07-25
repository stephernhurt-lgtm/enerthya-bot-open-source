import { BotClient } from '@core/Client';
import { config } from '@config/index';
import { Logger } from '@core/Logger';
import { loadEvents } from '@events/index';
import { loadCommands } from '@commands/index';
import { deployCommands } from './deploy-commands';

async function main() {
  Logger.section('ENERTHYA BOT — OPEN SOURCE');

  const client = new BotClient();

  await loadEvents(client);
  await loadCommands(client);
  await deployCommands(client);

  await client.start(config.token);
}

main().catch(err => {
  Logger.error('Fatal error:', err);
  process.exit(1);
});
