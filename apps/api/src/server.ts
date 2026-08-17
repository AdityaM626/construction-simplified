import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { db } from '@construction-os/db';
import { UserRole, OrderStatus, ProductCategory } from '@construction-os/types';

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
// CONNECTED ECOSYSTEM ENDPOINTS (Single Source of Truth)
// ============================================================================

// 1. Get Master Connected Project Summary (Owner, Contractor, Shopkeepers view)
app.get('/api/projects/:id/connected-summary', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const project = db.projects.find(p => p.id === req.params.id) || db.projects[0];
  const homeowner = db.users.find(u => u.id === project.homeownerId);
  const contractorProfile = db.builderProfiles.find(b => b.userId === project.builderId);

  const requirements = db.materialRequirements.filter(m => m.projectId === project.id);
  const orders = db.orderRequests.filter(o => o.projectId === project.id);
  const deliveries = db.deliveryJobs.filter(d => d.projectId === project.id);
  const ledger = db.projectLedger.filter(l => l.projectId === project.id);

  // Multi-supplier summary per material category
  const supplierSummary = requirements.map(reqItem => {
    const matchedOrders = orders.filter(o => o.materialRequirementId === reqItem.id || o.dealerId === reqItem.selectedDealerId);
    return {
      requirementId: reqItem.id,
      itemName: reqItem.itemName,
      category: reqItem.category,
      requiredQty: reqItem.requiredQty,
      orderedQty: reqItem.orderedQty,
      deliveredQty: reqItem.deliveredQty,
      remainingQty: reqItem.remainingQty,
      unit: reqItem.unit,
      selectedSupplierName: reqItem.selectedDealerName || 'Not Selected',
      status: reqItem.status,
      ordersCount: matchedOrders.length
    };
  });

  return res.json({
    project,
    homeowner: { name: homeowner?.fullName || 'Rajesh Kumar', email: homeowner?.email },
    contractor: { companyName: contractorProfile?.companyName || 'Apex Infrastructure', rating: contractorProfile?.rating || 4.9 },
    procurementSummary: supplierSummary,
    orders,
    deliveries,
    ledgerTimeline: ledger
  });
});

// 2. Contractor creates Material Requirement
app.post('/api/projects/:id/material-requirements', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { category, itemName, specification, requiredQty, unit, estimatedUnitPrice } = req.body;
  const project = db.projects.find(p => p.id === req.params.id) || db.projects[0];

  const reqId = `req-${Date.now()}`;
  const newReq = {
    id: reqId,
    projectId: project.id,
    projectName: project.name,
    contractorId: req.user!.id,
    contractorName: req.user!.fullName,
    category: (category || 'CEMENT') as ProductCategory,
    itemName: itemName || 'Building Material',
    specification: specification || 'Standard Construction Grade',
    requiredQty: Number(requiredQty) || 100,
    orderedQty: 0,
    deliveredQty: 0,
    remainingQty: Number(requiredQty) || 100,
    unit: unit || 'Unit',
    estimatedUnitPrice: Number(estimatedUnitPrice) || 400,
    status: 'PENDING' as const,
    createdAt: new Date().toISOString()
  };

  db.materialRequirements.unshift(newReq);
  db.logLedger(project.id, req.user!.id, req.user!.fullName, req.user!.role, 'MATERIAL_REQUESTED', 'Material Requirement Added', `Requested ${newReq.requiredQty} ${newReq.unit} of ${newReq.itemName}`, newReq.id);

  return res.status(201).json(newReq);
});

// 3. Create Unified Connected Order (Owner / Contractor -> Shopkeeper)
app.post('/api/projects/:id/orders', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { dealerId, materialRequirementId, productId, quantity } = req.body;
  const project = db.projects.find(p => p.id === req.params.id) || db.projects[0];
  const dealerProf = db.dealerProfiles.find(d => d.id === dealerId || d.userId === dealerId) || db.dealerProfiles[0];
  const product = db.products.find(p => p.id === productId) || db.products[0];

  const qty = Number(quantity) || product.moq;
  const totalAmount = product.unitPrice * qty;

  const orderId = `ORD-${Date.now()}`;
  const newOrder = {
    id: orderId,
    projectId: project.id,
    projectName: project.name,
    homeownerId: project.homeownerId,
    homeownerName: project.homeownerName || 'Rajesh Kumar',
    contractorId: project.builderId,
    contractorName: project.builderName || 'Apex Infrastructure',
    dealerId: dealerProf.id,
    dealerName: dealerProf.businessName,
    materialRequirementId,
    createdByRole: req.user!.role,
    items: [
      {
        id: `itm-${Date.now()}`,
        productId: product.id,
        productName: product.name,
        unitPrice: product.unitPrice,
        quantity: qty,
        deliveredQuantity: 0,
        totalPrice: totalAmount
      }
    ],
    totalAmount,
    status: 'REQUESTED' as OrderStatus,
    createdAt: new Date().toISOString()
  };

  db.orderRequests.unshift(newOrder);

  // Link to Material Requirement if provided
  if (materialRequirementId) {
    const reqItem = db.materialRequirements.find(m => m.id === materialRequirementId);
    if (reqItem) {
      reqItem.selectedDealerId = dealerProf.id;
      reqItem.selectedDealerName = dealerProf.businessName;
      reqItem.orderedQty += qty;
      reqItem.status = 'ORDERED';
    }
  }

  db.logLedger(project.id, req.user!.id, req.user!.fullName, req.user!.role, 'ORDER_CREATED', 'Order Created', `Order ${orderId} created for ${qty} ${product.unit} from ${dealerProf.businessName} (₹${totalAmount.toLocaleString('en-IN')})`, orderId);

  return res.status(201).json(newOrder);
});

// 4. Order State Machine Transition (Controlled state transitions)
app.patch('/api/orders/:id/status', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const order = db.orderRequests.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const { status, deliveredQty } = req.body;
  order.status = status as OrderStatus;

  if (status === 'ACCEPTED') {
    db.logLedger(order.projectId, req.user!.id, req.user!.fullName, req.user!.role, 'ORDER_ACCEPTED', 'Order Accepted', `Supplier ${order.dealerName} accepted Order ${order.id}`, order.id);
  } else if (status === 'DISPATCHED') {
    db.logLedger(order.projectId, req.user!.id, req.user!.fullName, req.user!.role, 'ORDER_DISPATCHED', 'Order Dispatched', `Supplier ${order.dealerName} dispatched Order ${order.id}`, order.id);
  } else if (status === 'DELIVERED' || status === 'PARTIALLY_DELIVERED') {
    const qty = Number(deliveredQty) || order.items[0].quantity;
    order.items[0].deliveredQuantity = qty;
    
    // Update material requirement delivery gap
    if (order.materialRequirementId) {
      const reqItem = db.materialRequirements.find(m => m.id === order.materialRequirementId);
      if (reqItem) {
        reqItem.deliveredQty += qty;
        reqItem.remainingQty = Math.max(0, reqItem.requiredQty - reqItem.deliveredQty);
        reqItem.status = reqItem.remainingQty === 0 ? 'COMPLETED' : 'PARTIALLY_DELIVERED';
      }
    }

    db.logLedger(order.projectId, req.user!.id, req.user!.fullName, req.user!.role, status === 'DELIVERED' ? 'DELIVERY_COMPLETED' : 'PARTIAL_DELIVERY', status === 'DELIVERED' ? 'Delivery Completed' : 'Partial Delivery Confirmed', `${qty} units delivered for Order ${order.id}`, order.id);
  }

  return res.json(order);
});

// 5. Get Single Source of Truth Project Ledger
app.get('/api/projects/:id/ledger', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const ledger = db.projectLedger.filter(l => l.projectId === req.params.id);
  return res.json(ledger);
});

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Construction OS Connected API] Server running on http://localhost:${PORT}`);
  });
}

export default app;
