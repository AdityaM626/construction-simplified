# Sprint 3: project workflows

Authenticated project members can view shared BOQ items, milestones, change orders, daily site reports, defects, material requests, document records, and recent activity. Every endpoint checks membership for the project ID in its URL. The workspace exposes actions only to the relevant role, and the API repeats those checks.

- Builders create BOQ items, milestones, site reports, and material requests. They submit completed milestones and mark defects resolved.
- Homeowners approve submitted milestones, decide change orders, and verify resolved defects. Milestone approval records the decision; it does **not** disburse money. Approved change orders adjust the project budget.
- Procurement/logistics members advance material requests from requested to accepted, dispatched, and delivered.
- Homeowners and builders can raise defects and change orders. Any member can record a document reference. The document form stores metadata and an external reference; it does **not** upload a file.
- Administrators may access all projects and perform workflow actions.

State transitions reject repeated or out-of-order decisions. Audit events record the actor and action. The new material request table is added by the second PostgreSQL migration. CI tests the full workflow against PostgreSQL.

The UI keeps the older static demo components in source as reference, but they are not mounted in the live workspace. Payments, notifications, binary document storage, and historical JSON seed migration are outside these three sprints.
