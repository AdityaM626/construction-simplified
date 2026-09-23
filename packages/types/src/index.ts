/** Production product personas. */
export type ProductPersona = 'HOMEOWNER' | 'BUILDER' | 'PROCUREMENT' | 'ADMIN';

export type UserRole = ProductPersona;

export type ConstructionTeamRole = 
  | 'CONTRACTOR'
  | 'ELECTRICIAN'
  | 'PLUMBER'
  | 'PAINTER'
  | 'ARCHITECT'
  | 'MASON'
  | 'GENERAL_LABOUR'
  | 'DEALER';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type ProjectStatus = 
  | 'LEAD'
  | 'ESTIMATION'
  | 'PROPOSAL'
  | 'AWAITING_OWNER_APPROVAL'
  | 'APPROVED'
  | 'PLANNING'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'HANDED_OVER'
  | 'CLOSED';

export type ProjectHealthStatus = 'HEALTHY' | 'AT_RISK' | 'CRITICAL';

export type MilestoneStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'AWAITING_APPROVAL' | 'COMPLETED' | 'DELAYED' | 'BLOCKED';

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

export type BudgetVsActualCategory = 
  | 'MATERIALS'
  | 'LABOUR'
  | 'EQUIPMENT'
  | 'LOGISTICS'
  | 'DESIGN'
  | 'OTHER';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  isVerified?: boolean;
  createdAt?: string;
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

export interface Project {
  id: string;
  homeownerId: string;
  homeownerName?: string;
  homeownerPhone?: string;
  builderId?: string;
  builderName?: string;
  name: string;
  type: 'NEW_CONSTRUCTION' | 'RENOVATION' | 'EXTENSION';
  location: string;
  builtUpAreaSqFt?: number;
  plotAreaSqFt?: number;
  floorsCount?: number;
  contractValue?: number;
  totalBudget: number;
  spentCost: number;
  committedCost: number;
  paidAmount?: number;
  startDate?: string;
  targetCompletionDate: string;
  status: ProjectStatus;
  projectHealth?: ProjectHealthStatus;
  healthReason?: string;
  currentPhase?: string;
  completionPercentage?: number;
  createdAt: string;
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

export interface MultiDimensionHealth {
  overall: ProjectHealthStatus;
  explanation: string;
  dimensions: {
    schedule: { status: ProjectHealthStatus; detail: string };
    budget: { status: ProjectHealthStatus; detail: string };
    quality: { status: ProjectHealthStatus; detail: string };
    payments: { status: ProjectHealthStatus; detail: string };
    approvals: { status: ProjectHealthStatus; detail: string };
  };
}

export interface ActionItem {
  id: string;
  projectId: string;
  projectName: string;
  targetRole: UserRole;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  title: string;
  description: string;
  actionText: string;
  objectType: 'CHANGE_ORDER' | 'MILESTONE' | 'PAYMENT' | 'ISSUE' | 'DOCUMENT' | 'SITE_REPORT';
  objectId: string;
  dueDate?: string;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
}

export interface BeforeAfterEvidence {
  id: string;
  projectId: string;
  title: string;
  category: string;
  beforePhotoUrl: string;
  afterPhotoUrl: string;
  description: string;
  dateCompleted: string;
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
  requiresOwnerApproval?: boolean;
  dependsOnMilestoneId?: string;
  downstreamImpactWarning?: string;
}

export interface QualityCheckpoint {
  id: string;
  projectId: string;
  title: string;
  category: 'WATERPROOFING' | 'CONCRETE_CURING' | 'REBAR_SPACING' | 'SHUTTERING' | 'PLUMBING_LEAK_TEST' | 'ELECTRICAL_EARTHING';
  status: 'PASS' | 'FAIL' | 'REWORK_REQUIRED';
  inspectorName: string;
  inspectionDate: string;
  notes: string;
  photoUrls: string[];
}

export interface DefectRecord {
  id: string;
  projectId: string;
  title: string;
  description: string;
  defectType: 'CRACK' | 'SEEPAGE' | 'PAINT_DEFECT' | 'ELECTRICAL_FAULT' | 'PLUMBING_LEAK' | 'OTHER';
  location: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  responsibleTrade: string;
  reworkTimeDays: number;
  reworkCost: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'VERIFIED_CLOSED';
  discoveredDate: string;
  resolvedDate?: string;
  photoUrl?: string;
}

export interface DigitalHandoverRecord {
  id: string;
  projectId: string;
  handoverDate: string;
  finalContractValue: number;
  finalAmountPaid: number;
  outstandingBalance: number;
  openDefectsCount: number;
  isFinalInspectionPassed: boolean;
  homeownerConfirmed: boolean;
  homeownerConfirmedAt?: string;
  contractorConfirmed: boolean;
  contractorConfirmedAt?: string;
  documentsBundle: { name: string; category: string; url: string }[];
}

export interface HomePassportRecord {
  id: string;
  projectId: string;
  propertyName: string;
  address: string;
  builtUpAreaSqFt: number;
  floorsCount: number;
  constructionStartDate: string;
  handoverDate: string;
  contractorName: string;
  contractorPhone: string;
  systems: {
    electrical: { dbBoardLocation: string; wiringBrand: string; mainBreakerCapacity: string };
    plumbing: { pipeBrand: string; pumpSpecs: string; tankCapacityLiters: number };
    waterproofing: { chemicalBrand: string; warrantyYears: number };
    paint: { interiorBrand: string; exteriorBrand: string };
    flooring: { materialType: string; brand: string };
  };
  maintenanceHistory: { date: string; title: string; category: string; cost: number; performedBy: string }[];
}

export interface BOQItem {
  id: string;
  boqId: string;
  category: ProductCategory;
  itemName: string;
  description?: string;
  specification?: string;
  quantity?: number;
  requiredQty?: number;
  orderedQty?: number;
  deliveredQty?: number;
  unit: string;
  estimatedRate?: number;
  estimatedUnitPrice?: number;
  estimatedTotal: number;
  actualSpent?: number;
  variance?: number;
  matchedProductId?: string;
  status?: string;
}

export interface BOQ {
  id: string;
  projectId: string;
  title: string;
  totalEstimatedValue: number;
  totalActualValue?: number;
  orderedValue?: number;
  deliveredValue?: number;
  variance?: number;
  items: BOQItem[];
  createdAt: string;
}

export interface BudgetVsActualRecord {
  category: BudgetVsActualCategory;
  estimatedAmount: number;
  actualSpent: number;
  varianceAmount: number;
  variancePercentage: number;
  notes?: string;
}

export interface DailySiteReport {
  id: string;
  projectId: string;
  date: string;
  weather?: string;
  workersPresentCount: number;
  workCompleted: string;
  materialsReceived?: string;
  issuesEncountered?: string;
  photoUrls: string[];
  tomorrowsPlan: string;
  submittedBy: string;
  createdAt: string;
}

export interface VendorProcurementRecord {
  id: string;
  projectId: string;
  contractorId: string;
  vendorName: string;
  category: ProductCategory;
  itemName: string;
  quantity: number;
  unit: string;
  unitRate: number;
  totalAmount: number;
  invoiceNumber: string;
  purchaseDate: string;
  deliveryDate: string;
  paymentStatus: 'PAID' | 'PENDING' | 'PARTIAL';
}

export interface ChangeOrder {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  reason?: string;
  originalScope?: string;
  proposedChange?: string;
  costImpact: number;
  timelineImpactDays: number;
  requestedBy: string;
  requestedByRole: UserRole;
  approvedBy?: string;
  approvedAt?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  createdAt: string;
}

export interface IssueRecord {
  id: string;
  projectId: string;
  title: string;
  description: string;
  category?: string;
  createdBy: string;
  createdByRole: UserRole;
  assignedTo?: string;
  photoUrl?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
}

export type IssueSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface PaymentTransaction {
  id: string;
  projectId: string;
  orderId?: string;
  payerId: string;
  payerName: string;
  payeeId: string;
  payeeName: string;
  amount: number;
  paymentMethod: string;
  currency?: string;
  transactionReference: string;
  receiptUrl?: string;
  status: 'PAID' | 'PENDING' | 'FAILED' | 'SUCCESS';
  timestamp: string;
}

export interface DocumentRecord {
  id: string;
  projectId: string;
  title: string;
  category: 'CONTRACT' | 'BOQ' | 'DRAWING' | 'INVOICE' | 'PERMIT' | 'RECEIPT' | 'WARRANTY' | 'OTHER';
  fileUrl: string;
  uploadedBy: string;
  uploadedByRole: UserRole;
  sizeBytes: number;
  uploadedAt: string;
}

export interface ContextualMessage {
  id: string;
  projectId: string;
  entityType: 'PROJECT' | 'MILESTONE' | 'ISSUE' | 'CHANGE_REQUEST' | 'PAYMENT';
  entityId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
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
  stockStatus?: string;
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
  status: string;
  createdAt: string;
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
  items: any[];
  totalAmount: number;
  status: string;
  expectedDeliveryDate?: string;
  createdAt: string;
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
  status: string;
  estimatedEta: string;
  proofOfDelivery?: any;
  createdAt: string;
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

export interface ProjectLedgerEvent {
  id: string;
  projectId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole | ConstructionTeamRole;
  eventType: any;
  title: string;
  description: string;
  entityId?: string;
  metadata?: any;
  timestamp: string;
}
