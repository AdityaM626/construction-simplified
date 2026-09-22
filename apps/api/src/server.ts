import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { db } from '@construction-os/db';
import { UserRole, ProjectHealthStatus } from '@construction-os/types';

const JWT_SECRET = process.env.JWT_SECRET || 'construction-os-jwt-secret-2026';

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(origin => origin.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
  };
  project?: any;
}

// 1. Strict Authentication Middleware
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Missing Bearer token.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({ error: 'Invalid token payload.' });
    }
    req.user = {
      id: decoded.id,
      email: decoded.email,
      fullName: decoded.fullName,
      role: decoded.role as UserRole
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
};

// 2. Object-Level Project Ownership & Authorization Middleware
const authorizeProjectAccess = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const projectId = req.params.id || req.body.projectId;
  if (!projectId) {
    return res.status(400).json({ error: 'Project ID parameter is required' });
  }

  const project = db.projects.find(p => p.id === projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const user = req.user!;
  if (user.role === 'ADMIN') {
    req.project = project;
    return next();
  }

  if (user.role === 'HOMEOWNER' && project.homeownerId !== user.id) {
    return res.status(403).json({ error: 'Access denied: You do not own this project' });
  }

  if (user.role === 'BUILDER' && project.builderId !== user.id) {
    return res.status(403).json({ error: 'Access denied: You are not assigned to this project' });
  }

  req.project = project;
  next();
};

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

// Register User
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password, fullName, phone, role } = req.body;

  if (!email || !fullName || !role) {
    return res.status(400).json({ error: 'Email, fullName, and role are required' });
  }

  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    email: email.toLowerCase(),
    fullName,
    phone: phone || '',
    role: (role as UserRole) || 'HOMEOWNER',
    isVerified: true,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, fullName: newUser.fullName, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.status(201).json({ user: newUser, token });
});

// Login User
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, role } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && (!role || u.role === role));
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials or user role' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({ user, token });
});

// Get Current User Profile
app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = db.users.find(u => u.id === req.user!.id);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found' });
  }
  return res.json(user);
});

// ============================================================================
// OWNER OS ↔ CONTRACTOR OS REST API ENDPOINTS
// ============================================================================

// Shared project inbox.  Both the homeowner and the assigned contractor see the
// same project record; this is the single source of truth for the two portals.
app.get('/api/projects', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const projects = user.role === 'ADMIN'
    ? db.projects
    : db.projects.filter(project => project.homeownerId === user.id || project.builderId === user.id);
  return res.json(projects);
});

app.get('/api/projects/:id', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  return res.json(req.project);
});

// 1. Calculate Project Health
app.get('/api/projects/:id/health', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  const project = req.project;
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
    contractValue: project.contractValue || project.totalBudget,
    spentCost: project.spentCost,
    paidAmount: project.paidAmount || 0,
    openCriticalIssuesCount: openCriticalIssues
  });
});

// 2. BOQ & Estimation Endpoints
app.get('/api/projects/:id/boq', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  const project = req.project;
  const boq = db.boqs.find(b => b.projectId === project.id);
  if (!boq) {
    return res.status(404).json({ error: 'BOQ not found for this project' });
  }
  return res.json(boq);
});

app.post('/api/projects/:id/boq', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  if (req.user!.role !== 'BUILDER' && req.user!.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only contractors can add BOQ items' });
  }

  const { category, itemName, description, quantity, unit, estimatedRate } = req.body;
  const project = req.project;
  let boq = db.boqs.find(b => b.projectId === project.id);

  if (!boq) {
    boq = {
      id: `boq-${Date.now()}`,
      projectId: project.id,
      title: `Master BOQ — ${project.name}`,
      totalEstimatedValue: 0,
      totalActualValue: 0,
      variance: 0,
      items: [],
      createdAt: new Date().toISOString()
    };
    db.boqs.push(boq);
  }

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
app.get('/api/projects/:id/budget-vs-actual', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  const project = req.project;
  return res.json({
    projectId: project.id,
    projectName: project.name,
    totalBudget: project.totalBudget,
    totalSpent: project.spentCost,
    // Budget records in the current schema are a single-project seed collection.
    categories: db.budgetVsActualRecords
  });
});

app.get('/api/projects/:id/change-requests', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  return res.json(db.changeOrders.filter(changeOrder => changeOrder.projectId === req.project.id));
});

app.post('/api/projects/:id/change-requests', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  if (req.user!.role !== 'BUILDER' && req.user!.role !== 'HOMEOWNER' && req.user!.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only project participants can submit change orders' });
  }
  const { title, description, reason, originalScope, proposedChange, costImpact, timelineImpactDays } = req.body;
  if (!title?.trim() || !proposedChange?.trim() || !Number.isFinite(Number(costImpact)) || Number(costImpact) < 0 || !Number.isFinite(Number(timelineImpactDays)) || Number(timelineImpactDays) < 0) {
    return res.status(400).json({ error: 'Title, proposed scope, and non-negative cost and timeline impacts are required' });
  }

  const changeOrder = {
    id: `cho-${Date.now()}`,
    projectId: req.project.id,
    title: title.trim(),
    description: description?.trim() || '',
    reason: reason?.trim() || '',
    originalScope: originalScope?.trim() || '',
    proposedChange: proposedChange.trim(),
    costImpact: Number(costImpact),
    timelineImpactDays: Number(timelineImpactDays),
    requestedBy: req.user!.fullName,
    requestedByRole: req.user!.role,
    status: 'PENDING' as const,
    createdAt: new Date().toISOString()
  };
  db.changeOrders.unshift(changeOrder);
  db.logLedger(req.project.id, req.user!.id, req.user!.fullName, req.user!.role, 'CHANGE_REQUEST_CREATED', 'Change Request Submitted', `Submitted change: ${changeOrder.title}`, changeOrder.id);
  return res.status(201).json(changeOrder);
});

app.get('/api/projects/:id/issues', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  return res.json(db.issues.filter(issue => issue.projectId === req.project.id));
});

app.post('/api/projects/:id/issues', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  const { title, description, category, severity, photoUrl } = req.body;
  if (!title?.trim() || !description?.trim() || !['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(severity)) {
    return res.status(400).json({ error: 'Title, description, and a valid severity are required' });
  }
  const issue = {
    id: `iss-${Date.now()}`,
    projectId: req.project.id,
    title: title.trim(),
    description: description.trim(),
    category: category?.trim() || 'GENERAL',
    severity,
    status: 'OPEN' as const,
    createdBy: req.user!.fullName,
    createdByRole: req.user!.role,
    assignedTo: req.project.builderName,
    photoUrl: photoUrl?.trim() || undefined,
    createdAt: new Date().toISOString()
  };
  db.issues.unshift(issue);
  db.logLedger(req.project.id, req.user!.id, req.user!.fullName, req.user!.role, 'ISSUE_CREATED', 'Quality Issue Reported', issue.title, issue.id);
  return res.status(201).json(issue);
});

app.patch('/api/projects/:id/issues/:issueId', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  if (req.user!.role !== 'BUILDER' && req.user!.role !== 'ADMIN') return res.status(403).json({ error: 'Only the contractor can update issue status' });
  const issue = db.issues.find(item => item.id === req.params.issueId && item.projectId === req.project.id);
  if (!issue) return res.status(404).json({ error: 'Issue not found for this project' });
  const { status, resolutionNotes } = req.body;
  if (!['IN_PROGRESS', 'RESOLVED'].includes(status)) return res.status(400).json({ error: 'Issue status must be IN_PROGRESS or RESOLVED' });
  issue.status = status;
  if (resolutionNotes?.trim()) issue.resolutionNotes = resolutionNotes.trim();
  if (status === 'RESOLVED') issue.resolvedAt = new Date().toISOString();
  db.logLedger(req.project.id, req.user!.id, req.user!.fullName, req.user!.role, 'ISSUE_UPDATED', `Issue ${status.toLowerCase()}`, issue.title, issue.id);
  return res.json(issue);
});

// 4. Daily Site Reporting
app.get('/api/projects/:id/daily-reports', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  const reports = db.dailySiteReports.filter(d => d.projectId === req.params.id);
  return res.json(reports);
});

app.post('/api/projects/:id/daily-reports', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  if (req.user!.role !== 'BUILDER' && req.user!.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only contractors can submit site reports' });
  }

  const { weather, workersPresentCount, workCompleted, materialsReceived, issuesEncountered, photoUrls, tomorrowsPlan } = req.body;
  const project = req.project;

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

// 5. Change Order Approval (Homeowner Action - Idempotent & Scoped)
app.post('/api/projects/:id/change-requests/:reqId/approve', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  if (req.user!.role !== 'HOMEOWNER' && req.user!.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only the homeowner can approve change orders' });
  }

  const project = req.project;
  const changeReq = db.changeOrders.find(c => c.id === req.params.reqId && c.projectId === project.id);

  if (!changeReq) {
    return res.status(404).json({ error: 'Change request not found for this project' });
  }

  if (changeReq.status !== 'PENDING') {
    return res.status(400).json({ error: `Change request has already been ${changeReq.status.toLowerCase()}` });
  }

  changeReq.status = 'APPROVED';
  changeReq.approvedBy = req.user!.fullName;
  changeReq.approvedAt = new Date().toISOString();

  project.contractValue = (project.contractValue || project.totalBudget) + changeReq.costImpact;
  project.totalBudget += changeReq.costImpact;

  db.logLedger(project.id, req.user!.id, req.user!.fullName, req.user!.role, 'CHANGE_REQUEST_APPROVED', 'Change Request Approved', `Approved change: ${changeReq.title} (+₹${changeReq.costImpact.toLocaleString('en-IN')})`, changeReq.id);

  return res.json({ project, changeReq });
});

app.post('/api/projects/:id/change-requests/:reqId/reject', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  if (req.user!.role !== 'HOMEOWNER' && req.user!.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only the homeowner can reject change orders' });
  }

  const project = req.project;
  const changeReq = db.changeOrders.find(c => c.id === req.params.reqId && c.projectId === project.id);
  if (!changeReq) return res.status(404).json({ error: 'Change request not found for this project' });
  if (changeReq.status !== 'PENDING') {
    return res.status(400).json({ error: `Change request has already been ${changeReq.status.toLowerCase()}` });
  }

  changeReq.status = 'REJECTED';
  changeReq.approvedBy = req.user!.fullName;
  changeReq.approvedAt = new Date().toISOString();
  db.logLedger(project.id, req.user!.id, req.user!.fullName, req.user!.role, 'CHANGE_REQUEST_REJECTED', 'Change Request Rejected', `Rejected change: ${changeReq.title}`, changeReq.id);
  return res.json({ project, changeReq });
});

// 6. Contextual Messaging
app.get('/api/messages/:entityType/:entityId', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const msgs = db.contextualMessages.filter(m => m.entityType === req.params.entityType && m.entityId === req.params.entityId);
  const projectId = msgs[0]?.projectId || (req.params.entityType === 'PROJECT' ? req.params.entityId : undefined);
  const project = projectId && db.projects.find(p => p.id === projectId);
  if (!project) return res.status(404).json({ error: 'Project context not found' });
  const user = req.user!;
  if (user.role !== 'ADMIN' && project.homeownerId !== user.id && project.builderId !== user.id) {
    return res.status(403).json({ error: 'Access denied for this conversation' });
  }
  return res.json(msgs);
});

app.post('/api/messages', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { projectId, entityType, entityId, content } = req.body;
  const project = db.projects.find(p => p.id === projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  if (req.user!.role !== 'ADMIN' && project.homeownerId !== req.user!.id && project.builderId !== req.user!.id) {
    return res.status(403).json({ error: 'Access denied for this project' });
  }
  if (!content?.trim()) return res.status(400).json({ error: 'Message content is required' });
  const newMsg = {
    id: `msg-${Date.now()}`,
    projectId,
    entityType: entityType || 'PROJECT',
    entityId: entityId || projectId,
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
