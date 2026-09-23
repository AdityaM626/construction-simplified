import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { createDataClient } from '@construction-os/data';

const secret = process.env.JWT_SECRET || '';
if (secret.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters');

export const prisma = createDataClient();
export const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: process.env.WEB_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

type Role = 'HOMEOWNER' | 'BUILDER' | 'PROCUREMENT' | 'ADMIN';
type Account = { id: string; email: string; fullName: string; role: Role };
type AuthedRequest = Request & { account?: Account };
type AsyncHandler = (req: AuthedRequest, res: Response) => Promise<unknown>;
const route = (handler: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handler(req as AuthedRequest, res)).catch(next);
};
const validRoles: Role[] = ['HOMEOWNER', 'BUILDER', 'PROCUREMENT'];
const cleanEmail = (value: unknown) => typeof value === 'string' ? value.trim().toLowerCase() : '';
const profile = (user: Account) => ({ id: user.id, email: user.email, fullName: user.fullName, role: user.role });
const tokenFor = (user: Account) => jwt.sign({}, secret, { subject: user.id, expiresIn: '7d' });

function authenticate(req: AuthedRequest, res: Response, next: NextFunction) {
  const match = /^Bearer (.+)$/.exec(req.header('authorization') || '');
  if (!match) return res.status(401).json({ error: 'Sign in required' });
  try {
    const payload = jwt.verify(match[1], secret) as JwtPayload;
    if (typeof payload.sub !== 'string') return res.status(401).json({ error: 'Invalid session' });
    prisma.user.findUnique({ where: { id: payload.sub } }).then(user => {
      if (!user) return res.status(401).json({ error: 'Account no longer exists' });
      req.account = profile(user);
      next();
    }).catch(next);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}

async function projectAccess(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      select: { id: true, ownerId: true, members: { where: { userId: req.account!.id }, select: { role: true } } }
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (req.account!.role !== 'ADMIN' && project.ownerId !== req.account!.id && project.members.length === 0) {
      return res.status(403).json({ error: 'Project membership required' });
    }
    next();
  } catch (error) { next(error); }
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/register', route(async (req, res) => {
  const { fullName, password, role } = req.body;
  const email = cleanEmail(req.body.email);
  if (!email || !email.includes('@') || typeof fullName !== 'string' || !fullName.trim() ||
      typeof password !== 'string' || password.length < 12 || !validRoles.includes(role)) {
    return res.status(400).json({ error: 'Valid email, name, role and a password of at least 12 characters are required' });
  }
  if (await prisma.user.findUnique({ where: { email } })) return res.status(409).json({ error: 'Email already registered' });
  const user = await prisma.user.create({ data: {
    email, fullName: fullName.trim(), passwordHash: await bcrypt.hash(password, 12), role
  } });
  return res.status(201).json({ user: profile(user), token: tokenFor(user) });
}));

app.post('/api/auth/login', route(async (req, res) => {
  const email = cleanEmail(req.body.email);
  const password = req.body.password;
  const user = email ? await prisma.user.findUnique({ where: { email } }) : null;
  if (!user || typeof password !== 'string' || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  return res.json({ user: profile(user), token: tokenFor(user) });
}));

app.get('/api/auth/me', authenticate, (req: AuthedRequest, res) => res.json(req.account));

app.get('/api/projects', authenticate, route(async (req, res) => {
  const user = req.account!;
  const projects = await prisma.project.findMany({
    where: user.role === 'ADMIN' ? {} : { members: { some: { userId: user.id } } },
    orderBy: { updatedAt: 'desc' },
    include: { members: { select: { userId: true, role: true, user: { select: { fullName: true, email: true } } } } }
  });
  return res.json(projects);
}));

app.post('/api/projects', authenticate, route(async (req, res) => {
  if (req.account!.role !== 'HOMEOWNER' && req.account!.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only homeowners can start projects' });
  }
  const { name, type, location, totalBudget, targetCompletionDate } = req.body;
  const budget = Number(totalBudget);
  const date = new Date(targetCompletionDate);
  if (typeof name !== 'string' || !name.trim() || typeof type !== 'string' || !type.trim() ||
      typeof location !== 'string' || !location.trim() || !Number.isFinite(budget) || budget <= 0 ||
      !Number.isFinite(date.getTime())) return res.status(400).json({ error: 'Valid project details are required' });
  const project = await prisma.project.create({ data: {
    ownerId: req.account!.id, name: name.trim(), type: type.trim(), location: location.trim(),
    totalBudget: budget, targetCompletionDate: date,
    members: { create: { userId: req.account!.id, role: 'HOMEOWNER' } },
    auditEvents: { create: { actorId: req.account!.id, action: 'PROJECT_CREATED' } }
  } });
  return res.status(201).json(project);
}));

app.get('/api/projects/:id', authenticate, projectAccess, route(async (req, res) => {
  return res.json(await prisma.project.findUnique({ where: { id: req.params.id }, include: {
    members: { select: { userId: true, role: true, user: { select: { fullName: true, email: true } } } }
  } }));
}));

app.post('/api/projects/:id/members', authenticate, projectAccess, route(async (req, res) => {
  const project = await prisma.project.findUniqueOrThrow({ where: { id: req.params.id } });
  if (req.account!.role !== 'ADMIN' && project.ownerId !== req.account!.id) {
    return res.status(403).json({ error: 'Only the owner can assign project members' });
  }
  const role = req.body.role;
  const email = cleanEmail(req.body.email);
  if (role !== 'BUILDER' && role !== 'PROCUREMENT') return res.status(400).json({ error: 'Choose builder or procurement membership' });
  const user = email ? await prisma.user.findUnique({ where: { email } }) : null;
  if (!user || user.role !== role) return res.status(404).json({ error: 'Account with matching role not found' });
  const member = await prisma.$transaction(async tx => {
    const created = await tx.projectMember.upsert({
      where: { projectId_userId: { projectId: project.id, userId: user.id } },
      create: { projectId: project.id, userId: user.id, role }, update: { role }
    });
    await tx.auditEvent.create({ data: { projectId: project.id, actorId: req.account!.id,
      action: 'MEMBER_ASSIGNED', entityId: user.id, details: { role } } });
    return created;
  });
  return res.status(201).json(member);
}));

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ error: 'Unexpected server error' });
});

export default app;

if (process.env.NODE_ENV !== 'test') {
  const port = Number(process.env.PORT || 4000);
  app.listen(port, () => console.log(`Construction OS API listening on ${port}`));
}
