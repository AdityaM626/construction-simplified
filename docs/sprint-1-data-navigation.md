# Sprint 1 — data and navigation

The first PostgreSQL schema models the four product roles, project membership, milestones, BOQ items, change orders, site reports, defects, documents, and audit events. Money uses fixed-precision decimals. The migration under `packages/data/prisma/migrations` is generated from the schema and checked against a temporary PostgreSQL service in CI.

Run `npm run db:migrate` with a valid `DATABASE_URL` to apply this migration in a development environment. No live database or production data was available for a migration run. The existing JSON seed file is demo data: its users have no password hashes, so it is not imported as production accounts. Sprint 2 will cut the API over to PostgreSQL and controlled account provisioning.

The homeowner, builder/contractor, and admin navigation now groups existing screens by the work each persona does. Desktop and mobile use one navigation definition, with no hard-coded action counts. The procurement workspace will be added when Sprint 2 introduces its authenticated role and project membership.
