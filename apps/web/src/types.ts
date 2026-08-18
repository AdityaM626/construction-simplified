export * from '@construction-os/types';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';

export interface TaskItem {
  id: string;
  projectId: string;
  milestoneId?: string;
  title: string;
  assignedTo?: string;
  assignedRole?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate: string;
  status: TaskStatus;
}

export interface WorkforceTeam {
  id: string;
  builderId?: string;
  name?: string;
  teamName?: string;
  trade: string;
  workerCount?: number;
  headcount?: number;
  dailyRateTotal?: number;
  status?: string;
}

export interface InventoryMovement {
  id: string;
  dealerId?: string;
  productId: string;
  productName: string;
  type?: 'RESTOCK' | 'RESERVATION' | 'DISPATCH' | 'ADJUSTMENT' | 'STOCK_ADDITION';
  movementType?: 'RESTOCK' | 'RESERVATION' | 'DISPATCH' | 'ADJUSTMENT' | 'STOCK_ADDITION';
  quantityChange?: number;
  changeQty?: number;
  previousQty?: number;
  newQty?: number;
  timestamp: string;
  reason: string;
}

export interface BOQ {
  id: string;
  projectId: string;
  title: string;
  totalEstimatedValue: number;
  orderedValue: number;
  deliveredValue: number;
  items: any[];
  createdAt: string;
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
  requestedByRole?: string;
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
  createdBy?: string;
  createdByRole?: string;
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
  payerId?: string;
  payeeId?: string;
  currency?: string;
  receiptUrl?: string;
  transactionReference: string;
  amount: number;
  type?: string;
  payerName?: string;
  payeeName?: string;
  paymentMethod?: string;
  status: 'PAID' | 'PENDING' | 'FAILED' | 'SUCCESS';
  timestamp: string;
}

export interface ReviewItem {
  id: string;
  authorId?: string;
  targetId?: string;
  targetType?: string;
  interactionId?: string;
  authorName: string;
  targetName?: string;
  rating: number;
  qualityRating?: number;
  timelinessRating?: number;
  communicationRating?: number;
  comment: string;
  isVerifiedInteraction: boolean;
  timestamp?: string;
  createdAt?: string;
}

export interface DocumentRecord {
  id: string;
  projectId: string;
  title: string;
  category: 'DRAWING' | 'INVOICE' | 'PERMIT' | 'CONTRACT' | 'OTHER';
  fileUrl: string;
  uploadedBy: string;
  uploadedByRole: any;
  sizeBytes: number;
  uploadedAt: string;
}
