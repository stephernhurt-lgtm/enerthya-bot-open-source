# Contributing

Thanks for your interest in contributing to Enerthya Bot! 🎉

## Branch flow

```
develop  ←── PRs (all contributions go here)
    │
    └──→ main (stable releases)
```

## Before you start

1. Fork the repo and create your branch from `develop`
2. Install dependencies with `NODE_ENV=development yarn install`
3. Copy `.env.example` to `.env` and fill in your credentials

## Development

```bash
yarn dev        # watch mode — rebuilds on changes
yarn start      # run the bot
```

## Testing

```bash
yarn typecheck  # tsc --noEmit — must pass with zero errors
yarn test       # vitest — must pass all tests
yarn build      # tsc + tsc-alias — must compile
yarn format     # prettier — keeps code style consistent
```

## Pull request checklist

- [ ] Branch targets `develop`, not `main`
- [ ] `yarn typecheck` passes with zero errors
- [ ] `yarn test` passes (new features include tests)
- [ ] `yarn build` compiles successfully
- [ ] `yarn format` has been run
- [ ] PR description includes **test evidence** (screenshot or terminal output)

## Test evidence

Every PR must include proof of testing:

- **Code changes**: screenshot of the feature running in Discord (command + bot response)
- **Non-code changes**: terminal output of `yarn typecheck`, `yarn test`, and `yarn build`

PRs without test evidence will be tagged `needs-testing`.

## Code style

- TypeScript with strict mode
- No `console.log` — use `Logger.info()` / `Logger.warn()` / `Logger.error()`
- No `@ts-nocheck` or `@ts-ignore` — fix types properly
- Single quotes, semicolons, trailing commas (Prettier handles this)
