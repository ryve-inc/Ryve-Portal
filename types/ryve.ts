export interface Organization {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
}

export interface AllocatedNode {
  id: string;
  organizationId: string;
  capacityGb: number;
  networkAddress: string;
  durationMonths: number;
  purchasedAt: string;
  expiresAt: string;
  status: 'active' | 'expired';
  createdAt: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  duration?: number;
}
