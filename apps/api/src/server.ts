import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { db } from '@construction-os/db';
import { UserRole, ProjectHealthStatus } from '@construction-os/types';

const JWT_SECRET = process.env.JWT_SECRET || 'construction-os-jwt-secret-2026';

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static uploads directory
const UPLOADS_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

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

// 2. Existing project access boundary. Procurement membership is introduced in Sprint 2.
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

  // Legacy roles have no project membership model yet; deny them by default.
  if (user.role !== 'HOMEOWNER' && user.role !== 'BUILDER') {
    return res.status(403).json({ error: 'Access denied: No project access for this role' });
  }

  req.project = project;
  next();
};

// ============================================================================
// AUTHENTICATION & SESSION ENDPOINTS (Real Hashing & JWT)
// ============================================================================

// Register User
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, phone, role } = req.body;

    if (!email || !fullName || !role) {
      return res.status(400).json({ error: 'Email, fullName, and role are required' });
    }

    const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : await bcrypt.hash('Password123!', 10);

    const newUser = {
      id: `usr-${Date.now()}`,
      email: email.toLowerCase(),
      fullName,
      phone: phone || '',
      role: (role as UserRole) || 'HOMEOWNER',
      isVerified: true,
      createdAt: new Date().toISOString()
    };

    db.users.push({ ...newUser, passwordHash } as any);
    db.saveToDisk();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, fullName: newUser.fullName, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({ user: newUser, token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// Login User
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() && (!role || u.role === role));
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials or user role' });
    }

    // Verify password if user has passwordHash
    if (password && (user as any).passwordHash) {
      const isValid = await bcrypt.compare(password, (user as any).passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash, ...userProfile } = user as any;
    return res.json({ user: userProfile, token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// Logout Endpoint
app.post('/api/auth/logout', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ message: 'Session logged out successfully' });
});

// Get Current User Profile
app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = db.users.find(u => u.id === req.user!.id);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found' });
  }
  const { passwordHash, ...userProfile } = user as any;
  return res.json(userProfile);
});

// ============================================================================
// LOCAL FILE STORAGE ENDPOINT
// ============================================================================

app.post('/api/upload', authenticateToken, (req: Request, res: Response) => {
  try {
    const { fileName, fileData } = req.body;
    if (!fileName || !fileData) {
      return res.status(400).json({ error: 'fileName and base64 fileData are required' });
    }

    const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    if (matches && matches.length === 3) {
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(fileData, 'base64');
    }

    const safeFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const targetPath = path.join(UPLOADS_DIR, safeFileName);
    fs.writeFileSync(targetPath, buffer);

    const fileUrl = `/uploads/${safeFileName}`;
    return res.status(201).json({
      fileUrl,
      fileName: safeFileName,
      sizeBytes: buffer.length
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'File upload failed' });
  }
});

// ============================================================================
// OWNER OS ↔ CONTRACTOR OS REST API ENDPOINTS
// ============================================================================

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
  db.saveToDisk();

  return res.status(201).json(newItem);
});

// 3. Milestones & Payment Request Flow
app.get('/api/projects/:id/milestones', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  const milestones = db.milestones.filter(m => m.projectId === req.params.id);
  return res.json(milestones);
});

app.post('/api/projects/:id/milestones/:milestoneId/approve', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  if (req.user!.role !== 'HOMEOWNER' && req.user!.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only homeowners can approve milestone completions' });
  }

  const project = req.project;
  const milestone = db.milestones.find(m => m.id === req.params.milestoneId && m.projectId === project.id);
  if (!milestone) {
    return res.status(404).json({ error: 'Milestone not found' });
  }

  milestone.status = 'COMPLETED';
  milestone.completionPercentage = 100;
  milestone.actualEndDate = new Date().toISOString().split('T')[0];

  project.paidAmount = (project.paidAmount || 0) + milestone.allocatedBudget;
  project.spentCost = (project.spentCost || 0) + milestone.allocatedBudget;

  db.logLedger(project.id, req.user!.id, req.user!.fullName, req.user!.role, 'MILESTONE_APPROVED', 'Milestone Payment Approved', `Homeowner approved milestone: ${milestone.title} (Disbursed ₹${milestone.allocatedBudget.toLocaleString('en-IN')})`, milestone.id);
  db.saveToDisk();

  return res.json({ project, milestone });
});

// 4. Budget vs Actual Category Matrix
app.get('/api/projects/:id/budget-vs-actual', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  const project = req.project;
  return res.json({
    projectId: project.id,
    projectName: project.name,
    totalBudget: project.totalBudget,
    totalSpent: project.spentCost,
    categories: db.budgetVsActualRecords
  });
});

// 5. Daily Site Reporting
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
  db.saveToDisk();

  return res.status(201).json(report);
});

// 6. Change Order Creation & Approval Flow
app.get('/api/projects/:id/change-requests', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  const reqs = db.changeOrders.filter(c => c.projectId === req.params.id);
  return res.json(reqs);
});

app.post('/api/projects/:id/change-requests', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  const { title, description, costImpact, timelineImpactDays, originalScope, proposedChange } = req.body;
  const project = req.project;

  const newChangeReq = {
    id: `cho-${Date.now()}`,
    projectId: project.id,
    title: title || 'Scope & Material Upgrade Request',
    description: description || '',
    originalScope: originalScope || '',
    proposedChange: proposedChange || '',
    costImpact: Number(costImpact) || 0,
    timelineImpactDays: Number(timelineImpactDays) || 0,
    requestedBy: req.user!.fullName,
    requestedByRole: req.user!.role,
    status: 'PENDING' as const,
    createdAt: new Date().toISOString()
  };

  db.changeOrders.unshift(newChangeReq);
  db.logLedger(project.id, req.user!.id, req.user!.fullName, req.user!.role, 'CHANGE_REQUEST_CREATED', 'Change Order Created', `Submitted change request: ${newChangeReq.title} (+₹${newChangeReq.costImpact.toLocaleString('en-IN')})`, newChangeReq.id);
  db.saveToDisk();

  return res.status(201).json(newChangeReq);
});

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
  db.saveToDisk();

  return res.json({ project, changeReq });
});

// 7. Defects & Quality Remediation Loop
app.get('/api/projects/:id/defects', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  const defects = db.defectRecords.filter(d => d.projectId === req.params.id);
  return res.json(defects);
});

app.post('/api/projects/:id/defects', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  const { title, description, defectType, location, severity, responsibleTrade, reworkTimeDays, reworkCost, photoUrl } = req.body;
  const project = req.project;

  const defect = {
    id: `def-${Date.now()}`,
    projectId: project.id,
    title: title || 'Site Defect Identified',
    description: description || '',
    defectType: defectType || 'OTHER',
    location: location || 'Site',
    severity: severity || 'MEDIUM',
    responsibleTrade: responsibleTrade || 'General',
    reworkTimeDays: Number(reworkTimeDays) || 1,
    reworkCost: Number(reworkCost) || 0,
    status: 'OPEN' as const,
    discoveredDate: new Date().toISOString().split('T')[0],
    photoUrl: photoUrl || '',
    createdAt: new Date().toISOString()
  };

  db.defectRecords.unshift(defect);
  db.logLedger(project.id, req.user!.id, req.user!.fullName, req.user!.role, 'DEFECT_RAISED', 'Defect Logged', `Raised defect: ${defect.title}`, defect.id);
  db.saveToDisk();

  return res.status(201).json(defect);
});

app.post('/api/projects/:id/defects/:defectId/verify', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  if (req.user!.role !== 'HOMEOWNER' && req.user!.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only homeowners can verify defect closure' });
  }

  const project = req.project;
  const defect = db.defectRecords.find(d => d.id === req.params.defectId && d.projectId === project.id);
  if (!defect) {
    return res.status(404).json({ error: 'Defect record not found' });
  }

  defect.status = 'VERIFIED_CLOSED';
  defect.resolvedDate = new Date().toISOString().split('T')[0];

  db.logLedger(project.id, req.user!.id, req.user!.fullName, req.user!.role, 'DEFECT_CLOSED', 'Defect Verified & Closed', `Homeowner verified defect remediation: ${defect.title}`, defect.id);
  db.saveToDisk();

  return res.json(defect);
});

// 8. Documents Vault
app.get('/api/projects/:id/documents', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  const docs = db.documents.filter(d => d.projectId === req.params.id);
  return res.json(docs);
});

app.post('/api/projects/:id/documents', authenticateToken, authorizeProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  const { title, category, fileUrl, sizeBytes } = req.body;
  const project = req.project;

  const doc = {
    id: `doc-${Date.now()}`,
    projectId: project.id,
    title: title || 'Project Document',
    category: category || 'OTHER',
    fileUrl: fileUrl || '/uploads/sample.pdf',
    uploadedBy: req.user!.fullName,
    uploadedByRole: req.user!.role,
    sizeBytes: Number(sizeBytes) || 1024,
    uploadedAt: new Date().toISOString()
  };

  db.documents.unshift(doc);
  db.logLedger(project.id, req.user!.id, req.user!.fullName, req.user!.role, 'DOCUMENT_UPLOADED', 'Document Uploaded', `Uploaded document: ${doc.title}`, doc.id);
  db.saveToDisk();

  return res.status(201).json(doc);
});

// 9. Contextual Messaging
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
  db.saveToDisk();
  return res.status(201).json(newMsg);
});

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Construction OS API] Server running on http://localhost:${PORT}`);
  });
}

export default app;
