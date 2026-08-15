# AGENTS.md

## Stack
- npm workspaces monorepo: `packages/{shared,server,client}`
- TypeScript strict (`tsconfig.base.json`: `strict`, `moduleResolution: bundler`, `isolatedModules`); each package extends it
- Server: Express 5 + Prisma 5 (PostgreSQL/Supabase) + Google APIs (`googleapis`)
- Shared: Zod schemas only
- `typescript` is NOT a dependency and there is no `tsc`, lint, or test tooling. `tsx` runs code via esbuild with no type-checking — type errors surface only at runtime. The only npm script is `dev`.

## Commands (run from `packages/server`)
- `npm run dev` — Express on `PORT || 3001` via `tsx watch src/server.ts`
- `npx prisma generate` — regenerate client after ANY `schema.prisma` change (required for new types)
- `npx prisma migrate dev` — create/apply a migration (interactive; REFUSES in non-interactive shells — use `npx prisma migrate deploy` to apply already-authored migration SQL)
- `npx prisma studio` — browse DB
- `npx tsx src/backfillData.ts` — one-off full backfill of every `CHANNELS` entry (real runnable script; `ingestionService.ts` is a module, NOT runnable on its own)

## Architecture
- `src/server.ts` — Express entry; mounts `/api/channels`, `/api/videos`; on startup and every `SYNC_INTERVAL_MS` (env, default 24h) calls `syncStaleChannels()`
- `src/lib/prisma.ts` — singleton `PrismaClient`; **all new code must import this**, never `new PrismaClient()`
- `src/services/youtubeService.ts` — YouTube Data API client; loads `packages/server/.env` itself via inline `loadEnvFile()` (no `dotenv`); Prisma loads its own env from the same `.env`
- `src/services/ingestionService.ts` — sync/upsert logic; exports `backfillChannel`, `syncChannel`, `syncStaleChannels(thresholdMs=12h)`, `syncAllChannels`; a module-level `isSyncing` guard blocks overlapping runs
- `src/config/channels.ts` — typed `CHANNELS` array (source of truth for which channels to sync)
- `src/backfillData.ts` — script entrypoint (has `main()`), loops `CHANNELS` → `backfillChannel`
- `packages/shared/src/types.ts` — Zod schemas: `Channel`, `FairyTale`, `Translation`, `Video`

## Sync model (non-obvious)
- `Channel.handle` is `@unique` (nullable); `Channel.lastSyncedAt` tracks last successful sync
- `syncStaleChannels` syncs only channels missing/null/older than `thresholdMs` (default 12h); `syncChannel` stops at the first page with no new videos (incremental), while `backfillChannel` pages the entire uploads playlist
- The server's 24h interval is independent of the 12h staleness threshold

## Env & DB
- `packages/server/.env` must contain `DATABASE_URL`, `DIRECT_URL`, `YOUTUBE_API_KEY`; gitignored — never overwrite
- Schema/migrations: `packages/server/prisma/{schema.prisma,migrations/}`

## Gotchas
- Do NOT add `dotenv`; env is loaded inline in `youtubeService.ts` and natively by Prisma
- No README, CI, or test framework exists
- `packages/client/` is a placeholder (only `package.json`/`tsconfig.json`, no `src`)
- `packages/server/tmp/` is not part of the runtime (removed after exploration)
