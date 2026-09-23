import type { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import type { PrismaClient } from '@construction-os/data';

type Actor = { id: string; role: 'HOMEOWNER' | 'BUILDER' | 'PROCUREMENT' | 'ADMIN' };
type AuthedRequest = Request & { account?: Actor };
type Handler = (req: AuthedRequest, res: Response) => Promise<unknown>;
const route = (handler: Handler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handler(req as AuthedRequest, res)).catch(next);
};
const text = (value: unknown, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const decimal = (value: unknown, scale = 2) => {
  const raw = String(value ?? '');
  return new RegExp(`^\\d{1,12}(?:\\.\\d{1,${scale}})?$`).test(raw) && Number(raw) > 0 ? raw : null;
};
const signedMoney = (value: unknown) => {
  const raw = String(value ?? '');
  return /^-?\d{1,12}(?:\.\d{1,2})?$/.test(raw) ? raw : null;
};
const authorized = (req: AuthedRequest, res: Response, roles: Actor['role'][]) => {
  if (roles.includes(req.account!.role)) return true;
  res.status(403).json({ error: 'This action is not available to your role' });
  return false;
};

export function registerWorkflows(
  app: Express, prisma: PrismaClient, authenticate: RequestHandler, projectAccess: RequestHandler
) {
  const audit = (projectId: string, actorId: string, action: string, entityId: string) =>
    prisma.auditEvent.create({ data: { projectId, actorId, action, entityId } });

  app.get('/api/projects/:id/boq', authenticate, projectAccess, route(async (req, res) => {
    return res.json(await prisma.bOQItem.findMany({ where: { projectId: req.params.id }, orderBy: { createdAt: 'desc' } }));
  }));
  app.post('/api/projects/:id/boq', authenticate, projectAccess, route(async (req, res) => {
    if (!authorized(req, res, ['BUILDER', 'ADMIN'])) return;
    const description = text(req.body.description);
    const category = text(req.body.category, 80);
    const unit = text(req.body.unit, 30);
    const quantity = decimal(req.body.quantity, 3);
    const estimatedRate = decimal(req.body.estimatedRate);
    if (!description || !category || !unit || !quantity || !estimatedRate) return res.status(400).json({ error: 'Valid BOQ item details are required' });
    const item = await prisma.bOQItem.create({ data: {
      projectId: req.params.id, description, category, unit, quantity, estimatedRate
    } });
    await audit(req.params.id, req.account!.id, 'BOQ_ITEM_CREATED', item.id);
    return res.status(201).json(item);
  }));

  app.get('/api/projects/:id/milestones', authenticate, projectAccess, route(async (req, res) => {
    return res.json(await prisma.milestone.findMany({ where: { projectId: req.params.id }, orderBy: { plannedEndDate: 'asc' } }));
  }));
  app.post('/api/projects/:id/milestones', authenticate, projectAccess, route(async (req, res) => {
    if (!authorized(req, res, ['BUILDER', 'ADMIN'])) return;
    const title = text(req.body.title);
    const allocatedBudget = decimal(req.body.allocatedBudget);
    const plannedEndDate = new Date(req.body.plannedEndDate);
    if (!title || !allocatedBudget || !Number.isFinite(plannedEndDate.getTime())) return res.status(400).json({ error: 'Valid milestone details are required' });
    const milestone = await prisma.milestone.create({ data: {
      projectId: req.params.id, title, allocatedBudget, plannedEndDate
    } });
    await audit(req.params.id, req.account!.id, 'MILESTONE_CREATED', milestone.id);
    return res.status(201).json(milestone);
  }));
  app.post('/api/projects/:id/milestones/:milestoneId/submit', authenticate, projectAccess, route(async (req, res) => {
    if (!authorized(req, res, ['BUILDER', 'ADMIN'])) return;
    const milestone = await prisma.milestone.findFirst({ where: { id: req.params.milestoneId, projectId: req.params.id } });
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });
    if (milestone.status !== 'NOT_STARTED' && milestone.status !== 'IN_PROGRESS') return res.status(409).json({ error: 'Milestone cannot be submitted again' });
    const changed = await prisma.milestone.updateMany({ where: {
      id: milestone.id, projectId: req.params.id, status: { in: ['NOT_STARTED', 'IN_PROGRESS'] }
    }, data: { status: 'AWAITING_APPROVAL', completedAt: new Date() } });
    if (changed.count !== 1) return res.status(409).json({ error: 'Milestone was already submitted' });
    const updated = await prisma.milestone.findUniqueOrThrow({ where: { id: milestone.id } });
    await audit(req.params.id, req.account!.id, 'MILESTONE_SUBMITTED', milestone.id);
    return res.json(updated);
  }));
  app.post('/api/projects/:id/milestones/:milestoneId/approve', authenticate, projectAccess, route(async (req, res) => {
    if (!authorized(req, res, ['HOMEOWNER', 'ADMIN'])) return;
    const milestone = await prisma.milestone.findFirst({ where: { id: req.params.milestoneId, projectId: req.params.id } });
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });
    if (milestone.status !== 'AWAITING_APPROVAL') return res.status(409).json({ error: 'Milestone is not awaiting approval' });
    const changed = await prisma.milestone.updateMany({ where: {
      id: milestone.id, projectId: req.params.id, status: 'AWAITING_APPROVAL'
    }, data: { status: 'COMPLETED', approvedAt: new Date() } });
    if (changed.count !== 1) return res.status(409).json({ error: 'Milestone was already approved' });
    const updated = await prisma.milestone.findUniqueOrThrow({ where: { id: milestone.id } });
    await audit(req.params.id, req.account!.id, 'MILESTONE_APPROVED', milestone.id);
    return res.json(updated);
  }));

  app.get('/api/projects/:id/change-orders', authenticate, projectAccess, route(async (req, res) => {
    return res.json(await prisma.changeOrder.findMany({ where: { projectId: req.params.id }, orderBy: { createdAt: 'desc' } }));
  }));
  app.post('/api/projects/:id/change-orders', authenticate, projectAccess, route(async (req, res) => {
    if (!authorized(req, res, ['HOMEOWNER', 'BUILDER', 'ADMIN'])) return;
    const title = text(req.body.title);
    const description = text(req.body.description, 2000);
    const costImpact = signedMoney(req.body.costImpact);
    const timelineImpactDays = Number(req.body.timelineImpactDays);
    if (!title || !description || costImpact === null || !Number.isInteger(timelineImpactDays) ||
        timelineImpactDays < -3650 || timelineImpactDays > 3650) return res.status(400).json({ error: 'Valid change order details are required' });
    const order = await prisma.changeOrder.create({ data: {
      projectId: req.params.id, title, description, costImpact, timelineImpactDays, requestedById: req.account!.id
    } });
    await audit(req.params.id, req.account!.id, 'CHANGE_ORDER_REQUESTED', order.id);
    return res.status(201).json(order);
  }));
  app.post('/api/projects/:id/change-orders/:orderId/decision', authenticate, projectAccess, route(async (req, res) => {
    if (!authorized(req, res, ['HOMEOWNER', 'ADMIN'])) return;
    const decision = req.body.decision;
    if (decision !== 'APPROVED' && decision !== 'REJECTED') return res.status(400).json({ error: 'Decision must be APPROVED or REJECTED' });
    const order = await prisma.changeOrder.findFirst({ where: { id: req.params.orderId, projectId: req.params.id } });
    if (!order) return res.status(404).json({ error: 'Change order not found' });
    if (order.status !== 'PENDING') return res.status(409).json({ error: 'Change order already decided' });
    class DecisionConflict extends Error { constructor(public status: number, message: string) { super(message); } }
    try {
      const updated = await prisma.$transaction(async tx => {
        const changed = await tx.changeOrder.updateMany({ where: {
          id: order.id, projectId: req.params.id, status: 'PENDING'
        }, data: { status: decision, approvedById: req.account!.id, decidedAt: new Date() } });
        if (changed.count !== 1) throw new DecisionConflict(409, 'Change order already decided');
        if (decision === 'APPROVED') {
          const budget = await tx.project.updateMany({ where: {
            id: req.params.id, totalBudget: { gt: -Number(order.costImpact) }
          }, data: { totalBudget: { increment: order.costImpact } } });
          if (budget.count !== 1) throw new DecisionConflict(400, 'Budget must remain positive');
        }
        await tx.auditEvent.create({ data: { projectId: req.params.id, actorId: req.account!.id,
          action: `CHANGE_ORDER_${decision}`, entityId: order.id } });
        return tx.changeOrder.findUniqueOrThrow({ where: { id: order.id } });
      });
      return res.json(updated);
    } catch (error) {
      if (error instanceof DecisionConflict) return res.status(error.status).json({ error: error.message });
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2034') {
        return res.status(409).json({ error: 'Concurrent decision; refresh and try again' });
      }
      throw error;
    }
  }));

  app.get('/api/projects/:id/site-reports', authenticate, projectAccess, route(async (req, res) => {
    return res.json(await prisma.siteReport.findMany({ where: { projectId: req.params.id }, orderBy: { reportDate: 'desc' } }));
  }));
  app.post('/api/projects/:id/site-reports', authenticate, projectAccess, route(async (req, res) => {
    if (!authorized(req, res, ['BUILDER', 'ADMIN'])) return;
    const reportDate = new Date(req.body.reportDate);
    const workCompleted = text(req.body.workCompleted, 2000);
    if (!workCompleted || !Number.isFinite(reportDate.getTime())) return res.status(400).json({ error: 'Date and work completed are required' });
    const report = await prisma.siteReport.create({ data: {
      projectId: req.params.id, authorId: req.account!.id, reportDate, workCompleted,
      materialsReceived: text(req.body.materialsReceived, 2000) || null,
      issuesEncountered: text(req.body.issuesEncountered, 2000) || null,
      nextPlan: text(req.body.nextPlan, 2000) || null
    } });
    await audit(req.params.id, req.account!.id, 'SITE_REPORT_CREATED', report.id);
    return res.status(201).json(report);
  }));

  app.get('/api/projects/:id/defects', authenticate, projectAccess, route(async (req, res) => {
    return res.json(await prisma.defect.findMany({ where: { projectId: req.params.id }, orderBy: { createdAt: 'desc' } }));
  }));
  app.post('/api/projects/:id/defects', authenticate, projectAccess, route(async (req, res) => {
    if (!authorized(req, res, ['HOMEOWNER', 'BUILDER', 'ADMIN'])) return;
    const title = text(req.body.title);
    const description = text(req.body.description, 2000);
    const severity = text(req.body.severity, 20);
    if (!title || !description || !['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(severity)) return res.status(400).json({ error: 'Valid defect details are required' });
    const defect = await prisma.defect.create({ data: {
      projectId: req.params.id, raisedById: req.account!.id, title, description, severity
    } });
    await audit(req.params.id, req.account!.id, 'DEFECT_RAISED', defect.id);
    return res.status(201).json(defect);
  }));
  app.post('/api/projects/:id/defects/:defectId/resolve', authenticate, projectAccess, route(async (req, res) => {
    if (!authorized(req, res, ['BUILDER', 'ADMIN'])) return;
    const defect = await prisma.defect.findFirst({ where: { id: req.params.defectId, projectId: req.params.id } });
    if (!defect) return res.status(404).json({ error: 'Defect not found' });
    if (defect.status !== 'OPEN' && defect.status !== 'IN_PROGRESS') return res.status(409).json({ error: 'Defect cannot be resolved again' });
    const changed = await prisma.defect.updateMany({ where: {
      id: defect.id, projectId: req.params.id, status: { in: ['OPEN', 'IN_PROGRESS'] }
    }, data: { status: 'RESOLVED', resolvedAt: new Date() } });
    if (changed.count !== 1) return res.status(409).json({ error: 'Defect was already resolved' });
    const updated = await prisma.defect.findUniqueOrThrow({ where: { id: defect.id } });
    await audit(req.params.id, req.account!.id, 'DEFECT_RESOLVED', defect.id);
    return res.json(updated);
  }));
  app.post('/api/projects/:id/defects/:defectId/verify', authenticate, projectAccess, route(async (req, res) => {
    if (!authorized(req, res, ['HOMEOWNER', 'ADMIN'])) return;
    const defect = await prisma.defect.findFirst({ where: { id: req.params.defectId, projectId: req.params.id } });
    if (!defect) return res.status(404).json({ error: 'Defect not found' });
    if (defect.status !== 'RESOLVED') return res.status(409).json({ error: 'Defect must be resolved before verification' });
    const changed = await prisma.defect.updateMany({ where: {
      id: defect.id, projectId: req.params.id, status: 'RESOLVED'
    }, data: { status: 'VERIFIED_CLOSED', verifiedById: req.account!.id } });
    if (changed.count !== 1) return res.status(409).json({ error: 'Defect was already verified' });
    const updated = await prisma.defect.findUniqueOrThrow({ where: { id: defect.id } });
    await audit(req.params.id, req.account!.id, 'DEFECT_VERIFIED', defect.id);
    return res.json(updated);
  }));

  app.get('/api/projects/:id/material-requests', authenticate, projectAccess, route(async (req, res) => {
    return res.json(await prisma.materialRequest.findMany({ where: { projectId: req.params.id },
      include: { boqItem: { select: { id: true, description: true, category: true } },
        purchaseOrder: { select: { id: true, status: true } } }, orderBy: { createdAt: 'desc' } }));
  }));
  app.post('/api/projects/:id/material-requests', authenticate, projectAccess, route(async (req, res) => {
    if (!authorized(req, res, ['BUILDER', 'ADMIN'])) return;
    const quantity = decimal(req.body.quantity, 3);
    const boqItem = req.body.boqItemId ? await prisma.bOQItem.findFirst({ where: {
      id: req.body.boqItemId, projectId: req.params.id
    } }) : null;
    if (req.body.boqItemId && !boqItem) return res.status(404).json({ error: 'BOQ item not found in this project' });
    const itemName = boqItem?.description || text(req.body.itemName);
    const unit = boqItem?.unit || text(req.body.unit, 30);
    const neededBy = req.body.neededBy ? new Date(req.body.neededBy) : null;
    if (!itemName || !unit || !quantity || (neededBy && !Number.isFinite(neededBy.getTime())) ||
        (boqItem && boqItem.quantity.lt(quantity))) {
      return res.status(400).json({ error: 'Valid material request details are required; BOQ quantity cannot be exceeded' });
    }
    const request = await prisma.materialRequest.create({ data: {
      projectId: req.params.id, boqItemId: boqItem?.id, itemName, unit, quantity,
      neededBy, notes: text(req.body.notes, 2000) || null, requestedById: req.account!.id
    } });
    await audit(req.params.id, req.account!.id, 'MATERIAL_REQUESTED', request.id);
    return res.status(201).json(request);
  }));
  app.post('/api/projects/:id/material-requests/:requestId/advance', authenticate, projectAccess, route(async (req, res) => {
    if (!authorized(req, res, ['PROCUREMENT', 'ADMIN'])) return;
    const request = await prisma.materialRequest.findFirst({ where: { id: req.params.requestId, projectId: req.params.id } });
    if (!request) return res.status(404).json({ error: 'Material request not found' });
    if (request.status !== 'REQUESTED') return res.status(409).json({ error: 'Use purchase order dispatch and site receipt for later stages' });
    const changed = await prisma.materialRequest.updateMany({ where: {
      id: request.id, projectId: req.params.id, status: 'REQUESTED'
    }, data: { status: 'ACCEPTED', handledById: req.account!.id } });
    if (changed.count !== 1) return res.status(409).json({ error: 'Material request has advanced; refresh it' });
    const updated = await prisma.materialRequest.findUniqueOrThrow({ where: { id: request.id } });
    await audit(req.params.id, req.account!.id, `MATERIAL_${updated.status}`, request.id);
    return res.json(updated);
  }));

  app.get('/api/projects/:id/documents', authenticate, projectAccess, route(async (req, res) => {
    return res.json(await prisma.projectDocument.findMany({ where: { projectId: req.params.id }, orderBy: { createdAt: 'desc' } }));
  }));
  app.post('/api/projects/:id/documents', authenticate, projectAccess, route(async (req, res) => {
    const title = text(req.body.title);
    const category = text(req.body.category, 80);
    const storageKey = text(req.body.storageKey, 500);
    if (!title || !category || !storageKey) return res.status(400).json({ error: 'Document title, category and reference are required' });
    const document = await prisma.projectDocument.create({ data: {
      projectId: req.params.id, title, category, storageKey, uploadedById: req.account!.id
    } });
    await audit(req.params.id, req.account!.id, 'DOCUMENT_RECORDED', document.id);
    return res.status(201).json(document);
  }));

  app.get('/api/projects/:id/activity', authenticate, projectAccess, route(async (req, res) => {
    return res.json(await prisma.auditEvent.findMany({ where: { projectId: req.params.id }, orderBy: { createdAt: 'desc' }, take: 100 }));
  }));
}
