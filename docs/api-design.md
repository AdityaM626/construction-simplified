# Construction OS — API Design Specification

## Authentication Endpoints (`/api/auth`)
- `POST /api/auth/register` — Register a user with selected role (HOMEOWNER, BUILDER, DEALER).
- `POST /api/auth/login` — Authenticate user and return JWT bearer token.
- `GET /api/auth/me` — Return current logged-in user session profile.

## Homeowner Projects Endpoints (`/api/projects`)
- `GET /api/projects` — List homeowner projects.
- `POST /api/projects` — Create new project (Name, Location, Budget, Timeline).
- `GET /api/projects/:id` — Get project detailed state (Budget, Milestones, Site Updates).
- `GET /api/projects/:id/budget` — Detailed budget ledger (Spent, Committed, Remaining).

## Builders Endpoints (`/api/builders`)
- `GET /api/builders` — Search & filter verified builders (Location, Rating, Type).
- `GET /api/builders/:id` — Detailed builder profile, portfolio, verification badge.
- `POST /api/builders/:id/quote-request` — Submit estimate request for project.

## Material Marketplace Endpoints (`/api/products` & `/api/orders`)
- `GET /api/products` — Filter products by category, price, brand, stock.
- `GET /api/products/compare` — Compare selected products across specs, price, MOQ, ETA.
- `POST /api/orders` — Create material order request for project.
- `GET /api/orders` — List user order requests.
- `PATCH /api/orders/:id/status` — Dealer accept/reject/update order status.

## Milestones & Site Updates Endpoints (`/api/projects/:id/milestones`)
- `GET /api/projects/:id/milestones` — List project milestones & completion state.
- `POST /api/projects/:id/site-updates` — Builder post site photo update with completion %.

## Admin Endpoints (`/api/admin`)
- `GET /api/admin/verifications` — List pending builder & dealer verification applications.
- `POST /api/admin/verifications/:id` — Approve or reject user verification.
- `GET /api/admin/audit-logs` — Query system audit log events.
