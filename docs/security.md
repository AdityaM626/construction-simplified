# Construction OS — Security Architecture Specification

## 1. Authentication & Token Policy
- Password storage utilizes `bcrypt` with salt rounds >= 10.
- JWT tokens signed with SHA-256 secrets, configured with 24-hour expiration.
- Auth endpoints implement IP rate limiting to prevent brute-force attacks.

## 2. Role-Based Access Control (RBAC)
- Access policy matrix enforced by backend API middleware `requireRole(...)`.
- Strict object-level ownership authorization preventing horizontal privilege escalation (e.g. Homeowner A cannot view Homeowner B's private project documents).

## 3. Data Protection & Auditing
- Sensitive credentials stripped from all response serializers.
- SQL injection prevented through Prisma parameterized query interface.
- Audit Trail: Immutable logging of security-critical actions into `audit_events`.

## 4. File Security
- Private document vault prevents unauthorized public access.
- Upload type validation restricts permissible file extensions (PDF, PNG, JPG, CAD).
