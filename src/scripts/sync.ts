/**
 * CLI tool to manage Discord slash commands.
 *
 * Usage:
 *   tsx src/scripts/sync.ts           # deploy commands
 *   tsx src/scripts/sync.ts --list    # list registered commands
 *   tsx src/scripts/sync.ts --clear   # clear guild commands
 *
 * Runs standalone — no bot needed.
 */

import 'dotenv/config';
import { REST, Routes } from 'discord.js';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId) {
  console.error('❌ Missing DISCORD_TOKEN or CLIENT_ID in .env');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);
const args = process.argv.slice(2);

async function loadCommands() {
  // Dynamically import all command files to build the command list
  const { readdirSync } = await import('node:fs');
  const { join, dirname } = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const commands: any[] = [];
  const foldersPath = join(__dirname, '..', 'commands');
  const folders = readdirSync(foldersPath).filter((f) => !f.includes('.'));

  for (const folder of folders) {
    const files = readdirSync(join(foldersPath, folder)).filter(
      (f) => f.endsWith('.ts') || f.endsWith('.js'),
    );
    for (const file of files) {
      const cmd = await import(join(foldersPath, folder, file));
      if (cmd.default?.data) commands.push(cmd.default.data);
      else if (cmd.data) commands.push(cmd.data);
    }
  }
  return commands;
}

async function main() {
  if (args.includes('--list')) {
    console.log('\n📋 Registered commands:\n');
    if (guildId) {
      const cmds = (await rest.get(Routes.applicationGuildCommands(clientId, guildId))) as any[];
      console.log(`Guild (${cmds.length}):`);
      for (const c of cmds) console.log(`  /${c.name} — ${c.description}`);
    }
    const global = (await rest.get(Routes.applicationCommands(clientId))) as any[];
    console.log(`\nGlobal (${global.length}):`);
    for (const c of global) console.log(`  /${c.name} — ${c.description}`);
    return;
  }

  if (args.includes('--clear')) {
    if (!guildId) {
      console.error('❌ --clear requires GUILD_ID in .env');
      process.exit(1);
    }
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
    console.log('✅ Guild commands cleared.');
    return;
  }

  // Default: deploy
  const commands = await loadCommands();
  if (commands.length === 0) {
    console.warn('⚠️ No commands found.');
    return;
  }

  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log(`✅ Deployed ${commands.length} guild commands.`);
  } else {
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log(`✅ Deployed ${commands.length} global commands (cache up to 1h).`);
  }
}

main().catch((err) => {
  console.error('❌', err);
  process.exit(1);
});
