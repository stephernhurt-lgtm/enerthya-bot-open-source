// SPDX-License-Identifier: AGPL-3.0-only
// Enerthya Bot — Copyright (c) 2026 stephernhurt-lgtm
// See LICENSE for full license text.

import { BotClient } from '@core/Client.js';
import { config } from '@config/index.js';
import { Logger } from '@core/Logger.js';
import { loadEvents } from '@core/loadEvents.js';
import { loadCommands } from '@core/loadCommands.js';
import { deployCommands } from './deploy-commands.js';
import { connectDb } from '@db/index.js';
import { initSchema } from '@db/schema.js';

async function main() {
  Logger.section('ENERTHYA BOT');

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
