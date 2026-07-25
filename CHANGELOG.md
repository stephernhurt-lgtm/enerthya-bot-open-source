# Changelog

## 1.1.0 — 2026-07-25

### Added
- `/uptime` — check bot uptime
- `/invite` — bot invite link
- `/lock` / `/unlock` — channel moderation
- `src/utils/string.ts` — string helpers (capitalize, truncate, pluralize, etc.)
- `src/utils/array.ts` — array helpers (chunk, random, shuffle, uniqueBy)
- `src/utils/sanitize.ts` — text sanitization

### Changed
- Folder structure: `commands/admin/` separated from `moderation/`
- Services extracted: `giveawayService`, `statsService`
- All imports now use `.js` extension for ESM compatibility
- Logger uses chalk instead of raw ANSI codes
- License: MIT → AGPL-3.0

### Fixed
- `ERR_MODULE_NOT_FOUND` on startup (missing `.js` on imports)
- `APPLICATION_COMMAND_OPTIONS_REQUIRED_INVALID` (options order)
- `Math.random() - 0.5` giveaway sort → Fisher-Yates shuffle
- `config.ts` creating document on read (side effect removed)
- `guildMemberAdd` doing 3 DB queries → 1 query
- Dead code: `sendAuditLog`, `helpers.ts`, `validator.ts` duplication

### Security
- AGPL-3.0 license — stronger copyleft protection
- `ownerOnly` config option for sensitive commands
- Error webhook reporter for crash monitoring
