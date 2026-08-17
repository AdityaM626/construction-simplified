export type UserRole = 'HOMEOWNER' | 'BUILDER' | 'DEALER' | 'ADMIN';

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

export type OrderStatus = 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
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
  moq: number;
  deliveryEtaDays: number;
  isVerifiedDealer: boolean;
  rating: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderRequest {
  id: string;
  projectId: string;
  projectName: string;
  homeownerId: string;
  homeownerName: string;
  dealerId: string;
  dealerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}

export interface QuoteRequest {
  id: string;
  projectId: string;
  projectName: string;
  homeownerId: string;
  homeownerName: string;
  builderId: string;
  builderName: string;
  requirements: string;
  estimatedBudget: number;
  targetTimelineDays: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface DocumentRecord {
  id: string;
  projectId: string;
  title: string;
  category: 'DRAWING' | 'INVOICE' | 'PERMIT' | 'CONTRACT' | 'OTHER';
  fileUrl: string;
  uploadedBy: string;
  uploadedByRole: UserRole;
  sizeBytes: number;
  uploadedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ORDER' | 'MILESTONE' | 'QUOTE' | 'SYSTEM' | 'VERIFICATION';
  read: boolean;
  timestamp: string;
}

export interface AuditEvent {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  metadata?: string;
  timestamp: string;
}
