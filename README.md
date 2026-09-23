# Construction OS

Construction OS is a shared project workspace for homeowners, builders/contractors, procurement/logistics teams, and platform administrators. Accounts and project membership use PostgreSQL.

## Local checks

Use Node.js 22 and npm. From the repository root:

```bash
npm ci
npm run db:migrate
npm run typecheck
npm test
```

`npm run build` builds shared types, the database package, the API, and the web app in dependency order. Build files go into each package's `dist/` directory and are ignored by Git.

For local development, run the API and web app in separate terminals:

```bash
npm run dev --workspace=@construction-os/api
npm run dev --workspace=@construction-os/web
```

Set `DATABASE_URL` to PostgreSQL and `JWT_SECRET` to a secret of at least 32 characters before starting the API. The API defaults to port 4000 and accepts the web origin `http://localhost:5173` by default.

The `packages/db` JSON seed remains as reference data but is not used by the live API. See [Sprint 2 accounts and membership](docs/sprint-2-auth-membership.md) for account setup and administrator provisioning.

See [Sprint 0 foundation](docs/sprint-0-foundation.md) for the current boundaries and remaining work.
