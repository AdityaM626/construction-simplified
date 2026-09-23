import type { Express, NextFunction, Request, RequestHandler, Response } from 'express';
import type { PrismaClient } from '@construction-os/data';

type Role = 'HOMEOWNER' | 'BUILDER' | 'PROCUREMENT' | 'ADMIN';
type AuthedRequest = Request & { account?: { id: string; role: Role } };
type Attention = { key: string; title: string; count: number; tab: string; description: string };

const route = (handler: (req: AuthedRequest, res: Response) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req as AuthedRequest, res)).catch(next);
  };

export function registerOverview(
  app: Express, prisma: PrismaClient, authenticate: RequestHandler, projectAccess: RequestHandler
) {
  app.get('/api/projects/:id/workspace-overview', authenticate, projectAccess, route(async (req, res) => {
    const projectId = req.params.id;
    const [boqItems, milestones, completedMilestones, awaitingMilestones, activeMilestones,
      pendingChanges, openDefects, resolvedDefects, requestedMaterials, acceptedMaterials,
      issuedOrders, awaitingReceipts, exceptions, orders, activity] = await Promise.all([
      prisma.bOQItem.count({ where: { projectId } }),
      prisma.milestone.count({ where: { projectId } }),
      prisma.milestone.count({ where: { projectId, status: 'COMPLETED' } }),
      prisma.milestone.count({ where: { projectId, status: 'AWAITING_APPROVAL' } }),
      prisma.milestone.count({ where: { projectId, status: { in: ['NOT_STARTED', 'IN_PROGRESS'] } } }),
      prisma.changeOrder.count({ where: { projectId, status: 'PENDING' } }),
      prisma.defect.count({ where: { projectId, status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
      prisma.defect.count({ where: { projectId, status: 'RESOLVED' } }),
      prisma.materialRequest.count({ where: { projectId, status: 'REQUESTED' } }),
      prisma.materialRequest.count({ where: { projectId, status: 'ACCEPTED' } }),
      prisma.purchaseOrder.count({ where: { projectId, status: 'ISSUED' } }),
      prisma.purchaseOrder.count({ where: { projectId, status: { in: ['DISPATCHED', 'PARTIALLY_RECEIVED'] } } }),
      prisma.purchaseOrder.count({ where: { projectId, status: 'EXCEPTION' } }),
      prisma.purchaseOrder.findMany({ where: { projectId }, select: { quantity: true, unitPrice: true } }),
      prisma.auditEvent.findMany({ where: { projectId }, orderBy: { createdAt: 'desc' }, take: 5,
        select: { id: true, action: true, createdAt: true, actor: { select: { fullName: true } } } })
    ]);
    const project = await prisma.project.findUniqueOrThrow({ where: { id: projectId },
      select: { totalBudget: true } });
    const committed = orders.reduce((sum, order) =>
      sum.plus(order.quantity.mul(order.unitPrice)), project.totalBudget.mul(0));

    const all: (Attention & { roles: Role[] })[] = [
      { key: 'milestone-approvals', title: 'Milestones to approve', count: awaitingMilestones,
        tab: 'milestones', description: 'Review submitted milestones', roles: ['HOMEOWNER', 'ADMIN'] },
      { key: 'change-decisions', title: 'Change orders to decide', count: pendingChanges,
        tab: 'changes', description: 'Approve or reject scope changes', roles: ['HOMEOWNER', 'ADMIN'] },
      { key: 'defect-verification', title: 'Defects to verify', count: resolvedDefects,
        tab: 'defects', description: 'Confirm resolved site defects', roles: ['HOMEOWNER', 'ADMIN'] },
      { key: 'active-milestones', title: 'Milestones to progress', count: activeMilestones,
        tab: 'milestones', description: 'Submit completed work for approval', roles: ['BUILDER', 'ADMIN'] },
      { key: 'open-defects', title: 'Open defects', count: openDefects,
        tab: 'defects', description: 'Resolve site quality issues', roles: ['BUILDER', 'ADMIN'] },
      { key: 'site-receipts', title: 'Deliveries to inspect', count: awaitingReceipts,
        tab: 'materials', description: 'Record accepted and damaged goods', roles: ['BUILDER', 'ADMIN'] },
      { key: 'material-acceptance', title: 'Material requests to accept', count: requestedMaterials,
        tab: 'materials', description: 'Review site material needs', roles: ['PROCUREMENT', 'ADMIN'] },
      { key: 'material-sourcing', title: 'Accepted requests to source', count: acceptedMaterials,
        tab: 'materials', description: 'Compare quotations and issue orders', roles: ['PROCUREMENT', 'ADMIN'] },
      { key: 'orders-dispatch', title: 'Orders to dispatch', count: issuedOrders,
        tab: 'materials', description: 'Record tracking details', roles: ['PROCUREMENT', 'ADMIN'] },
      { key: 'delivery-exceptions', title: 'Delivery exceptions', count: exceptions,
        tab: 'materials', description: 'Review shortage or damage records', roles: ['HOMEOWNER', 'BUILDER', 'PROCUREMENT', 'ADMIN'] }
    ];
    const attention: Attention[] = all.filter(item => item.count > 0 && item.roles.includes(req.account!.role))
      .map(item => ({ key: item.key, title: item.title, count: item.count,
        tab: item.tab, description: item.description }));
    return res.json({ metrics: {
      boqItems, milestones, completedMilestones, openDefects,
      projectBudget: project.totalBudget.toString(), committed: committed.toString(),
      remainingAfterCommitments: project.totalBudget.minus(committed).toString()
    }, attention, recentActivity: activity });
  }));
}
