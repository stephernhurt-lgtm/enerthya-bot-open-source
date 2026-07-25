# 🤖 Enerthya Bot — Open Source

A **modular, open-source** Discord bot built with **discord.js v14** and **TypeScript**. Ready to deploy, easy to extend — perfect as a base for your own bot.

> Built by [@stephernhurt-lgtm](https://github.com/stephernhurt-lgtm)

---

## ✨ Features

- ⚡ **Slash commands** — fully typed, guild or global deployment
- 🧩 **Modular structure** — drop in new commands and events without touching core files
- 📦 **TypeScript + tsc** — path aliases resolved automatically via `tsc-alias`
- 🛡 **Moderation suite** — `/ban`, `/kick`, `/clear`, `/say`
- 📊 **Info commands** — `/ping`, `/botinfo`
- 🧹 **Clean logging** — no `console.log`, structured `Logger` with colours
- 🔌 **Ready for Coolify / Cloudflare Tunnel** — just add your `.env`

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
│   │   └── botinfo.ts    # 🤖 /botinfo
│   └── moderation/
│       ├── clear.ts      # 🧹 /clear
│       ├── kick.ts       # 👢 /kick
│       ├── ban.ts        # 🔨 /ban
│       └── say.ts        # 💬 /say
└── events/
    ├── index.ts          # Event loader
    ├── ready.ts          # Client ready handler
    └── interactionCreate.ts  # Slash command handler
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

## ☁️ Deployment (Coolify)

This bot is self-host ready. Deploy on [Coolify](https://coolify.io/) with a [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/):

1. Push the repo to GitHub
2. Import as a new Coolify service
3. Set `DISCORD_TOKEN` and `CLIENT_ID` as environment variables
4. Build command: `yarn build`
5. Start command: `node dist/index.js`

No `config.json` needed — everything runs from `.env`.

---

## 📄 License

MIT — use it, modify it, ship it. See [LICENSE](./LICENSE).

---

## ⭐ Contribute

Found a bug? Want a feature? Open an issue or pull request. All contributions welcome.
