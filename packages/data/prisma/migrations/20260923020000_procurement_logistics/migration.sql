-- Extend existing material requirements with a BOQ link and delivery target.
ALTER TABLE "MaterialRequest"
  ADD COLUMN "boqItemId" UUID,
  ADD COLUMN "neededBy" DATE,
  ADD COLUMN "notes" TEXT;

CREATE UNIQUE INDEX "MaterialRequest_boqItemId_key" ON "MaterialRequest"("boqItemId");

ALTER TABLE "MaterialRequest"
  ADD CONSTRAINT "MaterialRequest_boqItemId_fkey"
  FOREIGN KEY ("boqItemId") REFERENCES "BOQItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Suppliers are project business records; they do not authenticate as users.
CREATE TABLE "Vendor" (
  "id" UUID NOT NULL,
  "projectId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "contactName" TEXT,
  "email" TEXT,
  "phone" TEXT,
  "taxId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Vendor_projectId_name_key" ON "Vendor"("projectId", "name");
CREATE INDEX "Vendor_projectId_idx" ON "Vendor"("projectId");
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Quotation" (
  "id" UUID NOT NULL,
  "projectId" UUID NOT NULL,
  "requestId" UUID NOT NULL,
  "vendorId" UUID NOT NULL,
  "unitPrice" DECIMAL(14,2) NOT NULL,
  "leadTimeDays" INTEGER NOT NULL,
  "validUntil" DATE,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Quotation_requestId_vendorId_key" ON "Quotation"("requestId", "vendorId");
CREATE INDEX "Quotation_projectId_requestId_idx" ON "Quotation"("projectId", "requestId");
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_requestId_fkey"
  FOREIGN KEY ("requestId") REFERENCES "MaterialRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_vendorId_fkey"
  FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TYPE "PurchaseOrderStatus" AS ENUM
  ('ISSUED', 'DISPATCHED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'EXCEPTION');

CREATE TABLE "PurchaseOrder" (
  "id" UUID NOT NULL,
  "projectId" UUID NOT NULL,
  "requestId" UUID NOT NULL,
  "quotationId" UUID NOT NULL,
  "vendorId" UUID NOT NULL,
  "quantity" DECIMAL(14,3) NOT NULL,
  "unitPrice" DECIMAL(14,2) NOT NULL,
  "acceptedQuantity" DECIMAL(14,3) NOT NULL DEFAULT 0,
  "damagedQuantity" DECIMAL(14,3) NOT NULL DEFAULT 0,
  "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'ISSUED',
  "expectedDate" DATE,
  "trackingReference" TEXT,
  "issuedById" UUID NOT NULL,
  "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dispatchedAt" TIMESTAMP(3),
  "receivedAt" TIMESTAMP(3),
  CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PurchaseOrder_requestId_key" ON "PurchaseOrder"("requestId");
CREATE UNIQUE INDEX "PurchaseOrder_quotationId_key" ON "PurchaseOrder"("quotationId");
CREATE INDEX "PurchaseOrder_projectId_status_idx" ON "PurchaseOrder"("projectId", "status");
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_requestId_fkey"
  FOREIGN KEY ("requestId") REFERENCES "MaterialRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_quotationId_fkey"
  FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_vendorId_fkey"
  FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "GoodsReceipt" (
  "id" UUID NOT NULL,
  "projectId" UUID NOT NULL,
  "purchaseOrderId" UUID NOT NULL,
  "acceptedQuantity" DECIMAL(14,3) NOT NULL,
  "damagedQuantity" DECIMAL(14,3) NOT NULL DEFAULT 0,
  "finalDelivery" BOOLEAN NOT NULL,
  "evidenceReference" TEXT,
  "notes" TEXT,
  "recordedById" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GoodsReceipt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "GoodsReceipt_projectId_createdAt_idx" ON "GoodsReceipt"("projectId", "createdAt");
CREATE INDEX "GoodsReceipt_purchaseOrderId_idx" ON "GoodsReceipt"("purchaseOrderId");
ALTER TABLE "GoodsReceipt" ADD CONSTRAINT "GoodsReceipt_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GoodsReceipt" ADD CONSTRAINT "GoodsReceipt_purchaseOrderId_fkey"
  FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
