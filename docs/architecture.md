# Construction OS — Architecture Specification

## 1. System Overview
Construction OS is a multi-role, domain-driven platform engineered to bring transparency, trust, and simplicity to residential and commercial construction projects. 

### High-Level Architecture Diagram
```
                     +---------------------------------------------+
                     |         Clients (Web & Mobile Apps)         |
                     |  Homeowner | Builder | Dealer | Admin Apps  |
                     +----------------------+----------------------+
                                            |
                                    HTTPS / REST API
                                            |
                     +----------------------+----------------------+
                     |               API Gateway / Express         |
                     |  Auth | RBAC | Rate Limit | Logging | Router|
                     +----------------------+----------------------+
                                            |
         +----------------------------------+----------------------------------+
         |                                  |                                  |
+--------+--------+                +--------+--------+                +--------+--------+
| Project Domain  |                | Material Domain |                | Auth & Security |
| Projects,       |                | Catalog, Specs, |                | JWT, RBAC,      |
| Milestones,     |                | Dealer Inventory|                | Audit Logs,     |
| Site Updates    |                | & Comparison    |                | Permissions     |
+--------+--------+                +--------+--------+                +--------+--------+
         |                                  |                                  |
         +----------------------------------+----------------------------------+
                                            |
                                 ORM Layer (Prisma)
                                            |
                     +----------------------+----------------------+
                     |          Database (SQLite / Postgres)        |
                     +---------------------------------------------+
```

## 2. Component Boundaries
1. **Frontend Layer (`apps/web`)**: React + TypeScript single-page application and responsive mobile app container supporting dynamic viewports, bottom navigation for mobile, sidebar for desktop, and role-specific dashboards.
2. **Backend API Layer (`apps/api`)**: Node.js + Express REST API providing authenticated routes, role-based access control, file storage handlers, and transaction processing.
3. **Database Layer (`packages/db`)**: SQLite with Prisma ORM for explicit relational schema definition, strict type generation, zero-downtime migrations, and seeding capabilities.
4. **Shared Types (`packages/types`)**: Centralized TypeScript data models shared across API and Frontend to prevent contract drift.
5. **Admin Operations Portal (`apps/admin`)**: Operations suite for user verification, builder/dealer approval queues, product moderation, and audit review.

## 3. Data Flow Strategy
- **Client State**: Server state managed via standardized REST fetch hooks; local UI state held in React context and local component state.
- **Auditing**: Every critical financial mutation, milestone verification, or user privilege change emits a persistent `AuditEvent` record.
