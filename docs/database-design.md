# Construction OS — Database Design Specification

## Entity Relationship Overview
```
[User] (1:1) ---> [HomeownerProfile / BuilderProfile / DealerProfile]
  |
  +---> (1:N) ---> [Project] (1:N) ---> [Milestone] (1:N) ---> [SiteUpdate]
  |                   |
  |                   +---> (1:N) ---> [QuoteRequest]
  |                   |
  |                   +---> (1:N) ---> [Document]
  |                   |
  |                   +---> (1:N) ---> [OrderRequest] (1:N) ---> [OrderItem]
  |                                       |
  +---> (1:N) ---> [AuditEvent]           +---> [DealerProfile]
```

## Core Table Schemas

### Users Table (`users`)
- `id` (String, PK)
- `email` (String, Unique)
- `passwordHash` (String)
- `fullName` (String)
- `phone` (String)
- `role` (Enum: HOMEOWNER, BUILDER, DEALER, ADMIN)
- `isVerified` (Boolean)
- `createdAt`, `updatedAt`

### Builder Profiles Table (`builder_profiles`)
- `id` (PK), `userId` (FK -> users.id)
- `companyName` (String)
- `experienceYears` (Int)
- `serviceArea` (String)
- `verificationStatus` (Enum: PENDING, VERIFIED, REJECTED)
- `portfolioJson` (String / JSON)
- `rating` (Float)

### Dealer Profiles Table (`dealer_profiles`)
- `id` (PK), `userId` (FK -> users.id)
- `businessName` (String)
- `gstNumber` (String)
- `serviceRadiusKm` (Int)
- `verificationStatus` (Enum: PENDING, VERIFIED, REJECTED)

### Projects Table (`projects`)
- `id` (PK), `homeownerId` (FK -> users.id), `builderId` (FK -> users.id, Optional)
- `name` (String), `type` (Enum: NEW_CONSTRUCTION, RENOVATION, EXTENSION)
- `location` (String), `plotAreaSqFt` (Float)
- `totalBudget` (Float), `spentCost` (Float), `committedCost` (Float)
- `targetCompletionDate` (String)
- `status` (Enum: PLANNING, IN_PROGRESS, COMPLETED, ON_HOLD)

### Products Table (`products`)
- `id` (PK), `dealerId` (FK -> dealer_profiles.id)
- `name` (String), `category` (Enum: CEMENT, STEEL, BRICKS, TILES, ELECTRICAL, PLUMBING, SANITARYWARE, PAINT, HARDWARE)
- `brand` (String), `specifications` (String), `unit` (String)
- `unitPrice` (Float), `stockQty` (Int), `moq` (Int), `deliveryEtaDays` (Int)

### Order Requests Table (`order_requests`)
- `id` (PK), `projectId` (FK -> projects.id), `dealerId` (FK -> dealer_profiles.id)
- `totalAmount` (Float), `status` (Enum: REQUESTED, ACCEPTED, REJECTED, PROCESSING, DELIVERED, CANCELLED)

### Audit Events Table (`audit_events`)
- `id` (PK), `actorId` (FK -> users.id), `actorRole` (String), `action` (String), `entity` (String), `entityId` (String), `metadata` (JSON), `createdAt`
