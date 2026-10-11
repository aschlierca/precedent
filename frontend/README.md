# Precedent — Frontend

React + Vite frontend for Precedent (see the [root README](../README.md)). Auth0 login, LinkedIn CSV import, contact/group management, and the AI Group Insight panel.

## Stack

React (Hooks), Vite, React Router, `@auth0/auth0-react`, axios, Tailwind CSS v4.

## Setup

```bash
npm install
cp .env.example .env   # fill in real Auth0 values when you have them
npm run dev
```

The dev server runs on `http://localhost:5173` (or the next free port). Point `VITE_API_BASE_URL` at the backend (default `http://localhost:4000/api`).

## Auth0

Without real values in `.env`, the app shows a friendly "Auth0 isn't configured yet" screen instead of crashing — you can build and verify everything else before Auth0 is wired up. To enable real login:

1. In your Auth0 tenant, create an **API** (Applications → APIs) — its Identifier is `VITE_AUTH0_AUDIENCE` (and the backend's `AUTH0_AUDIENCE`).
2. Create a **Single Page Application** — its Domain and Client ID are `VITE_AUTH0_DOMAIN` / `VITE_AUTH0_CLIENT_ID`.
3. Add `http://localhost:5173` (and your deployed URL) to the SPA's **Allowed Callback URLs**, **Allowed Logout URLs**, and **Allowed Web Origins**.

## Structure

```
src/
├── api/                 axios client and error formatting
├── auth/                Auth0 provider and the protected-route guard
├── components/
│   ├── common/          shared UI: navbar, logo, modal, spinner, error banner
│   ├── contacts/        contact cards and forms, career history, CSV import
│   └── groups/          group cards and forms, member picker, AI insight panel
├── hooks/               useApi, which attaches a fresh Auth0 access token to every request
├── pages/               routed pages: Login, Dashboard, ContactDetail, Groups, GroupDetail
├── App.jsx              route table
└── main.jsx             entry point
```

Every async action (CSV import, all CRUD, insight generation) has an explicit loading state and a dismissible/retry-able error banner.
