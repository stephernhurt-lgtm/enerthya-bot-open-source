# 🤖 Enerthya Bot

![CI](https://github.com/stephernhurt-lgtm/enerthya-bot-open-source/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/github/license/stephernhurt-lgtm/enerthya-bot-open-source?color=blue&label=AGPL)
![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js)
![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?logo=discord)

A modular Discord bot built with **discord.js v14** and **TypeScript**. This is the official **Enerthya Bot** repository — the code is public for transparency and contributions.

> Built by [@stephernhurt-lgtm](https://github.com/stephernhurt-lgtm). Contributions welcome via pull requests.

---

## ✨ Features

- ⚡ **Slash commands** — fully typed, guild or global deployment
- 🧩 **Modular structure** — drop in new commands and events without touching core files
- 📦 **TypeScript + tsc** — path aliases resolved automatically via `tsc-alias`
- 🛡 **Moderation suite** — `/ban`, `/kick`, `/clear`, `/say`, `/config`, `/rolemenu`, `/stats`, `/autorole`, `/slowmode`, `/giveaway`
- 📊 **Info commands** — `/ping`, `/help`, `/poll`, `/userinfo`, `/serverinfo`, `/avatar`
- 🧹 **Clean logging** — console + file, auto-rotation, coloured `Logger`
- 🔌 **Ready for Coolify / Cloudflare Tunnel** — just add your `.env`
- 🗄️ **MongoDB** — Mongoose ODM built-in, ready for persistent data
- 🛑 **Cooldowns** — anti-spam integrado nos comandos
- 👋 **Welcome system** — customizable join messages per guild
- 🚨 **Global error handler** — catches crashes and logs them
- ✅ **Pre-commit hooks** — Husky + lint-staged: auto-format + type-check before every commit
- 🎨 **Prettier** — consistent code style across all contributors
- ⚙️ **VS Code settings** — recommended extensions and formatter config

---

## 📁 Structure

```
src/
├── index.ts              # Entry point
├── deploy-commands.ts    # Slash command registration (REST)
├── config/
│   └── index.ts          # Environment config (.env)
├── core/
│   ├── Client.ts         # Extended Discord.js Client
│   ├── Logger.ts         # Structured coloured logger
│   ├── loadCommands.ts   # Auto-loader for commands/
│   └── loadEvents.ts     # Auto-loader for events/
├── commands/
│   ├── info/
│   │   ├── ping.ts       # 🏓 /ping
│   │   ├── help.ts       # 📖 /help
│   │   ├── poll.ts       # 📊 /poll
│   │   ├── userinfo.ts   # 👤 /userinfo
│   │   ├── serverinfo.ts # 🏠 /serverinfo
│   │   └── avatar.ts     # 🖼️ /avatar
│   └── moderation/
│       ├── clear.ts      # 🧹 /clear
│       ├── kick.ts       # 👢 /kick
│       ├── ban.ts        # 🔨 /ban
│       ├── say.ts        # 💬 /say
│       ├── config.ts     # ⚙️ /config
│       └── rolemenu.ts   # 🎯 /rolemenu
├── db/
│   ├── index.ts          # MongoDB connection
│   ├── schema.ts         # Model registration
│   └── schemas/
│       ├── guild.ts      # Guild settings model
│       └── rolemenu.ts   # 🎯 /rolemenu
├── types/
│   ├── index.ts          # Re-exports all types
│   ├── env.d.ts          # Typed process.env (DISCORD_TOKEN, etc.)
│   ├── discord.d.ts      # Augments discord.js Client with .commands
│   └── command.ts        # TypedCommand helper for easier command creation
├── utils/
│   ├── validator.ts      # Credential validator
│   ├── cooldown.ts       # Command cooldowns
│   ├── audit.ts          # Moderation audit logs
│   ├── helpers.ts        # Shared helpers (createEmbed, replyError, replySuccess)
│   ├── builder.ts        # ✨ Quick builders (cmd, str, usr, simple, dual, ownerOnly)
│   ├── define.ts         # defineCommand() — Discord JSON-style config
│   ├── pagination.ts     # Paginated embeds with ⬅️ ➡️ buttons
│   ├── time.ts           # dayjs helpers (timestamps, durations)
│   ├── env.ts            # Zod env validation
│   ├── errorReporter.ts  # Error webhook reporter
│   ├── owner.ts          # Owner check utility
│   └── sync.ts           # Command sync CLI utilities
└── events/
    ├── index.ts          # Event loader
    ├── ready.ts          # Client ready handler
    ├── interactionCreate.ts  # Slash command handler
    ├── errorHandler.ts   # Global error handling
    ├── guildMemberAdd.ts # 👋 Welcome messages
    ├── messageReactionAdd.ts    # ➕ Reaction role add
    └── messageReactionRemove.ts # ➖ Reaction role remove
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Yarn Classic](https://classic.yarnpkg.com/) v1
- A [Discord Application](https://discord.com/developers/applications) with a bot token

> **Note:** If your shell has `NODE_ENV=production`, run `NODE_ENV=development yarn install` so dev dependencies (TypeScript, types) are installed correctly.

### 1. Clone

```bash
git clone https://github.com/stephernhurt-lgtm/enerthya-bot-open-source.git
cd enerthya-bot-open-source
```

### 2. Install

```bash
yarn install
```

### 3. Configure

Copy `.env.example` to `.env` and fill in your values:

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
# GUILD_ID=your_guild_id_here   # ← uncomment for instant (guild) command deployment
```

> **Tip:** Set `GUILD_ID` during development so slash commands update instantly. Remove it for global deployment (up to 1 hour propagation).

### 4. Build & Run

```bash
yarn build         # compiles src/ → dist/ with path aliases
yarn start         # node dist/index.js
```

Or in dev mode (auto-rebuild on changes):

```bash
yarn dev           # tsc --watch
# then in another terminal:
yarn start
```

---

## 🛠 Adding Commands

1. Create a file in `src/commands/<category>/yourcommand.ts`
2. Export `data` (a `SlashCommandBuilder` instance) and `execute`
3. Run `yarn build` — the loader picks it up automatically

### 🚀 Quick start — using builder helpers

Use the shortcuts from `@utils/builder` to write commands in seconds:

```ts
import { simple, cmd, str, usr, modCmd } from '../utils/builder';

// Simplest possible command
export default simple('hello', 'Say hello!', async (interaction) => {
  await interaction.reply('Hello! 👋');
});

// Command with options
export const data = cmd('echo', 'Repeat a message').addStringOption(str('message', 'Text to repeat'));
export async function execute(interaction) {
  await interaction.reply(interaction.options.getString('message', true));
}

// Mod-only command
export const data = modCmd('warn', 'Warn a user').addUserOption(usr('target', 'Who to warn'));
export async function execute(interaction) { /* ... */ }
```

### 🧱 Available builders

| Helper | Shortcut for |
|--------|-------------|
| `cmd(name, desc)` | `new SlashCommandBuilder().setName().setDescription()` |
| `sub(name, desc)` | `new SlashCommandSubcommandBuilder()` |
| `modCmd(name, desc, perms?)` | `cmd()` + `setDefaultMemberPermissions(ManageMessages)` |
| `adminCmd(name, desc)` | `cmd()` + `setDefaultMemberPermissions(Administrator)` |
| `str(name, desc, required?)` | String option |
| `int(name, desc, required?)` | Integer option |
| `bool(name, desc, required?)` | Boolean option |
| `usr(name, desc, required?)` | User option |
| `role(name, desc, required?)` | Role option |
| `ch(name, desc, required?)` | Channel option |
| `simple(name, desc, handler)` | Returns `{ data, execute }` ready to export |
| `dual(name, desc, slashHandler, prefixHandler?)` | Command that works with **both** `/slash` and `!prefix` |
| `defineCommand(config)` | Discord JSON-style config → full command |

### 📋 Discord JSON-style commands

Use `defineCommand()` with a config object that mirrors Discord's official API structure:

```ts
import { defineCommand } from '../utils/define';

export default defineCommand({
  name: 'ban',
  description: 'Ban a member',
  defaultMemberPermissions: PermissionFlagsBits.BanMembers,
  options: [
    { type: 'user',    name: 'target',       description: 'Who to ban',  required: true },
    { type: 'string',  name: 'reason',       description: 'Why' },
    { type: 'integer', name: 'delete_messages', description: 'Delete recent messages', min: 0, max: 7 },
  ],
  execute: async (interaction) => {
    const user = interaction.options.getUser('target', true);
    await interaction.guild?.members.ban(user);
    await interaction.reply(`🔨 Banned ${user.tag}`);
  },
});
```

This matches how Discord documents commands in their developer portal — clean, flat, no chaining.

### ⚡ Prefix commands

This bot supports **both** slash commands and traditional prefix commands (`!ping`, `/ping`).

- **Default prefix**: `/` (configurable via `/config set prefix !`)
- Commands export `prefixExecute(message, args)` for prefix support
- Use `dual()` helper to create a command that works both ways:

```ts
import { dual } from '../utils/builder';

export default dual('ping', 'Check latency',
  async (i) => { /* slash handler — receives Interaction */ },
  async (m, a) => { /* prefix handler — receives Message + args */ },
);
```

> ⚡ **`simple()`** + **`dual()`** both work with prefix if you export `prefixExecute`.
> The `ping` command already ships with full prefix support. Try `!ping` or `/ping`!

> 💡 **Tip:** Use `replyError` and `replySuccess` from `@utils/helpers` for quick ephemeral responses.

---

## 📡 Adding Events

1. Create a file in `src/events/yourevent.ts`
2. Export a default object with `name`, `once?`, and `execute`

```ts
import { Events } from 'discord.js';

export default {
  name: Events.GuildCreate,
  once: false,
  execute(guild) {
    console.log(`Joined guild: ${guild.name}`);
  },
};
```

---

## ☁️ Deployment

### Option 1: Coolify

Push the repo to GitHub, import as a new Coolify service, set `DISCORD_TOKEN` and `CLIENT_ID` as environment variables, and use:

| Field | Value |
|-------|-------|
| Build | `yarn build` |
| Start | `node dist/index.js` |

No `config.json` needed — everything runs from `.env`.

### Option 2: Docker

```bash
# Build & run in background
docker compose up -d --build
```

Or pull from any registry and run:

```bash
docker run -d --env-file .env stephernhurt-lgtm/enerthya-bot-open-source
```

---

## 📄 License

**AGPL-3.0-only** — This bot's source code is publicly available for viewing and contribution. Any use, modification, or distribution must comply with the GNU Affero General Public License v3.0, which requires that modified versions also remain open source and give proper credit to the original author.

[Full license text](./LICENSE)

---

## ⭐ Contribute

Found a bug? Want a feature? Open an issue or pull request.

### ⚠️ Important

Any code submitted must be **tested by you** before opening a pull request. The `develop` branch is used for both testing and as the stable release branch — every merge must keep it production-ready.

### Branch flow

```
develop  ←── PRs (all contributions go here)
    │
    └──→ main (stable releases)
```

### ✅ Before submitting a PR

Run these checks locally:

```bash
# 1. TypeScript type check — must have ZERO errors
npx tsc --noEmit

# 2. Build — must compile successfully
yarn build
```

### 📸 Test evidence — required in every PR

**Every PR must include proof of testing.** This is not optional.

For **code changes** (new commands, features, fixes):
- A **screenshot of the feature running in Discord** (command + bot response)
- OR a terminal screenshot showing the complete test output

For **non-command changes** (config, docs, refactors):
- Terminal output showing `npx tsc --noEmit` and `yarn build` passing

#### Example

````markdown
## Test Results

**Build:**
```
npx tsc --noEmit  →  PASS (zero errors)
yarn build        →  PASS (Done in 2.03s.)
```

**Runtime:**
[Screenshot of the command working in Discord]
````

> ⚠️ PRs **without test evidence** will be tagged as `needs-testing` and may take longer to merge.
