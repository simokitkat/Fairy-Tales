# AGENTS.md

## Workspace layout
- npm/yarn workspaces monorepo: `packages/client`, `packages/server`, `packages/shared`
- `@fairy-tales/shared` contains Zod schemas + types; imported by both client and server

## Dev servers
- Start both from repo root:
  - `cd packages/server && npm run dev` — Express on **3001**
  - `cd packages/client && npm run dev` — Vite on **3000**, proxies `/api` to 3001
- No root-level dev script; run packages independently

## Server environment
- Env loaded manually via `packages/server/src/lib/loadEnv.ts` — reads `packages/server/.env` (gitignored)
- Required vars: `DATABASE_URL`, `DIRECT_URL`, `YOUTUBE_API_KEY`
- Optional: `PORT` (default 3001), `SYNC_INTERVAL_MS` (default 86400000), `MATCH_INTERVAL_MS` (default 7200000)

## Database
- PostgreSQL via Prisma (`packages/server/prisma/schema.prisma`)
- Migrations already applied in `packages/server/prisma/migrations/`
- No `prisma` script in package.json — use `npx prisma ...` from `packages/server`

## Client commands
- `npm run build` = `tsc -b && vite build` — **typecheck must pass before build**
- `npm run typecheck` = `tsc -b`
- `npm run test` = vitest (jsdom, setup at `src/test/setup.ts`)
- `npm run test:e2e` = playwright (no config file found)
- `npm run check:i18n` = validates translation keys via `tsx src/scripts/check-i18n.ts`

## Testing
- Unit tests: vitest in `packages/client`, pattern `src/**/*.test.{ts,tsx}`
- No server-side tests or build step
- Test setup mocks `window.matchMedia` and sets `VITE_API_URL`

## i18n
- Locales are JSON files in `packages/client/src/i18n/locales/` (currently `en.json`, `ru.json`)
- Loaded dynamically via `import.meta.glob`; `check:i18n` validates keys

## Architecture quirks
- Server starts **two cron jobs** on boot (channel sync + video linking) and runs startup hooks — expect DB activity on dev start
- Channel list is hardcoded in `packages/server/src/config/channels.ts` (English + Russian)
- Video-to-fairy-tale linking uses title parsing + duration tolerance; matching logic in `matchingService.ts`
- Client path alias: `@` → `./src/*` (configured in `tsconfig.json` and `vite.config.ts`)
