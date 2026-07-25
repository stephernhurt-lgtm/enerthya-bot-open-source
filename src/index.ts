// SPDX-License-Identifier: AGPL-3.0-only
// Enerthya Bot — Copyright (c) 2026 stephernhurt-lgtm
// See LICENSE for full license text.

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
  Logger.section('ENERTHYA BOT');

  const { valid } = validateCredentials();
  if (!valid) {
    Logger.error('Validation failed — stopping.');
    process.exit(1);
  }

  await connectDb(config.mongoUri);
  initSchema();

  const client = new BotClient();
  await loadEvents(client);
  await loadCommands(client);
  await deployCommands(client);

  await client.start(config.token);
}

main().catch((err) => {
  Logger.error('Fatal:', err);
  process.exit(1);
});
