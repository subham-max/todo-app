# Daylist frontend

The frontend is a React, TypeScript, and Vite application organized by product
feature. Routes and app-wide concerns live under `src/app`, product capabilities
live under `src/features`, and reusable, domain-agnostic UI and API transport
live under `src/shared`.

## Project structure

```text
src/
  app/                 App composition, routing, providers, route guards
  features/
    auth/              Sign-in screens, API contract, and session state
    todos/             Task views, task editor, and local task repository
  shared/
    api/               Common fetch client and provider
    components/        Reusable UI primitives
    styles/            Global styles and design tokens
```

Add a product capability as a new folder under `features` and keep its pages,
components, API calls, and types together. Register its routes in
`src/app/App.tsx`. Keep shared components independent of feature-specific
business rules.

## Local development

```sh
npm install
cp .env.example .env
npm run dev
npm run lint
npm run build
```

`VITE_API_BASE_URL` points to the API root (including `/api`). The shared
`ApiProvider` attaches the current bearer token and centralizes JSON/error
handling. Sign-in calls `POST /auth/login`. The returned token and user are kept
in `sessionStorage` for the current browser tab. For production, prefer
HttpOnly secure cookies once the backend supports them.

The backend does not currently expose account registration or task endpoints.
Sign-up is shown as a UI entry point but does not submit data. Todo create,
edit, complete, filter, search, and delete currently operate in browser storage,
scoped by user ID, so the interface can be reviewed while the task API contract
is being designed.
