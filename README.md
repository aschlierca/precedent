# Precedent

**See your career from a bigger picture.**

Precedent helps you learn from the career paths of people you already know. The people in your network have made the moves you are thinking about making. Precedent gathers those paths in one place and shows you what they have in common, so your next step is based on what has actually worked for real people.

## How it works

1. **Bring in your network.** Upload the connections file you can download from LinkedIn, or add people one at a time.
2. **Fill in their paths.** For the people whose careers interest you, note where they worked, what their titles were, and when.
3. **Group people who share a path.** Create a group for any direction you are curious about, such as "Product managers who started in consulting" or "Designers who moved into startups".
4. **Ask for the pattern.** With one click, Precedent reads through the group and writes a short summary of how those careers unfolded, along with job titles and search terms worth looking into next.

## What you can do

- Import all your LinkedIn connections in one upload
- Keep a career timeline for each contact, with your own notes
- Sort contacts into as many groups as you like
- Get an AI-written summary of the career pattern in any group
- Come back to a saved insight at any time, and refresh it when the group changes

## Your data

You sign in with your own account, and you only ever see the contacts and groups you added. An insight is created only when you ask for one. At that point the names and career histories in that group are sent to Google's Gemini model to write the summary.

---

## For developers

Everything below is for people who want to run or work on the code.

### Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, React Router, Tailwind CSS v4 |
| Backend | Node.js, Express, Sequelize, PostgreSQL |
| Sign-in | Auth0 |
| AI | Google Gemini |
| Tests | Jest, Supertest |
| Hosting | Vercel (frontend and API), Neon (Postgres) |

### Project structure

```
precedent/
├── backend/                 REST API
│   ├── server.js            entry point
│   ├── src/
│   │   ├── app.js           Express app setup
│   │   ├── config/          database configuration
│   │   ├── controllers/     request handlers
│   │   ├── db/              migrations and seed data
│   │   ├── middleware/      auth and error handling
│   │   ├── models/          database models
│   │   ├── routes/          route definitions
│   │   └── services/        AI insights, LinkedIn CSV parsing
│   └── tests/
│       ├── unit/
│       └── integration/
└── frontend/                React single-page app
    └── src/
        ├── api/             HTTP client
        ├── auth/            sign-in provider and route guard
        ├── components/      common, contacts, groups
        ├── hooks/
        └── pages/
```

The two folders are separate npm projects, each with its own README:

- [backend/README.md](backend/README.md) has the environment variables, database scripts, and API reference.
- [frontend/README.md](frontend/README.md) has the Auth0 setup steps and source layout.

### Run it locally

You need Node.js 20.19 or later, PostgreSQL, an [Auth0](https://auth0.com) tenant (one Single Page Application and one API), and a [Gemini API key](https://aistudio.google.com/apikey).

```bash
git clone https://github.com/aschlierca/precedent.git
cd precedent
```

Start the API:

```bash
cd backend
npm install
cp .env.example .env        # then fill in your values
createdb precedent_dev
npm run db:migrate
npm run db:seed             # optional demo data
npm run dev                 # http://localhost:4000
```

Start the app in a second terminal:

```bash
cd frontend
npm install
cp .env.example .env        # then fill in your Auth0 values
npm run dev                 # http://localhost:5173
```

### Configuration

Each project reads its settings from a `.env` file. The `.env.example` beside it lists every variable with comments. The main ones:

| Variable | Project | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | backend | Postgres connection string |
| `FRONTEND_ORIGIN` | backend | Origins allowed to call the API, comma-separated |
| `AUTH0_DOMAIN`, `AUTH0_AUDIENCE` | backend | Verifies sign-in tokens from Auth0 |
| `AI_API_KEY`, `AI_MODEL` | backend | Gemini API key and model |
| `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE` | frontend | Auth0 sign-in |
| `VITE_API_BASE_URL` | frontend | Where the frontend finds the API |

### Tests

```bash
cd backend
npm run test:unit           # no database needed
npm run test:integration    # needs a test database
```

The integration tests drop and recreate every table in `TEST_DATABASE_URL`, so point that at a throwaway database (`createdb precedent_test`). Neither suite makes live AI calls.

To lint the frontend, run `npm run lint` in `frontend/`.
