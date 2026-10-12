# Mini Ticket Tracker

A small TypeScript React + Express ticket tracker backed by PostgreSQL.

## Project Structure

- `ui/src/pages` contains page-level workflows; reusable UI lives in `components` and `layouts`.
- `ui/src/api` contains Axios requests; `ui/src/schemas` contains form validation; `ui/src/types` contains UI data contracts.
- The UI uses Tailwind CSS for styling and React Hook Form with Zod for ticket form validation.
- `api/src/routes` maps endpoints to controllers; `api/src/schemas` contains request validation; `services` contain ticket queries.
- `api/src/middleware` contains the API error handler; `api/src/utils` contains shared validation-response helpers.
- `api/src/db/pool.ts` exports the shared PostgreSQL connection pool.
- `database/schema.sql` creates the tickets table and its status/priority constraints.

## Database

In pgAdmin, create a database named `mini_ticket_tracker`, connect to it, then open and run [`database/schema.sql`](database/schema.sql).

## API

```powershell
cd api
Copy-Item .env.example .env
```

Replace `YOUR_PASSWORD` in `api/.env` with your local PostgreSQL password. The URL targets the `mini_ticket_tracker` database; create that database in pgAdmin and run [`database/schema.sql`](database/schema.sql), then start the API:

```powershell
npm install
npm run dev
```

The API listens on `http://localhost:4000`. It supports creating tickets, listing with `status`, `page`, and `limit` query parameters, updating status or priority, and status counts at `/tickets/stats`. `npm run build` type-checks and compiles the API; `npm start` runs the compiled server.

## UI

In another terminal:

```powershell
cd ui
npm install
npm run dev
```

Open the Vite URL printed in the terminal. Vite forwards `/api` requests to the API on port 4000. `npm run build` type-checks the UI and creates its production bundle.
