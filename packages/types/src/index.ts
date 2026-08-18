export type UserRole = 'HOMEOWNER' | 'BUILDER' | 'DEALER' | 'ADMIN';

export type ConstructionTeamRole = 
  | 'CONTRACTOR'
  | 'ELECTRICIAN'
  | 'PLUMBER'
  | 'PAINTER'
  | 'ARCHITECT'
  | 'MASON'
  | 'GENERAL_LABOUR';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';

export type MilestoneStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';

export type ProductCategory = 
  | 'CEMENT'
  | 'STEEL'
  | 'BRICKS'
  | 'TILES'
  | 'ELECTRICAL'
  | 'PLUMBING'
  | 'SANITARYWARE'
  | 'PAINT'
  | 'HARDWARE';

export type OrderStatus = 
  | 'REQUESTED' 
  | 'UNDER_REVIEW'
  | 'ACCEPTED' 
  | 'INVENTORY_RESERVED'
  | 'PROCESSING'
  | 'READY_FOR_DISPATCH'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'DELIVERED' 
  | 'PARTIALLY_DELIVERED'
  | 'REJECTED' 
  | 'CANCELLED';

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'PRE_ORDER' | 'UNAVAILABLE';

export type DeliveryStatus = 'CREATED' | 'ASSIGNED' | 'PICKUP_PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'CANCELLED' | 'RETURNED';

export type BOQStatus = 'PLANNED' | 'QUOTED' | 'ORDERED' | 'PARTIALLY_ORDERED' | 'DELIVERED' | 'COMPLETED';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
}

export interface ConstructionTeamMember {
  id: string;
  projectId: string;
  contractorId: string;
  name: string;
  role: ConstructionTeamRole;
  phone: string;
  specialization: string;
  assignedMilestoneId?: string;
  assignedMilestoneTitle?: string;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userRole: UserRole | ConstructionTeamRole;
  joinedAt: string;
}

export interface BuilderProfile {
  id: string;
  userId: string;
  companyName: string;
  experienceYears: number;
  serviceArea: string;
  verificationStatus: VerificationStatus;
  portfolio: { title: string; image: string; areaSqFt: number }[];
  rating: number;
  completedProjectsCount: number;
  specialties: string[];
}

export interface DealerProfile {
  id: string;
  userId: string;
  businessName: string;
  gstNumber: string;
  serviceRadiusKm: number;
  verificationStatus: VerificationStatus;
  address: string;
  rating: number;
}

export interface Project {
  id: string;
  homeownerId: string;
  homeownerName?: string;
  builderId?: string;
  builderName?: string;
  name: string;
  type: 'NEW_CONSTRUCTION' | 'RENOVATION' | 'EXTENSION';
  location: string;
  plotAreaSqFt: number;
  totalBudget: number;
  spentCost: number;
  committedCost: number;
  targetCompletionDate: string;
  status: ProjectStatus;
  createdAt: string;
}

export interface MaterialRequirement {
  id: string;
  projectId: string;
  projectName: string;
  contractorId: string;
  contractorName: string;
  category: ProductCategory;
  itemName: string;
  specification: string;
  requiredQty: number;
  orderedQty: number;
  deliveredQty: number;
  remainingQty: number;
  unit: string;
  estimatedUnitPrice: number;
  selectedDealerId?: string;
  selectedDealerName?: string;
  status: 'PENDING' | 'SUPPLIER_SELECTED' | 'ORDERED' | 'PARTIALLY_DELIVERED' | 'COMPLETED';
  createdAt: string;
}

export interface MaterialTraceabilityItem {
  requirementId: string;
  category: ProductCategory;
  itemName: string;
  specification: string;
  requiredQty: number;
  orderedQty: number;
  deliveredQty: number;
  remainingQty: number;
  unit: string;
  contractorName: string;
  supplierName: string;
  orderId?: string;
  orderStatus?: OrderStatus;
  orderedDate?: string;
  deliveredDate?: string;
  invoiceNumber?: string;
  paymentStatus?: string;
  totalValue: number;
}

export interface Product {
  id: string;
  dealerId: string;
  dealerName: string;
  name: string;
  category: ProductCategory;
  brand: string;
  specifications: string;
  unit: string;
  unitPrice: number;
  stockQty: number;
  availableQty?: number;
  reservedQty?: number;
  moq: number;
  deliveryEtaDays: number;
  isVerifiedDealer: boolean;
  rating: number;
  stockStatus?: StockStatus;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  deliveredQuantity?: number;
  totalPrice: number;
}

export interface OrderRequest {
  id: string;
  projectId: string;
  projectName: string;
  homeownerId: string;
  homeownerName: string;
  contractorId?: string;
  contractorName?: string;
  dealerId: string;
  dealerName: string;
  materialRequirementId?: string;
  createdByRole: UserRole;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  expectedDeliveryDate?: string;
  notes?: string;
}

export interface DeliveryJob {
  id: string;
  orderId: string;
  projectId: string;
  projectName: string;
  dealerId: string;
  dealerName: string;
  transporterId?: string;
  transporterName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: DeliveryStatus;
  estimatedEta: string;
  dispatchedQty?: number;
  deliveredQty?: number;
  proofOfDelivery?: {
    recipientName: string;
    photoUrl: string;
    timestamp: string;
    notes?: string;
  };
  createdAt: string;
}

export interface ProjectLedgerEvent {
  id: string;
  projectId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole | ConstructionTeamRole;
  eventType: 
    | 'PROJECT_CREATED'
    | 'CONTRACTOR_ASSIGNED'
    | 'TEAM_MEMBER_ADDED'
    | 'BOQ_CREATED'
    | 'MATERIAL_REQUESTED'
    | 'SUPPLIER_SELECTED'
    | 'ORDER_CREATED'
    | 'ORDER_ACCEPTED'
    | 'INVENTORY_RESERVED'
    | 'ORDER_DISPATCHED'
    | 'PARTIAL_DELIVERY'
    | 'DELIVERY_COMPLETED'
    | 'INVOICE_UPLOADED'
    | 'PAYMENT_RECORDED'
    | 'MILESTONE_UPDATED'
    | 'SITE_UPDATE_ADDED';
  title: string;
  description: string;
  entityId?: string;
  metadata?: any;
  timestamp: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualEndDate?: string | null;
  completionPercentage: number;
  status: MilestoneStatus;
  allocatedBudget: number;
}

export interface SiteUpdate {
  id: string;
  milestoneId: string;
  projectId: string;
  builderId: string;
  builderName: string;
  notes: string;
  completionPercentage: number;
  photoUrl: string;
  timestamp: string;
}

export interface BOQItem {
  id: string;
  boqId: string;
  category: ProductCategory;
  itemName: string;
  specification: string;
  requiredQty: number;
  orderedQty: number;
  deliveredQty: number;
  unit: string;
  estimatedUnitPrice: number;
  estimatedTotal: number;
  matchedProductId?: string;
  status: BOQStatus;
}

export interface BOQ {
  id: string;
  projectId: string;
  title: string;
  totalEstimatedValue: number;
  orderedValue: number;
  deliveredValue: number;
  items: BOQItem[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ORDER' | 'MILESTONE' | 'QUOTE' | 'SYSTEM' | 'VERIFICATION' | 'DELIVERY' | 'ISSUE' | 'CHANGE_ORDER';
  read: boolean;
  timestamp: string;
}

export interface AuditEvent {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole | ConstructionTeamRole;
  action: string;
  entity: string;
  entityId: string;
  metadata?: string;
  timestamp: string;
}
