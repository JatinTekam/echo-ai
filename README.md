# Echo AI

Echo AI is a Next.js application for describing an AI agent in natural language, generating an agent configuration with Google Gemini, and saving and editing that configuration in a user account.

> **Project status:** The agent-configuration workflow is present, but this repository does not yet include an agent execution engine, scheduler, or working external-tool integrations. The Run, Pause, and Delete controls are currently UI only. See [Current scope](#current-scope-and-limitations).

## What the application currently does

- Authenticates users with Clerk.
- Creates or retrieves a corresponding user record in Neon Postgres when a signed-in user loads the app.
- Accepts an agent description and sends it to Gemini for a structured configuration.
- Can ask follow-up questions when the request needs more information.
- Saves generated configurations and allows users to view and edit their agents.
- Stores agent fields such as instructions, objective, selected tools, skills, schedule, and output format.

## Technology

- Next.js 16 App Router, React 19, and TypeScript
- Tailwind CSS 4 and reusable UI components in `components/ui`
- Clerk for authentication
- Neon serverless Postgres with Drizzle ORM
- Google Gemini via `@google/genai`

## Requirements

- Node.js 20.9 or later
- npm
- A Neon Postgres database
- A Clerk application
- A Google AI API key for agent generation

## Run locally

1. **Get the source and install dependencies.**

   ```bash
   git clone <repository-url>
   cd echo-ai
   npm ci
   ```

   If you already have the repository, run the install command from its root directory.

2. **Create local environment settings.**

   On Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   On macOS/Linux:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with real values from your providers. `.env` is ignored by Git and is loaded by both Next.js and the Drizzle CLI configuration:

   | Variable | Required | Purpose |
   | --- | --- | --- |
   | `DATABASE_URL` | Yes | Neon Postgres connection string. |
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk's publishable key for the app. |
   | `CLERK_SECRET_KEY` | Yes | Clerk's server-side secret key. Keep it private. |
   | `GOOGLE_CLOUD_GEMINI_API_KEY` | Yes for generation | Google AI key used by the agent-configuration API. |
   | `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Recommended | Sign-in route; use `/sign-in`. |
   | `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Recommended | Sign-up route; use `/sign-up`. |

   Clerk keys can be created in the Clerk dashboard; use test keys for local development. Get the database URL from Neon and the Gemini key from Google AI Studio. Do not commit `.env` or paste real keys into source files.

3. **Create/update the database tables.**

   ```bash
   npm run db:push
   ```

   This applies the Drizzle schema in `db/schema.ts` to the configured database. The schema defines `users`, `tools`, and `agentConfig`.

4. **Start the development server.**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). The `/dashboard` routes require a signed-in Clerk user; create an account at `/sign-up` or sign in at `/sign-in`.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve a production build; run `npm run build` first. |
| `npm run db:push` | Push the Drizzle schema to the configured database. |
| `npm run db:generate` | Generate Drizzle migration files from the schema. |
| `npm run db:studio` | Open Drizzle Studio for the configured database. |
| `npm run lint` | Run ESLint across the project. |

## How the project is organized

```text
app/
  api/
    agent/configure/     Generate, list, and update agent configurations
    users/               Create or retrieve the signed-in user's database record
  dashboard/
    agents/              Create and manage agent configurations
  sign-in/               Clerk sign-in page
  sign-up/               Clerk sign-up page
components/
  custom/agents/         Agent creation, clarification, list, and edit UI
  custom/dashboard/      Dashboard navigation
  ui/                    Shared UI primitives
context/                 User detail React context
data/                    Gemini configuration prompt and response schema
db/                      Drizzle database client and schema
```

### Main request flow

1. Clerk provides the signed-in user identity.
2. `app/provider.tsx` calls `POST /api/users`, which creates or retrieves the user's database record.
3. The Agents page submits a natural-language request to `POST /api/agent/configure`.
4. The API reads tool slugs from the `tools` table, asks Gemini for a response conforming to the schema in `data/ReponseSchema.tsx`, and saves a ready configuration in `agentConfig`. If more details are needed, it returns clarification questions instead.
5. The Agents page calls `GET /api/agent/configure` to list the user's saved configurations. Editing calls `PUT /api/agent/configure`.

The application routes and corresponding UI are in the Next.js App Router under `app/`; database tables and types are defined in `db/schema.ts`.

## Database notes

- `users` stores an email, name, and credit counters.
- `agentConfig` stores the agent configuration and associates it with a user email.
- `tools` stores tool metadata used when building the Gemini prompt.
- This repository does not currently include a database seed script. A fresh database will have its tables after `npm run db:push`, but the `tools` table will remain empty until tool records are added.

## Current scope and limitations

- `/dashboard/agents` is the main implemented product flow.
- The root page (`/`) is still a simple placeholder, and `/dashboard` currently contains placeholder content.
- Sidebar destinations such as Runs, Integrations, Templates, Settings, and Profile do not currently have corresponding pages in this repository.
- Agent generation creates and stores a configuration; it does not run the configured agent.
- Schedule fields are saved as configuration only. There is no background scheduler or execution service here.
- Tool names can be included in an agent configuration, but OAuth connections and actual tool execution are not implemented here.
- Run, Pause, and Delete actions are displayed but do not currently perform those operations.
- There is no test script configured in `package.json`.

## Production notes

- Set production Clerk keys, a production Neon `DATABASE_URL`, and `GOOGLE_CLOUD_GEMINI_API_KEY` in the deployment environment.
- Keep secret keys server-side; only variables intentionally prefixed with `NEXT_PUBLIC_` should be exposed to the browser.
- Apply the database schema to the target database before using the application.
- The application currently has no agent runner or scheduler, so deployments should not be expected to execute generated agents.
