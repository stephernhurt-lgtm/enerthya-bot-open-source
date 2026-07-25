# 🤖 Enerthya Bot — Open Source

![CI](https://github.com/stephernhurt-lgtm/enerthya-bot-open-source/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/github/license/stephernhurt-lgtm/enerthya-bot-open-source?color=blue)
![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js)
![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?logo=discord)

A **modular, open-source** Discord bot built with **discord.js v14** and **TypeScript**. Ready to deploy, easy to extend — perfect as a base for your own bot.

> Built by [@stephernhurt-lgtm](https://github.com/stephernhurt-lgtm)

---

## ✨ Features

- ⚡ **Slash commands** — fully typed, guild or global deployment
- 🧩 **Modular structure** — drop in new commands and events without touching core files
- 📦 **TypeScript + tsc** — path aliases resolved automatically via `tsc-alias`
- 🛡 **Moderation suite** — `/ban`, `/kick`, `/clear`, `/say`, `/config`
- 📊 **Info commands** — `/ping`, `/botinfo`, `/help`
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
│   └── Logger.ts         # Structured coloured logger
├── commands/
│   ├── index.ts          # Command loader
│   ├── info/
│   │   ├── ping.ts       # 🏓 /ping
│   │   ├── botinfo.ts    # 🤖 /botinfo
│   │   └── help.ts       # 📖 /help
│   └── moderation/
│       ├── clear.ts      # 🧹 /clear
│       ├── kick.ts       # 👢 /kick
│       ├── ban.ts        # 🔨 /ban
│       ├── say.ts        # 💬 /say
│       └── config.ts     # ⚙️ /config
├── db/
│   ├── index.ts          # MongoDB connection
│   ├── schema.ts         # Model registration
│   └── schemas/
│       └── guild.ts      # Guild settings model
├── utils/
│   ├── validator.ts      # Credential validator
│   └── cooldown.ts       # Command cooldowns
└── events/
    ├── index.ts          # Event loader
    ├── ready.ts          # Client ready handler
    ├── interactionCreate.ts  # Slash command handler
    ├── errorHandler.ts   # Global error handling
    └── guildMemberAdd.ts # 👋 Welcome messages
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

```ts
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('hello')
  .setDescription('Say hello!');

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply('Hello, world! 👋');
}
```

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

MIT — use it, modify it, ship it. See [LICENSE](./LICENSE).

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
