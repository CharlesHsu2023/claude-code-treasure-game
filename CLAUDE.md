# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install               # Install frontend dependencies
cd server && npm install  # Install backend dependencies

npm run dev               # Frontend only at http://localhost:3000
npm run dev:server        # Backend only at http://localhost:3001
npm run dev:full          # Both concurrently (recommended)
npm run build             # Production build → /build directory
```

No test framework is configured.

## Architecture

This is a full-stack treasure hunt game with a React/TypeScript frontend and a Node.js/Express backend.

**Frontend** (`src/`) — React 18 + Vite SWC + Tailwind + Radix UI / shadcn + Motion.dev

**Backend** (`server/`) — Express on port 3001, Node.js built-in SQLite (`node:sqlite`), JWT auth, bcryptjs passwords. DB file is written to `server/data/treasure.db` on first run.

Vite proxies `/api/*` → `http://localhost:3001`, so the frontend uses relative paths (`/api/login`, etc.) via `src/api/client.ts`.

**Auth flow:** Register/login returns a JWT stored in `localStorage` as `token`. The `user` object is also stored in `localStorage` for session persistence. `src/api/client.ts` attaches the token as a `Bearer` header on every request. `server/middleware/requireAuth.js` validates it.

**Game flow:**
1. `App.tsx` gates the game behind `AuthPage` — user must log in first
2. On login, treasure is randomly placed in one of 3 boxes
3. Clicking a box plays audio and reveals treasure (+$100) or skeleton (-$50)
4. Game ends when treasure is found or all boxes opened; score is POSTed to `/api/scores`
5. `ScoreHistory` component polls `/api/scores/me` after each game to show history and stats

**Key source files:**
- `src/App.tsx` — all game state, logic, and UI
- `src/api/client.ts` — thin fetch wrapper (apiGet / apiPost) with auth headers
- `src/components/auth/` — AuthPage, LoginForm, RegisterForm
- `src/components/game/` — UserHeader, ScoreHistory
- `server/index.js` — Express app entry, mounts routes, calls `db.init()`
- `server/db.js` — SQLite init; `users` and `game_sessions` tables
- `server/routes/authRoutes.js` — POST `/api/register`, POST `/api/login`
- `server/routes/scoreRoutes.js` — POST `/api/scores`, GET `/api/scores/me`
- `src/assets/` — chest images (closed, opened-treasure, opened-skeleton) and `key.png` cursor icon
- `src/audios/` — `chest_open.mp3` (treasure) and `chest_open_with_evil_laugh.mp3` (skeleton)
- `src/components/ui/` — full shadcn/ui component library (Radix UI primitives)
- `src/styles/globals.css` — CSS custom properties for light/dark theming

**Stack:** React 18, Vite 6 (SWC), Tailwind CSS, Radix UI / shadcn, Motion.dev, Lucide icons, Express, Node.js SQLite, JWT, bcryptjs.

Vite aliases all `@radix-ui/*` and shadcn paths — see `vite.config.ts` for the full alias map. `@` resolves to `./src`.
