# Daylist

Daylist is a task-planning application and a full-stack learning project. It is
being built to explore the complete product lifecycle: designing a useful
interface, building an API and data layer, automating checks and deployments,
and progressively adding the foundations needed for AI-powered features.

The longer-term goal is to grow this project into a reliable, scalable product
while developing the skills needed to become a **full-stack AI engineer**.

> **Project status:** The frontend task experience is usable, but tasks are
> currently saved in the browser rather than through the API. The backend
> currently provides sign-in and database connectivity; account registration
> and task CRUD endpoints are not implemented yet. Redis, smoke testing, and
> RAG features are future work, not current capabilities.

## Live application

- **Frontend:** [daily-list-eight.vercel.app](https://daily-list-eight.vercel.app/)
- **Backend API:** [todo-app-1-pike.onrender.com](https://todo-app-1-pike.onrender.com/)
- **Render deployments:** [Backend deployment dashboard](https://dashboard.render.com/web/srv-dc43comi0phs7391lr8g/deploys)
- **Neon:** [Database project permissions](https://console.neon.tech/app/projects/billowing-glade-31689473/settings/permissions)
- **Vercel:** [Frontend project](https://vercel.com/subhammaxs-projects/daily-list)

The backend root route (`/`) returns a small API status response. The
`/db-test` route checks database connectivity. The frontend is configured to
use the API root ending in `/api`.

## What the application does today

### Task-planning interface

After signing in, the app provides a personal workspace with:

- **Today**, **Upcoming**, **All tasks**, and **Completed** views.
- A task editor for titles, optional notes, due dates, priority, and category.
- Task creation, editing, completion, and deletion.
- Search, daily progress, and task summary counts.
- Responsive navigation, a sign-out action, and a keyboard shortcut to focus
  search (`Ctrl+K` or `⌘K`).

Task data is currently persisted in browser `localStorage`, scoped by the
signed-in user's ID. It stays in that browser and does not synchronize between
devices or browsers. When no saved task list exists, the interface can show
starter tasks.



## How the project is organized

```text
.
├── backend/
│   ├── prisma/                 # Prisma schema and SQL migrations
│   └── src/
│       ├── config/             # PostgreSQL and Prisma clients
│       ├── controllers/        # API request handling
│       ├── routes/             # Express route definitions
│       └── validators/         # Request validation schemas
├── frontend/
│   └── src/
│       ├── app/                # Routes, providers, and route guards
│       ├── features/
│       │   ├── auth/           # Sign-in, sign-up UI, and session state
│       │   └── todos/          # Task views and browser-local task state
│       └── shared/             # API transport, reusable components, styles
├── .github/workflows/          # CI and deployment workflows
└── docker-compose.yml          # Local PostgreSQL service
```

The frontend is organized by product feature so that pages, state, types, and
components for a capability stay together. Shared UI and API transport are kept
separate from feature-specific behavior. The backend separates routes,
controllers, validation, and infrastructure configuration.

## Technologies and why they are used

| Technology | How it is used in this project |
| --- | --- |
| **React 19** | Builds the interactive task board and authentication screens from reusable UI components. |
| **TypeScript** | Adds static types to frontend and backend code, making data contracts and refactoring safer. |
| **Vite** | Runs the frontend development server and creates the production frontend bundle. |
| **React Router** | Handles page navigation, protected application routes, and lazy-loaded screens. |
| **Node.js and Express 5** | Run the TypeScript backend and expose the JSON REST API. |
| **Zod** | Validates login request data at the API boundary. |
| **bcryptjs** | Hashes and verifies user passwords rather than storing plain-text passwords. |
| **JSON Web Tokens (JWT)** | Provides a signed bearer token after successful login. |
| **PostgreSQL** | Relational database for durable structured data, including users and the planned server-backed task data. |
| **Prisma 7** | Defines the database schema, generates a typed database client, and tracks schema changes as migrations. |
| **Neon** | Hosts the managed PostgreSQL database used by the deployed backend and production migration workflow. |
| **Docker Compose** | Runs PostgreSQL locally in a repeatable container for development. The application services themselves are not currently containerized by this Compose file. |
| **GitHub Actions** | Automates frontend/backend checks and the configured production deployment steps. |
| **Vercel** | Hosts the deployed frontend. |
| **Render** | Hosts the deployed backend API. |
| **Oxlint** | Lints the frontend source as part of local development and CI. |

### Prisma and database configuration

The Prisma schema is the source definition for the current `User` and `Todo`
models. SQL migration files record database changes so environments can be
updated consistently. `prisma.config.ts` reads `DATABASE_URL` from the
environment, and the backend uses Prisma's PostgreSQL adapter for ORM queries.
The backend also has a `pg` connection pool for the database connectivity
check.

PostgreSQL is used locally and in production. Docker Compose starts PostgreSQL
17 on host port `5435`; Neon provides the hosted database. Keep connection
strings and credentials in environment variables or deployment secrets, never
in committed source code.

## Run locally

### Requirements

- Node.js 24 (the CI workflows use Node.js 24)
- npm
- Docker with Docker Compose, or another reachable PostgreSQL instance

### 1. Start local PostgreSQL

From the repository root:

```sh
docker compose up -d postgres
```

The database is exposed on `localhost:5435` and its data is stored in the
`postgres_data` Docker volume.

### 2. Configure and start the backend

Create `backend/.env` with values for your local database and a private JWT
signing secret:

```dotenv
DATABASE_URL=postgresql://todo_user:todo_password@localhost:5435/todo_database?schema=public
JWT_SECRET=replace-with-a-long-random-secret
PORT=5001
```

Then run:

```sh
cd backend
npm ci
npx prisma generate
npx prisma migrate deploy
npm run dev
```

**Migration caveat:** Two checked-in initial migrations currently both create
the `Todo` table. A clean database may therefore reject `prisma migrate deploy`
when it reaches the second migration. The migration history needs to be
consolidated or corrected before relying on a fresh local database or the
backend CI/deployment migration step.

The API listens on port `5001` by default. Do not reuse the example local
database password or a development JWT secret in production.

### 3. Configure and start the frontend

In a second terminal:

```sh
cd frontend
npm ci
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` in `frontend/.env` to the API base URL, including `/api`.
For the local backend, use:

```dotenv
VITE_API_BASE_URL=http://localhost:5001/api
```

The frontend's `.env.example` points to the deployed API by default. Vite
exposes `VITE_` variables to browser code, so only put public configuration
there—never secrets.

### Useful development commands

```sh
# Backend, from backend/
npm run dev
npm run typecheck
npm run build

# Frontend, from frontend/
npm run dev
npm run lint
npm run build
npm run preview
```

## Automation and CI/CD

GitHub Actions workflows are stored in `.github/workflows/`. The workflows are
configured for pushes and pull requests targeting `main` and `develop`, with
path filters so frontend and backend changes can be handled independently.

- **Frontend CI** installs locked dependencies, runs Oxlint, and builds the
  Vite frontend.
- **Backend CI** installs dependencies, generates the Prisma client, applies
  migrations to a PostgreSQL service, and builds the TypeScript backend.
- **Frontend deployment** runs after frontend CI on pushes to `main`, builds
  with the Vercel CLI, and deploys to Vercel.
- **Backend deployment** runs after backend CI on pushes to `main`, applies
  production migrations to Neon, then triggers the Render deploy hook.
- Workflow concurrency groups cancel older in-progress runs for the same
  branch.

Deployment workflows require repository secrets to be configured in GitHub:

- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`
- `NEON_DATABASE_URL`
- `RENDER_DEPLOY_HOOK_URL`

The checked-in workflows currently build and lint the frontend and build the
backend. The backend workflow has an optional `npm test --if-present` step, but
there is not yet a test script in the backend package. Automated post-deploy
smoke tests are **not implemented yet**; they are part of the planned work
below. Review the workflow configuration and deployment secrets in GitHub
before relying on it for a production release. The repository also has
standalone CI workflows alongside CI/CD workflows, so some checks may run
twice for the same change; consolidating those workflows is a future cleanup.

## Roadmap

The project is being developed iteratively. Planned improvements include:

1. **Complete the product API:** implement account registration and
   authenticated task create/read/update/delete endpoints, validate task input,
   and associate tasks with their owning user.
2. **Persist tasks in PostgreSQL:** connect the task UI to the backend, migrate
   away from browser-only task storage, and make data available across devices.
3. **Add meaningful automated tests:** cover validation, authentication,
   authorization, task behavior, and database interactions.
4. **Add smoke testing:** run lightweight checks after deployment—such as API
   health, database readiness, and essential sign-in/task flows—to catch
   deployment problems quickly. Keep smoke-test credentials and test data
   isolated from real user data.
5. **Strengthen operations:** improve deployment configuration, monitoring,
   structured logs, error reporting, and secrets management as usage grows.
6. **Evaluate Redis when there is a concrete need:** possible uses include
   caching frequently requested data, rate limiting, or background-job
   coordination. PostgreSQL remains the source of truth; Redis is not currently
   configured.
7. **Explore retrieval-augmented generation (RAG):** once core task persistence
   and access controls are solid, experiment with a pipeline that can retrieve
   relevant user-authorized task context for AI features. This may involve
   embeddings, a vector search capability, evaluation, and safeguards against
   leaking one user's data to another. No RAG pipeline or AI assistant is
   currently implemented.
8. **Scale based on evidence:** use measured product needs to decide whether
   caching, queues, separate services, or additional infrastructure are
   worthwhile rather than adding complexity prematurely.

## Motivation and learning goals

Daylist is both a practical task-planning product and a way to learn by
building. The work connects frontend engineering, backend APIs, relational
data, authentication, deployment, automation, and—over time—AI systems. The
goal is to make each layer understandable and dependable before adding more
advanced infrastructure or AI capabilities, while progressing toward becoming
a full-stack AI engineer.