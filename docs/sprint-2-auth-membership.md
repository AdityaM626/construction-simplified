# Sprint 2: accounts and project boundaries

The application now starts with account registration or sign-in. Registration accepts homeowner, builder/contractor, or procurement/logistics roles and requires a password of at least 12 characters. Only an operator with environment access can create an administrator account. Roles come from the database on every authenticated request; JWT claims supply only the account ID.

Homeowners create projects. The project owner can add an already-registered builder or procurement account by email. Project reads require membership, except for administrators. The owner is added as a project member when the project is created. Member changes and project creation write audit events.

The old JSON-backed API and demo role switcher are no longer mounted. The previous screen components remain in source as design reference while the live workspace is connected to PostgreSQL. Existing JSON seed users have no production password hashes and are **not** migrated into accounts. Register fresh users, then create and assign projects.

## Run

Set `DATABASE_URL` to a PostgreSQL connection string and `JWT_SECRET` to a secret of at least 32 characters. Optionally set `WEB_ORIGIN` (default `http://localhost:5173`) and the web build's `VITE_API_BASE_URL` (default `http://localhost:4000/api`). Run `npm ci`, `npm run db:migrate`, `npm run build`, then start the API with `node apps/api/dist/server.js` and web with `npm run dev --workspace=@construction-os/web`.

To create the first administrator, set `ADMIN_EMAIL`, `ADMIN_NAME`, and `ADMIN_PASSWORD` (12+ characters), then run `npm run admin:create`. The command refuses to overwrite an existing account.

CI runs the database migration, type checks, builds, and HTTP integration tests with a temporary PostgreSQL service.
