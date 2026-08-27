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
