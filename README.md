# Scripture

Monorepo managed with npm workspaces.

## Structure

```
apps/
  api/   Express + MongoDB backend (@scripture/api)
  web/   React + Vite frontend (@scripture/web)
```

## Setup

```bash
npm install               # installs deps for all workspaces from the root
cp apps/api/.env.sample apps/api/.env   # fill in real values
```

## Development

```bash
npm run dev        # runs api + web together
npm run dev:api     # backend only
npm run dev:web     # frontend only
```

## Build

```bash
npm run build       # builds the frontend
```

## Working with individual workspaces

Run any workspace script with `-w`:

```bash
npm run <script> -w @scripture/api
npm run <script> -w @scripture/web
```

Add a dependency to a specific workspace:

```bash
npm install <package> -w @scripture/web
```

## Deployment

- **`apps/web`** (frontend) deploys to **Vercel**. Root Directory: `apps/web`.
- **`apps/api`** (backend) deploys to **Render**. Root Directory: `apps/api`, Start Command: `npm start`.

Both platforms build/run only the app in their configured root directory, so each app's own `package.json` scripts and `.env.sample` are the source of truth for that app's environment variables.
