# Precedent — Backend

Express + Sequelize/Postgres API for Precedent (see the [root README](../README.md)). Owns all data access, LinkedIn CSV import, Auth0 token verification, and the server-side call to the Gemini API for AI Group Insights.

## Stack

Node.js, Express, PostgreSQL, Sequelize, `express-oauth2-jwt-bearer` (Auth0), `@google/genai` (Gemini), `papaparse` + `multer` (CSV import), Jest + Supertest (tests).

## Setup

```bash
npm install
cp .env.example .env   # fill in real values when you have them
createdb precedent_dev
createdb precedent_test
npm run db:migrate
npm run db:seed
npm run dev
```

The API listens on `PORT` (default `4000`).

## Environment variables

See `.env.example` for the full list. Notable ones:

- `DATABASE_URL` — Postgres connection string. Point this at a Neon connection string in production.
- `AUTH0_DOMAIN` / `AUTH0_AUDIENCE` — required for real login. Create an Auth0 **API** (for the audience) and a **SPA application** (for the frontend) in your Auth0 tenant.
- `AUTH_BYPASS` — **dev/test only.** When `true`, every request is treated as `AUTH_BYPASS_USER_ID` instead of verifying a real Auth0 token, so you can build and test the API before wiring up Auth0. The app refuses to start with this set in `NODE_ENV=production`.
- `AI_API_KEY` / `AI_MODEL` — LLM provider API key and model (currently Gemini). Insight generation fails gracefully (with an error surfaced to the frontend) until a real key is set.
- `SEED_USER_ID` — which `userId` the seed data is attached to. Defaults to `dev-user` (matches the default `AUTH_BYPASS_USER_ID`). Once you have a real Auth0 login working, find your Auth0 `sub` (e.g. from the ID token) and re-run `SEED_USER_ID=<your-auth0-sub> npm run db:seed` so Demo Day doesn't show an empty account.

## Scripts

- `npm run dev` — start with nodemon
- `npm start` — start for production
- `npm test` — run the whole Jest suite
- `npm run test:unit` — run only the tests in `tests/unit` (CSV parsing, AI response handling). No database needed; the Gemini client is mocked, so no live AI calls
- `npm run test:integration` — run the API tests in `tests/integration` against `TEST_DATABASE_URL`. **These drop and recreate every table in that database**, so point it at a throwaway database
- `npm run db:migrate` / `db:migrate:undo` — run/undo migrations
- `npm run db:seed` / `db:seed:undo` — seed/unseed demo data
- `npm run db:reset` — drop, recreate, and reseed

## Structure

```
backend/
├── server.js            entry point (also exported for Vercel)
├── src/
│   ├── app.js           Express app: middleware and route mounting
│   ├── config/          database configuration per environment
│   ├── controllers/     request handlers
│   ├── db/
│   │   ├── migrations/  schema migrations (sequelize-cli)
│   │   └── seeders/     demo data
│   ├── middleware/      auth, async wrapper, error handling
│   ├── models/          Sequelize models and associations
│   ├── routes/          route definitions
│   └── services/        Gemini insight generation, LinkedIn CSV parsing
└── tests/
    ├── unit/            no database required
    └── integration/     API tests against a test database
```

## API

All `/api/*` routes require auth (real Auth0 JWT, or `AUTH_BYPASS` in dev/test). Every model is scoped to the authenticated user.

| Method | Path | Description |
| --- | --- | --- |
| GET/POST | `/api/contacts` | List / create contacts |
| POST | `/api/contacts/import` | Upload a LinkedIn `Connections.csv` (`multipart/form-data`, field name `file`) |
| GET/PUT/DELETE | `/api/contacts/:id` | Read / update / delete a contact |
| GET/POST | `/api/contacts/:id/career-history` | List / add career history entries for a contact |
| PUT/DELETE | `/api/career-history/:id` | Update / delete a career history entry |
| GET/POST | `/api/groups` | List (with contact counts) / create groups |
| GET/PUT/DELETE | `/api/groups/:id` | Read (with members + history) / update / delete a group |
| POST/DELETE | `/api/groups/:id/contacts/:contactId` | Assign / unassign a contact to a group |
| GET | `/api/groups/:id/insight` | Read the cached AI insight (204 if none yet generated) |
| POST | `/api/groups/:id/insight/generate` | Call the AI provider and overwrite the cached insight |

## Notes

- `GroupInsight` is cached in the database and only regenerated when `POST /api/groups/:id/insight/generate` is explicitly called — never on page load.
- CSV import expects the standard LinkedIn `Connections.csv` export, including the explanatory "Notes:" lines LinkedIn prepends before the real header row.
