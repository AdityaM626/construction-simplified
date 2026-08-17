# Construction OS — User Roles & RBAC Matrix

## Role Definitions

### 1. Homeowner (`HOMEOWNER`)
Central customer building or renovating property.
- **Permissions**: Full read/write on own projects, budget, material orders, document vault; view verified builders; submit estimate requests; review milestone site photos.

### 2. Builder / Contractor (`BUILDER`)
Professional contractor executing construction projects.
- **Permissions**: Manage assigned projects; submit quote proposals; update project milestones and upload site photo updates; manage worker tasks; request verification.

### 3. Material Dealer / Shopkeeper (`DEALER`)
Supplier of building materials and finishing supplies.
- **Permissions**: Manage product catalog & inventory; set pricing, pack sizes, delivery ETAs; receive material order requests; accept or reject requests; issue delivery updates.

### 4. Admin / Operations (`ADMIN`)
Platform administrator and ops team member.
- **Permissions**: Review and approve/reject builder and dealer verification applications; moderate product listings; monitor system orders & disputes; inspect full system audit logs.

## Permission Enforcement Architecture
Authorization is enforced at both API route middleware and database query scopes:
- API endpoint checks JWT payload role.
- Resource ownership validation checks `userId === project.homeownerId` or `userId === builder.userId`.
