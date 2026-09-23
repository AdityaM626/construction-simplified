# Construction OS

Construction OS is a construction project prototype for homeowners, builders/contractors, procurement/logistics teams, and platform administrators. The current UI and API still contain legacy dealer demo paths; procurement membership and production authentication are planned for later sprints.

## Local checks

Use Node.js 22 and npm. From the repository root:

```bash
npm ci
npm run typecheck
npm test
```

`npm run build` builds shared types, the database package, the API, and the web app in dependency order. Build files go into each package's `dist/` directory and are ignored by Git.

For local development, run the API and web app in separate terminals:

```bash
npm run dev --workspace=@construction-os/api
npm run dev --workspace=@construction-os/web
```

The API defaults to port 4000. The database package uses seeded local JSON and writes `persisted_db.json` outside its compiled output.

Sprint 1 adds the PostgreSQL schema and migrations in `packages/data`. Set `DATABASE_URL` and run `npm run db:migrate` to apply the schema. The existing API still uses the demo JSON store until the Sprint 2 cutover.

See [Sprint 0 foundation](docs/sprint-0-foundation.md) for the current boundaries and remaining work.
