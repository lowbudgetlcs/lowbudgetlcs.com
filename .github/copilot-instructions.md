# General AI Guidelines
- **Certainty Threshold**: Only execute tasks when you have at least 95% certainty of what to do. Otherwise, ask clarifying questions.

# LowBudgetLCS Client AI Guide

## 1. Client Architecture Overview
- **Framework**: React 18, Vite, TypeScript, Tailwind CSS.
- **Entry Point**: `client/src/main.tsx` -> `App.tsx`.
- **Routing**: `react-router-dom`. Handles subdomain logic (`draft.lowbudgetlcs.com` vs main).

## 2. Feature Modules (`client/src/features/`)
The application is structured by feature. Each feature folder generally contains its own `components/`, `api/`, `hooks/`, and entry pages.

### 2.1 Draft Tool (`features/Draft/`)
Competitive drafting tool for League of Legends.
- **State Management**: Heavily relies on `SocketProvider` and `SettingsProvider`.
- **Real-time**:
  - **Socket Provider**: `providers/SocketProvider.tsx` manages the `socket.io-client` connection.
  - **Handlers**: `socket/draftHandler.ts` contains listeners (`blueReady`, `pick`, `ban`) and emitters.
- **Key Components**:
  - `Draft.tsx`: Main entry point for a draft lobby.
  - `pages/`: Sub-pages for the draft flow (e.g., specific phases).
- **Routing**: `client/src/routes/DraftRoutes.tsx` handles `/draft/*`.

### 2.2 Stats Page (`features/Stats/`)
Public statistics for the organization.
- **Data Fetching**: REST API based.
  - **API Layer**: `api/` folder (e.g., `getRecentGames.ts`, `getPlayerStats.ts`). Functions typically return typed promises.
  - **Usage**: simple `useEffect` hooks in components (e.g., in `Stats.tsx`).
- **UI Components**: `components/StatsSearchUI`, `components/cards/MiniGameCard`.
- **Routing**: `client/src/routes/StatRoutes.tsx` handles `/stats/*`.

### 2.3 General Pages (Home, Match History, etc.)
- **Home**: `features/Home/`. Landing page.
- **Match History**: `features/MatchHistory/`. Displays game details using `MatchV5` types.
- **AllStars**: `features/AllStars/`.
- **Routing**: `client/src/routes/DefaultRoutes.tsx` handles these top-level routes.

## 3. Global Routing Logic (`App.tsx`)
- **Subdomain Handling**:
  - Detects `draft` subdomain to render `DraftRoutes`.
  - Otherwise renders `DefaultRoutes` (and `StatRoutes` at `/stats`).
- **Navbars**: Conditionally renders `DraftNavbar`, `StatsNavbar`, or standard `Navbar`.

## 4. Shared Resources
- **Types**: `client/src/types/` (e.g., `MatchV5.ts`, `StatTypes.ts`).
- **Icons/Assets**: `client/src/assets/`.
- **Layout**: `client/src/layout/` (Navbar, Footer, Theme).

## 5. Developer Workflow (Client)
- **Run**: `npm run dev` in `client/` folder.
- **Environment**: Needs `.env` with `VITE_BACKEND_URL` for API and Socket connections.
- **Styling**: Utility-first with Tailwind CSS. `index.css` defines global styles and animations.

# LowBudgetLCS Server AI Guide

## 1. Server Architecture Overview
- **Runtime**: Node.js with Express.
- **Language**: TypeScript.
- **Entry Point**: `server/server.ts`. Initializes Express, Socket.IO, and mounts routes.
- **Docker**: Runs via `server/Dockerfile`, exposed on port 8080.

## 2. Infrastructure & Database
- **Database**: PostgreSQL (Supabase).
- **ORM**: **Drizzle ORM** (`drizzle-orm`).
- **Configuration**: `server/drizzle.config.ts` & `server/db/index.ts`.
- **Schema**: Defined in `server/db/schema.ts`.
  - **CRITICAL**: All tables belong to the `website` Postgres schema (e.g., `export const website = pgSchema("website");`).
  - Contains tables for `auth_*` (Better Auth), stats, and drafting.
- **Queries**: Modularized in `server/db/queries/` (e.g., `insert.ts`, `select.ts`).

## 3. Feature Modules

### 3.1 Draft Tool Backend (`server/draftTool/`)
Handles real-time drafting logic via WebSockets.
- **Sockets**: `server/draftTool/sockets/`
  - `draftSocket.ts`: Manages the `/draft` namespace.
  - `fearlessSocket.ts`: Manages the `/fearless` namespace.
- **Handlers**: `server/draftTool/draftHandlers/`. Logic for pick/ban phases.
- **State**: In-memory state management for active draft lobbies.

### 3.2 Stats Pipeline (`server/stats/`)
complex pipeline for ingesting and aggregating game data.
- **Ingestion**: `server/stats/insertGames/` fetches data (likely Riot API/Google Sheets).
- **Aggregation**: `server/stats/*Aggregation.ts` computes player/team stats.
- **Scheduled Jobs**: `server/cronJobs/` contains periodic tasks (e.g., `scheduleGameStatsUpdate.ts`, `scheduleImageFetch.ts`).

### 3.3 Match History (`server/matchHistory/`)
- Logic for retrieving specific match details (Match V5 format).

## 4. API & Routing
- **Routes**: Located in `server/routes/`.
  - `draftRoutes.ts`, `statsRoutes.ts`, `adminRoutes.ts`, etc.
- **Middleware**: Defined in `server.ts` (CORS, Rate Limiting).
- **Authentication**: `server/utils/auth.ts` uses **Better Auth** (`better-auth`) for admin protection.
  - Auth routes mounted at `/admin/api/auth/*`.

## 5. Developer Workflow (Server)
- **Run**: `npm run dev` in `server/` folder (runs via `nodemon`/`ts-node`).
- **Environment**: Requires `.env` with `DATABASE_URL`, `TWITCH_*`, `RIOT_API_KEY`.
- **API Testing**: Use Postman or curl against `http://localhost:8080/api/...`.
