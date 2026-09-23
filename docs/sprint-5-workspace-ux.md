# Sprint 5: live project workspace

The authenticated workspace now opens on a role-aware overview rather than a generic BOQ list. The overview is backed by `GET /api/projects/:id/workspace-overview`, which requires a valid session and project access. It summarizes completed milestones, BOQ items, open defects, project budget and purchase-order commitments. It also shows the five most recent project activity events.

The attention queue only includes actions relevant to the signed-in persona. Homeowners see milestone approvals, change-order decisions, defect verification and delivery exceptions. Builders see active milestones, open defects, deliveries to inspect and exceptions. Procurement sees requests to accept or source, orders to dispatch and exceptions. Administrators see all applicable queues. Each card opens the related live workflow. Empty, loading, error and refresh states are shown explicitly.

The workflow navigation puts relevant sections first for each persona while retaining read access to all project records. Counts are scoped to one project and are recalculated from PostgreSQL on each overview request. The budget figure is purchase commitments, not payments or cash remaining. This sprint does not add notifications or background polling.

CI tests project-access denial, role-specific attention queues, overview metrics and activity alongside the existing HTTP workflow suite.
