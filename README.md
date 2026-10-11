# Precedent

**See your career from a bigger picture.**

Precedent is a career-intelligence web app that turns your professional network into a map of real career paths. Import your LinkedIn connections, record how the people you know got to where they are, group them by the paths you care about, and get an AI-generated read on the patterns: where people started, how their titles progressed, and which roles to look for next.

## Features

- **LinkedIn import.** Upload the `Connections.csv` export from LinkedIn to create contacts in bulk.
- **Contacts and career history.** Add, edit, and delete contacts, and record each person's past roles with companies, titles, and dates.
- **Groups.** Organize contacts into groups such as "Product managers who started in consulting".
- **AI group insights.** Generate a plain-language summary of the career pattern across a group, with suggested job titles and search keywords. Insights are saved and only regenerated when you ask.
- **Private by default.** Login is handled by Auth0, and every record is scoped to the signed-in user.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, React Router, Tailwind CSS v4, Auth0 React SDK, axios |
| Backend | Node.js, Express, Sequelize, PostgreSQL |
| Auth | Auth0 (SPA login, JWT-protected API) |
| AI | Google Gemini via `@google/genai` |
| Testing | Jest, Supertest |
| Hosting | Vercel (frontend and API), Neon (Postgres) |

## Repository structure

```
precedent/
├── backend/    Express API, Sequelize models and migrations, tests
└── frontend/   React single-page app
```

Each folder is a standalone npm project with its own dependencies, scripts, and README:

- [backend/README.md](backend/README.md) covers environment variables, database scripts, and the full API reference.
- [frontend/README.md](frontend/README.md) covers Auth0 setup and the source layout.

## Getting started

### Prerequisites

- Node.js 20.19 or later
- PostgreSQL
- An [Auth0](https://auth0.com) tenant with a Single Page Application and an API
- A [Gemini API key](https://aistudio.google.com/apikey) for generating insights

### 1. Clone the repository

```bash
git clone https://github.com/aschlierca/precedent.git
cd precedent
```

### 2. Start the backend

```bash
cd backend
npm install
cp .env.example .env        # then fill in your values
createdb precedent_dev
npm run db:migrate
npm run db:seed             # optional demo data
npm run dev
```

The API runs at `http://localhost:4000`.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env        # then fill in your Auth0 values
npm run dev
```

The app runs at `http://localhost:5173`.

## Configuration

Both projects read their settings from a `.env` file. The `.env.example` in each folder lists every variable with comments. The main ones:

| Variable | Where | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | backend | Postgres connection string |
| `FRONTEND_ORIGIN` | backend | Comma-separated origins allowed to call the API |
| `AUTH0_DOMAIN`, `AUTH0_AUDIENCE` | backend | Verifies access tokens issued by Auth0 |
| `AI_API_KEY`, `AI_MODEL` | backend | Gemini API key and model |
| `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE` | frontend | Auth0 SPA login |
| `VITE_API_BASE_URL` | frontend | Base URL of the backend API |

For local API development without Auth0, the backend supports `AUTH_BYPASS=true`. It is refused when `NODE_ENV=production`.

## Testing

```bash
cd backend
createdb precedent_test
npm test
```

The test suite runs against the database in `TEST_DATABASE_URL` and mocks the Gemini client, so it makes no live AI calls.

To lint the frontend:

```bash
cd frontend
npm run lint
```
