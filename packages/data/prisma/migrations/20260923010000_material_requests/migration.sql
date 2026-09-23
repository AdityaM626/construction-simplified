-- CreateEnum
CREATE TYPE "MaterialRequestStatus" AS ENUM ('REQUESTED', 'ACCEPTED', 'DISPATCHED', 'DELIVERED');

-- CreateTable
CREATE TABLE "MaterialRequest" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantity" DECIMAL(14,3) NOT NULL,
    "unit" TEXT NOT NULL,
    "status" "MaterialRequestStatus" NOT NULL DEFAULT 'REQUESTED',
    "requestedById" UUID NOT NULL,
    "handledById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaterialRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MaterialRequest_projectId_status_idx" ON "MaterialRequest"("projectId", "status");

-- AddForeignKey
ALTER TABLE "MaterialRequest" ADD CONSTRAINT "MaterialRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
