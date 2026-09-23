# Sprint 0 foundation

The product scope has four personas: **HOMEOWNER**, **BUILDER / CONTRACTOR**, **PROCUREMENT / LOGISTICS**, and **ADMIN**. `ProductPersona` records this target scope. The current `UserRole` and demo UI retain a legacy `DEALER` role until Sprint 2 changes authentication and project membership. Vendors remain business records, not a fifth platform persona.

## Implemented here

- Ignore local dependencies, build output, uploads, logs, and runtime data; remove previously committed copies from this branch.
- Build packages in dependency order with output outside `src/`.
- Run TypeScript checks, the existing seed-data test, and a project-access boundary test in CI.
- Deny unsupported roles in the existing project access middleware. Procurement users must not inherit homeowner or builder project access before a membership model exists.

## Still planned

The demo still permits role switching and has legacy dealer views and data structures. Sprint 2 must replace public role selection with controlled account provisioning, real project membership, and consistent object-level authorization across every endpoint. Existing authentication and storage behavior should not be treated as production ready. The current tests cover the project route boundary only; wider API authorization remains to be reviewed. A dedicated lint configuration should be added after choosing and locking the project-wide TypeScript lint rules.
