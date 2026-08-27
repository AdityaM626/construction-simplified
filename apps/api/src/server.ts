import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { db } from '@construction-os/db';
import { UserRole, ProjectHealthStatus } from '@construction-os/types';

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
// OWNER OS ↔ CONTRACTOR OS REST API ENDPOINTS
// ============================================================================

// 1. Calculate Project Health
app.get('/api/projects/:id/health', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const project = db.projects.find(p => p.id === req.params.id) || db.projects[0];
  const openCriticalIssues = db.issues.filter(i => i.projectId === project.id && i.severity === 'CRITICAL' && i.status !== 'CLOSED').length;
  
  let health: ProjectHealthStatus = 'HEALTHY';
  let reason = 'Project running on schedule within target budget allocation';

  if (openCriticalIssues > 0 || project.spentCost > project.totalBudget * 1.05) {
    health = 'CRITICAL';
    reason = `Project cost exceeds budget threshold or has ${openCriticalIssues} critical open defect(s)`;
  } else if (project.spentCost > project.totalBudget) {
    health = 'AT_RISK';
    reason = 'Project cost exceeds original baseline budget by >0%';
  }

  project.projectHealth = health;
  project.healthReason = reason;

  return res.json({
    projectId: project.id,
    projectName: project.name,
    projectHealth: health,
    healthReason: reason,
    contractValue: project.contractValue,
    spentCost: project.spentCost,
    paidAmount: project.paidAmount,
    openCriticalIssuesCount: openCriticalIssues
  });
});

// 2. BOQ & Estimation Endpoints
app.get('/api/projects/:id/boq', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const project = db.projects.find(p => p.id === req.params.id) || db.projects[0];
  const boq = db.boqs.find(b => b.projectId === project.id) || db.boqs[0];
  return res.json(boq);
});

app.post('/api/projects/:id/boq', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { category, itemName, description, quantity, unit, estimatedRate } = req.body;
  const project = db.projects.find(p => p.id === req.params.id) || db.projects[0];
  const boq = db.boqs.find(b => b.projectId === project.id) || db.boqs[0];

  const estimatedTotal = (Number(quantity) || 0) * (Number(estimatedRate) || 0);
  const newItem = {
    id: `boq-item-${Date.now()}`,
    boqId: boq.id,
    category: category || 'CEMENT',
    itemName: itemName || 'New Material Item',
    description: description || '',
    quantity: Number(quantity) || 1,
    unit: unit || 'Unit',
    estimatedRate: Number(estimatedRate) || 0,
    estimatedTotal,
    actualSpent: 0,
    variance: -estimatedTotal
  };

  boq.items.push(newItem);
  boq.totalEstimatedValue = boq.items.reduce((sum, i) => sum + i.estimatedTotal, 0);

  db.logLedger(project.id, req.user!.id, req.user!.fullName, req.user!.role, 'BOQ_CREATED', 'BOQ Item Added', `Contractor added BOQ item: ${newItem.itemName} (₹${estimatedTotal.toLocaleString('en-IN')})`, newItem.id);

  return res.status(201).json(newItem);
});

// 3. Budget vs Actual Category Matrix
app.get('/api/projects/:id/budget-vs-actual', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const project = db.projects.find(p => p.id === req.params.id) || db.projects[0];
  return res.json({
    projectId: project.id,
    projectName: project.name,
    totalBudget: project.totalBudget,
    totalSpent: project.spentCost,
    categories: db.budgetVsActualRecords
  });
});

// 4. Daily Site Reporting
app.get('/api/projects/:id/daily-reports', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const reports = db.dailySiteReports.filter(d => d.projectId === req.params.id);
  return res.json(reports);
});

app.post('/api/projects/:id/daily-reports', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { weather, workersPresentCount, workCompleted, materialsReceived, issuesEncountered, photoUrls, tomorrowsPlan } = req.body;
  const project = db.projects.find(p => p.id === req.params.id) || db.projects[0];

  const report = {
    id: `dsr-${Date.now()}`,
    projectId: project.id,
    date: new Date().toISOString().split('T')[0],
    weather: weather || 'Sunny',
    workersPresentCount: Number(workersPresentCount) || 10,
    workCompleted: workCompleted || 'General construction execution',
    materialsReceived: materialsReceived || 'None',
    issuesEncountered: issuesEncountered || 'None',
    photoUrls: photoUrls || ['https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80'],
    tomorrowsPlan: tomorrowsPlan || 'Continue scheduled phase work',
    submittedBy: req.user!.fullName,
    createdAt: new Date().toISOString()
  };

  db.dailySiteReports.unshift(report);
  db.logLedger(project.id, req.user!.id, req.user!.fullName, req.user!.role, 'DAILY_REPORT_SUBMITTED', 'Daily Site Report Logged', `Site report submitted: ${report.workCompleted}`, report.id);

  return res.status(201).json(report);
});

// 5. Change Order Approval (Homeowner Action)
app.post('/api/projects/:id/change-requests/:reqId/approve', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const project = db.projects.find(p => p.id === req.params.id) || db.projects[0];
  const changeReq = db.changeOrders.find(c => c.id === req.params.reqId);

  if (!changeReq) {
    return res.status(404).json({ error: 'Change request not found' });
  }

  changeReq.status = 'APPROVED';
  changeReq.approvedBy = req.user!.fullName;
  changeReq.approvedAt = new Date().toISOString();

  project.contractValue += changeReq.costImpact;
  project.totalBudget += changeReq.costImpact;

  db.logLedger(project.id, req.user!.id, req.user!.fullName, req.user!.role, 'CHANGE_REQUEST_APPROVED', 'Change Request Approved', `Approved change: ${changeReq.title} (+₹${changeReq.costImpact.toLocaleString('en-IN')})`, changeReq.id);

  return res.json({ project, changeReq });
});

// 6. Contextual Messaging
app.get('/api/messages/:entityType/:entityId', authenticateToken, (req: Request, res: Response) => {
  const msgs = db.contextualMessages.filter(m => m.entityType === req.params.entityType && m.entityId === req.params.entityId);
  return res.json(msgs);
});

app.post('/api/messages', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { projectId, entityType, entityId, content } = req.body;
  const newMsg = {
    id: `msg-${Date.now()}`,
    projectId: projectId || 'prj-101',
    entityType: entityType || 'PROJECT',
    entityId: entityId || 'prj-101',
    senderId: req.user!.id,
    senderName: req.user!.fullName,
    senderRole: req.user!.role,
    content: content || '',
    timestamp: new Date().toISOString()
  };

  db.contextualMessages.push(newMsg);
  return res.status(201).json(newMsg);
});

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Construction OS API] Server running on http://localhost:${PORT}`);
  });
}

export default app;
