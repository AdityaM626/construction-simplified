# Construction OS — User Roles & RBAC Matrix

## Product Personas

Construction OS production v1 is designed around four primary user groups:

1. Homeowners
2. Builders / Contractors
3. Procurement & Logistics
4. Platform Administrators

Suppliers and vendors are business entities managed inside procurement workflows; they are not required to be authenticated platform users.

## Role Definitions

### 1. Homeowner (`HOMEOWNER`)
Central customer building or renovating a property.

**Primary responsibilities**
- View project health, schedule, budget and progress.
- Review BOQ, milestones, site updates, defects and documents.
- Approve change orders and milestone/payment gates where required.
- Verify defect remediation and project handover.

**Access boundary**
- May access only projects they own or have explicitly been granted access to.

### 2. Builder / Contractor (`BUILDER`)
Professional contractor responsible for project execution.

**Primary responsibilities**
- Manage assigned projects and milestones.
- Maintain BOQ and cost-control information.
- Submit daily site reports and progress evidence.
- Raise procurement requirements and change requests.
- Manage quality issues, defects and construction-team activity.

**Access boundary**
- May access only projects assigned to their organization or user account.

### 3. Procurement & Logistics (`PROCUREMENT`)
Operations users responsible for sourcing and delivery execution.

**Primary responsibilities**
- Receive material requirements from approved BOQ/project needs.
- Maintain vendor records, quotations and sourcing decisions.
- Create and track purchase orders.
- Coordinate dispatch, transport and delivery.
- Record site receipt, shortage, damage and delivery exceptions.
- Maintain material traceability back to project and BOQ items.

**Access boundary**
- May access procurement and logistics data only for projects explicitly assigned to their organization/team.

### 4. Platform Administrator (`ADMIN`)
Platform operations and governance users.

**Primary responsibilities**
- Manage users, organizations and project access.
- Verify builders/contractors where required.
- Review audit and security events.
- Handle support, disputes and operational exceptions.
- Configure platform-level policies.

**Access boundary**
- Administrative access is privileged, audited and should be granted only through controlled internal workflows.

## Authorization Model

Production authorization must combine role checks with object-level access control.

Examples:
- `HOMEOWNER` can approve a change order only for an owned project.
- `BUILDER` can edit BOQ data only for an assigned project.
- `PROCUREMENT` can update deliveries only for an assigned project/procurement scope.
- `ADMIN` actions are audited and never self-provisioned through public registration.

Longer term, permissions should be expressed explicitly (for example `BOQ_EDIT`, `CHANGE_ORDER_APPROVE`, `DELIVERY_UPDATE`) instead of relying only on role strings.
