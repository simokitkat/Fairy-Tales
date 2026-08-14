# AGENTS.md

## Stack
- npm workspaces monorepo: `packages/{shared,server,client}`
- TypeScript strict (`tsconfig.base.json`), each package extends it
- Server: Express 5 + Prisma 5 (PostgreSQL/Supabase) + Google APIs
- Shared: Zod schemas only

## Commands
- `cd packages/server && npm run dev` — starts Express on `PORT || 3001` with `tsx watch`
- `cd packages/server && npx prisma migrate dev` — run migrations against Supabase
- `cd packages/server && npx prisma studio` — browse DB
- `cd packages/server && npx tsx src/ingestionService.ts` — one-off ingestion runner (not a real script; see note below)

## Architecture
- `packages/server/src/server.ts` — Express entry, mounts `/api/channels` and `/api/videos`
- `packages/server/src/lib/prisma.ts` — singleton PrismaClient; **all new code must import this**
- `packages/server/src/services/youtubeService.ts` — YouTube Data API client; loads `packages/server/.env` inline (no `dotenv` package)
- `packages/server/src/services/ingestionService.ts` — channel/video upsert logic
- `packages/server/src/config/channels.ts` — typed `CHANNELS` array
- `packages/shared/src/types.ts` — Zod schemas (`Channel`, `FairyTale`, `Translation`, `Video`)

## Env & DB
- `packages/server/.env` must contain `DATABASE_URL`, `DIRECT_URL`, and `YOUTUBE_API_KEY`
- `.env` is gitignored; never overwrite it
- Schema: `packages/server/prisma/schema.prisma`
- Migrations: `packages/server/prisma/migrations/`

## Gotchas
- YouTube env loading is custom inline code in `youtubeService.ts`; do not add `dotenv`
- No test framework, CI, or README exists
- `packages/client/` is a placeholder with no code yet
- `packages/client/` and `packages/server/tmp/` are not part of the runtime; `tmp/` was removed after exploration
