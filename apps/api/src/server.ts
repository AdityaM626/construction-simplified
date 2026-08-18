import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { db } from '@construction-os/db';
import { UserRole, OrderStatus, ProductCategory, ConstructionTeamRole } from '@construction-os/types';

const JWT_SECRET = 'construction-os-jwt-secret-2026';

const app = express();
app.use(cors());
app.use(express.json());

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
  };
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const defaultUser = db.users[0]; // Rajesh Kumar
    req.user = {
      id: defaultUser.id,
      email: defaultUser.email,
      fullName: defaultUser.fullName,
      role: defaultUser.role as UserRole
    };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid authentication token' });
  }
};

// ============================================================================
// CONNECTED ECOSYSTEM & TEAM ROSTER ENDPOINTS
// ============================================================================

// 1. Get Construction Team Roster (Contractor + Electrician, Plumber, Architect)
app.get('/api/projects/:id/team', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const project = db.projects.find(p => p.id === req.params.id) || db.projects[0];
  const contractorProfile = db.builderProfiles.find(b => b.userId === project.builderId);
  const specialists = db.constructionTeamMembers.filter(t => t.projectId === project.id);

  return res.json({
    project: { id: project.id, name: project.name },
    leadContractor: {
      id: project.builderId,
      name: project.builderName || 'Apex Infrastructure',
      experienceYears: contractorProfile?.experienceYears || 14,
      specialties: contractorProfile?.specialties || ['Residential Villas']
    },
    specialists
  });
});

// 2. Contractor Adds Specialist Team Member (Electrician, Plumber, Painter, Architect)
app.post('/api/projects/:id/team', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { name, role, phone, specialization, assignedMilestoneId, assignedMilestoneTitle } = req.body;
  const project = db.projects.find(p => p.id === req.params.id) || db.projects[0];

  const memberId = `tm-${Date.now()}`;
  const newMember = {
    id: memberId,
    projectId: project.id,
    contractorId: req.user!.id,
    name: name || 'Specialist Worker',
    role: (role || 'ELECTRICIAN') as ConstructionTeamRole,
    phone: phone || '+91 90000 11111',
    specialization: specialization || 'General Construction Services',
    assignedMilestoneId: assignedMilestoneId || 'mls-2',
    assignedMilestoneTitle: assignedMilestoneTitle || 'Ground & First Floor Superstructure',
    status: 'ACTIVE' as const
  };

  db.constructionTeamMembers.unshift(newMember);
  db.logLedger(project.id, req.user!.id, req.user!.fullName, req.user!.role, 'TEAM_MEMBER_ADDED', `${newMember.role} Assigned`, `Assigned ${newMember.name} (${newMember.role}) to project team roster`, memberId);

  return res.status(201).json(newMember);
});

// 3. Owner 7-Point Material Traceability Engine
app.get('/api/projects/:id/traceability', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const project = db.projects.find(p => p.id === req.params.id) || db.projects[0];
  const requirements = db.materialRequirements.filter(m => m.projectId === project.id);
  const orders = db.orderRequests.filter(o => o.projectId === project.id);

  const traceability = requirements.map(reqItem => {
    const matchedOrder = orders.find(o => o.materialRequirementId === reqItem.id || o.dealerId === reqItem.selectedDealerId);
    return {
      requirementId: reqItem.id,
      category: reqItem.category,
      itemName: reqItem.itemName,
      specification: reqItem.specification,
      requiredQty: reqItem.requiredQty,
      orderedQty: reqItem.orderedQty,
      deliveredQty: reqItem.deliveredQty,
      remainingQty: reqItem.remainingQty,
      unit: reqItem.unit,
      contractorName: reqItem.contractorName,
      supplierName: reqItem.selectedDealerName || 'Not Selected',
      orderId: matchedOrder?.id || 'N/A',
      orderStatus: matchedOrder?.status || 'PENDING',
      orderedDate: matchedOrder?.createdAt || reqItem.createdAt,
      deliveredDate: matchedOrder?.status === 'DELIVERED' || matchedOrder?.status === 'PARTIALLY_DELIVERED' ? '2026-08-18' : 'Pending',
      invoiceNumber: matchedOrder ? `INV-${matchedOrder.id}` : 'Pending',
      paymentStatus: matchedOrder?.status === 'DELIVERED' ? 'PAID' : 'COMMITTED',
      totalValue: reqItem.requiredQty * reqItem.estimatedUnitPrice
    };
  });

  return res.json({
    projectId: project.id,
    projectName: project.name,
    totalBudget: project.totalBudget,
    spentCost: project.spentCost,
    committedCost: project.committedCost,
    materials: traceability
  });
});

// 4. Master Connected Summary Endpoint
app.get('/api/projects/:id/connected-summary', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const project = db.projects.find(p => p.id === req.params.id) || db.projects[0];
  const homeowner = db.users.find(u => u.id === project.homeownerId);
  const contractorProfile = db.builderProfiles.find(b => b.userId === project.builderId);

  const requirements = db.materialRequirements.filter(m => m.projectId === project.id);
  const orders = db.orderRequests.filter(o => o.projectId === project.id);
  const deliveries = db.deliveryJobs.filter(d => d.projectId === project.id);
  const ledger = db.projectLedger.filter(l => l.projectId === project.id);
  const team = db.constructionTeamMembers.filter(t => t.projectId === project.id);

  return res.json({
    project,
    homeowner: { name: homeowner?.fullName || 'Rajesh Kumar', email: homeowner?.email },
    contractor: { companyName: contractorProfile?.companyName || 'Apex Infrastructure', rating: contractorProfile?.rating || 4.9 },
    team,
    procurementSummary: requirements,
    orders,
    deliveries,
    ledgerTimeline: ledger
  });
});

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Construction OS API] Server running on http://localhost:${PORT}`);
  });
}

export default app;
