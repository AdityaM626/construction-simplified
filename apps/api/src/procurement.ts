import type { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import type { PrismaClient } from '@construction-os/data';

type Role = 'HOMEOWNER' | 'BUILDER' | 'PROCUREMENT' | 'ADMIN';
type AuthedRequest = Request & { account?: { id: string; role: Role } };
type Handler = (req: AuthedRequest, res: Response) => Promise<unknown>;

class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

const route = (handler: Handler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handler(req as AuthedRequest, res)).catch(error => {
    if (error instanceof HttpError) return res.status(error.status).json({ error: error.message });
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return res.status(409).json({ error: 'This record already exists' });
    }
    next(error);
  });
};
const text = (value: unknown, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const quantity = (value: unknown, allowZero = false) => {
  const raw = String(value ?? '');
  return /^\d{1,11}(?:\.\d{1,3})?$/.test(raw) && (allowZero ? Number(raw) >= 0 : Number(raw) > 0) ? raw : null;
};
const money = (value: unknown) => {
  const raw = String(value ?? '');
  return /^\d{1,11}(?:\.\d{1,2})?$/.test(raw) && Number(raw) > 0 ? raw : null;
};
const requireRole = (req: AuthedRequest, roles: Role[]) => {
  if (!roles.includes(req.account!.role)) throw new HttpError(403, 'This action is not available to your role');
};
const audit = (tx: Pick<PrismaClient, 'auditEvent'>, projectId: string, actorId: string, action: string, entityId: string) =>
  tx.auditEvent.create({ data: { projectId, actorId, action, entityId } });
const isConflict = (error: unknown) => typeof error === 'object' && error !== null &&
  'code' in error && error.code === 'P2034';

async function retrySerializable<T>(work: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try { return await work(); }
    catch (error) {
      if (!isConflict(error)) throw error;
      if (attempt === 2) throw new HttpError(409, 'Concurrent update; refresh and try again');
    }
  }
  throw new HttpError(409, 'Concurrent update; refresh and try again');
}

export function registerProcurement(
  app: Express, prisma: PrismaClient, authenticate: RequestHandler, projectAccess: RequestHandler
) {
  app.get('/api/projects/:id/vendors', authenticate, projectAccess, route(async (req, res) => {
    return res.json(await prisma.vendor.findMany({ where: { projectId: req.params.id }, orderBy: { name: 'asc' } }));
  }));

  app.post('/api/projects/:id/vendors', authenticate, projectAccess, route(async (req, res) => {
    requireRole(req, ['PROCUREMENT', 'ADMIN']);
    const name = text(req.body.name, 160);
    const email = text(req.body.email, 254);
    if (!name || (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))) {
      throw new HttpError(400, 'Vendor name and a valid contact email are required');
    }
    const vendor = await prisma.$transaction(async tx => {
      const created = await tx.vendor.create({ data: {
        projectId: req.params.id, name, contactName: text(req.body.contactName, 160) || null,
        email: email || null, phone: text(req.body.phone, 40) || null, taxId: text(req.body.taxId, 40) || null
      } });
      await audit(tx, req.params.id, req.account!.id, 'VENDOR_RECORDED', created.id);
      return created;
    });
    return res.status(201).json(vendor);
  }));

  app.get('/api/projects/:id/material-requests/:requestId/quotations',
    authenticate, projectAccess, route(async (req, res) => {
      const request = await prisma.materialRequest.findFirst({ where: {
        id: req.params.requestId, projectId: req.params.id
      } });
      if (!request) throw new HttpError(404, 'Material request not found');
      return res.json(await prisma.quotation.findMany({ where: {
        projectId: req.params.id, requestId: request.id
      }, include: { vendor: { select: { id: true, name: true } } }, orderBy: { unitPrice: 'asc' } }));
    }));

  app.post('/api/projects/:id/material-requests/:requestId/quotations',
    authenticate, projectAccess, route(async (req, res) => {
      requireRole(req, ['PROCUREMENT', 'ADMIN']);
      const request = await prisma.materialRequest.findFirst({ where: {
        id: req.params.requestId, projectId: req.params.id
      }, include: { purchaseOrder: { select: { id: true } } } });
      if (!request) throw new HttpError(404, 'Material request not found');
      if (request.status !== 'ACCEPTED' || request.purchaseOrder) throw new HttpError(409, 'Request is not open for quotations');
      const vendor = await prisma.vendor.findFirst({ where: {
        id: req.body.vendorId, projectId: req.params.id
      } });
      if (!vendor) throw new HttpError(404, 'Vendor not found in this project');
      const unitPrice = money(req.body.unitPrice);
      const leadTimeDays = Number(req.body.leadTimeDays);
      const validUntil = req.body.validUntil ? new Date(req.body.validUntil) : null;
      if (!unitPrice || !Number.isInteger(leadTimeDays) || leadTimeDays < 0 || leadTimeDays > 365 ||
          (validUntil && !Number.isFinite(validUntil.getTime()))) {
        throw new HttpError(400, 'Valid unit price, lead time and optional validity date are required');
      }
      const quotation = await prisma.$transaction(async tx => {
        const created = await tx.quotation.create({ data: {
          projectId: req.params.id, requestId: request.id, vendorId: vendor.id,
          unitPrice, leadTimeDays, validUntil, notes: text(req.body.notes, 2000) || null
        } });
        await audit(tx, req.params.id, req.account!.id, 'QUOTATION_RECORDED', created.id);
        return created;
      });
      return res.status(201).json(quotation);
    }));

  app.get('/api/projects/:id/purchase-orders', authenticate, projectAccess, route(async (req, res) => {
    return res.json(await prisma.purchaseOrder.findMany({ where: { projectId: req.params.id },
      include: { vendor: { select: { id: true, name: true } }, request: { select: {
        id: true, itemName: true, unit: true, boqItemId: true
      } }, receipts: { orderBy: { createdAt: 'desc' } } }, orderBy: { issuedAt: 'desc' } }));
  }));

  app.post('/api/projects/:id/material-requests/:requestId/purchase-order',
    authenticate, projectAccess, route(async (req, res) => {
      requireRole(req, ['PROCUREMENT', 'ADMIN']);
      const order = await retrySerializable(() => prisma.$transaction(async tx => {
        const request = await tx.materialRequest.findFirst({ where: {
          id: req.params.requestId, projectId: req.params.id
        }, include: { purchaseOrder: { select: { id: true } } } });
        if (!request) throw new HttpError(404, 'Material request not found');
        if (request.status !== 'ACCEPTED' || request.purchaseOrder) throw new HttpError(409, 'Request already ordered or not accepted');
        const quote = await tx.quotation.findFirst({ where: {
          id: req.body.quotationId, requestId: request.id, projectId: req.params.id
        } });
        if (!quote) throw new HttpError(404, 'Quotation not found for this request');
        if (quote.validUntil && quote.validUntil.getTime() < Date.now() - 86400000) {
          throw new HttpError(409, 'Quotation has expired');
        }
        const project = await tx.project.findUniqueOrThrow({ where: { id: req.params.id } });
        const orders = await tx.purchaseOrder.findMany({ where: { projectId: req.params.id },
          select: { quantity: true, unitPrice: true } });
        const committed = orders.reduce((sum, existing) =>
          sum.plus(existing.quantity.mul(existing.unitPrice)), project.totalBudget.mul(0));
        const nextCommitment = request.quantity.mul(quote.unitPrice);
        if (committed.plus(nextCommitment).gt(project.totalBudget)) {
          throw new HttpError(409, 'Purchase order would exceed the project budget');
        }
        const expectedDate = new Date(Date.now() + quote.leadTimeDays * 86400000);
        const created = await tx.purchaseOrder.create({ data: {
          projectId: req.params.id, requestId: request.id, quotationId: quote.id,
          vendorId: quote.vendorId, quantity: request.quantity, unitPrice: quote.unitPrice,
          expectedDate, issuedById: req.account!.id
        } });
        await audit(tx, req.params.id, req.account!.id, 'PURCHASE_ORDER_ISSUED', created.id);
        return created;
      }, { isolationLevel: 'Serializable' }));
      return res.status(201).json(order);
    }));

  app.post('/api/projects/:id/purchase-orders/:orderId/dispatch',
    authenticate, projectAccess, route(async (req, res) => {
      requireRole(req, ['PROCUREMENT', 'ADMIN']);
      const trackingReference = text(req.body.trackingReference, 200);
      if (!trackingReference) throw new HttpError(400, 'Tracking reference is required');
      const updated = await prisma.$transaction(async tx => {
        const order = await tx.purchaseOrder.findFirst({ where: {
          id: req.params.orderId, projectId: req.params.id
        } });
        if (!order) throw new HttpError(404, 'Purchase order not found');
        const changed = await tx.purchaseOrder.updateMany({ where: {
          id: order.id, projectId: req.params.id, status: 'ISSUED'
        }, data: { status: 'DISPATCHED', trackingReference, dispatchedAt: new Date() } });
        if (changed.count !== 1) throw new HttpError(409, 'Purchase order was already dispatched');
        await tx.materialRequest.update({ where: { id: order.requestId }, data: { status: 'DISPATCHED' } });
        await audit(tx, req.params.id, req.account!.id, 'PURCHASE_ORDER_DISPATCHED', order.id);
        return tx.purchaseOrder.findUniqueOrThrow({ where: { id: order.id } });
      });
      return res.json(updated);
    }));

  app.post('/api/projects/:id/purchase-orders/:orderId/receipts',
    authenticate, projectAccess, route(async (req, res) => {
      requireRole(req, ['BUILDER', 'ADMIN']);
      const acceptedQuantity = quantity(req.body.acceptedQuantity, true);
      const damagedQuantity = quantity(req.body.damagedQuantity ?? '0', true);
      const evidenceReference = text(req.body.evidenceReference, 500);
      const finalDelivery = req.body.finalDelivery;
      if (acceptedQuantity === null || damagedQuantity === null ||
          Number(acceptedQuantity) + Number(damagedQuantity) <= 0 ||
          typeof finalDelivery !== 'boolean' || !evidenceReference) {
        throw new HttpError(400, 'Accepted/damaged quantities, final-delivery flag and evidence reference are required');
      }
      const receipt = await retrySerializable(() => prisma.$transaction(async tx => {
        const order = await tx.purchaseOrder.findFirst({ where: {
          id: req.params.orderId, projectId: req.params.id
        } });
        if (!order) throw new HttpError(404, 'Purchase order not found');
        if (!['DISPATCHED', 'PARTIALLY_RECEIVED'].includes(order.status)) {
          throw new HttpError(409, 'Purchase order is not awaiting site receipt');
        }
        const accepted = order.acceptedQuantity.plus(acceptedQuantity);
        const damaged = order.damagedQuantity.plus(damagedQuantity);
        if (accepted.plus(damaged).gt(order.quantity)) {
          throw new HttpError(400, 'Receipt exceeds ordered quantity');
        }
        const status = finalDelivery
          ? (accepted.eq(order.quantity) && damaged.eq(0) ? 'RECEIVED' : 'EXCEPTION')
          : 'PARTIALLY_RECEIVED';
        const created = await tx.goodsReceipt.create({ data: {
          projectId: req.params.id, purchaseOrderId: order.id,
          acceptedQuantity, damagedQuantity, finalDelivery, evidenceReference,
          notes: text(req.body.notes, 2000) || null, recordedById: req.account!.id
        } });
        await tx.purchaseOrder.update({ where: { id: order.id }, data: {
          acceptedQuantity: accepted, damagedQuantity: damaged, status,
          receivedAt: finalDelivery ? new Date() : null
        } });
        if (status === 'RECEIVED') {
          await tx.materialRequest.update({ where: { id: order.requestId }, data: { status: 'DELIVERED' } });
        }
        await audit(tx, req.params.id, req.account!.id,
          status === 'EXCEPTION' ? 'GOODS_RECEIPT_EXCEPTION' : 'GOODS_RECEIVED', created.id);
        return created;
      }, { isolationLevel: 'Serializable' }));
      return res.status(201).json(receipt);
    }));

  app.get('/api/projects/:id/procurement-summary', authenticate, projectAccess, route(async (req, res) => {
    const [project, orders] = await Promise.all([
      prisma.project.findUniqueOrThrow({ where: { id: req.params.id } }),
      prisma.purchaseOrder.findMany({ where: { projectId: req.params.id },
        select: { quantity: true, unitPrice: true, acceptedQuantity: true, status: true, expectedDate: true } })
    ]);
    const zero = project.totalBudget.mul(0);
    const committed = orders.reduce((sum, order) => sum.plus(order.quantity.mul(order.unitPrice)), zero);
    const receivedValue = orders.reduce((sum, order) => sum.plus(order.acceptedQuantity.mul(order.unitPrice)), zero);
    return res.json({
      projectBudget: project.totalBudget.toString(),
      committed: committed.toString(),
      receivedValue: receivedValue.toString(),
      remainingAfterCommitments: project.totalBudget.minus(committed).toString(),
      openOrders: orders.filter(order => !['RECEIVED', 'EXCEPTION'].includes(order.status)).length,
      exceptions: orders.filter(order => order.status === 'EXCEPTION').length,
      overdue: orders.filter(order => order.expectedDate && order.expectedDate < new Date() &&
        !['RECEIVED', 'EXCEPTION'].includes(order.status)).length
    });
  }));
}
