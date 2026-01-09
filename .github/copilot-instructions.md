# LowBudgetLCS AI Guide

## Project Structure
- **Client**: `client/` (React, Vite, TS, Tailwind). Entry: `src/main.tsx`. Run: `npm run dev` (Port 3000).
- **Server**: `server/` (Node, Express, Socket.IO, Drizzle). Entry: `server.ts`. Run: `npm run dev` (Port 8080).
- **Infrastructure**: Root `Makefile` & `compose.yaml`. `make all` runs full stack via Docker.

## Key Technical Patterns
- **Database**: Postgres with **Drizzle ORM**.
  - **CRITICAL**: Define tables in `server/db/schema.ts` using the `website` schema object (e.g., `website.table(...)`).
  - Queries: Place in `server/db/queries/`.
- **Real-time (Sockets)**:
  - Server: Handlers in `server/draftTool/sockets/` (e.g., `draftSocket.ts`). Initialized in `server.ts`.
  - Client: `socket.io-client` usage in `client/src/components/DraftTool/`.
- **Stats Pipeline**:
  - Ingestion: `server/stats/insertGames/` (Riot API/Google Sheets).
  - Aggregation: `server/stats/*Aggregation.ts`.
  - Scheduling: `server/cronJobs/` triggers updates.
  - Frontend: `client/src/components/StatsPage/dataHandlers/` wraps API calls.

## Developer Workflow
- **Environment**: Create `.env` in both `client/` and `server/` based on examples/usage.
- **Port Mapping**: Client runs on 3000. Server on 8080 (internal) / 3001 (docker host).
- **Api Clients**: When adding server routes (`server/routes/`), update matching client utilities in `client/src/utils` or `dataHandlers`.
- **Testing**: No automated test suite enabled. Verify changes via `npm run dev` (split terminals) or `make all`.
