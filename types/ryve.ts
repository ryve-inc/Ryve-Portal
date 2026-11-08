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
  networkId?: string | null;
  durationMonths: number;
  purchasedAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'decommissioned';
  createdAt: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  duration?: number;
}
