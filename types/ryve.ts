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

export interface DaemonHealth {
  status: string;
  nodeReady: boolean;
  uptimeSeconds: number;
  timestamp: string;
}

export interface DaemonNetworkItem {
  id: string;
  name: string;
  networkKeyHex: string;
  networkLink: string;
  peers: number;
  allocatedBytes: number;
  allocatedGb: number;
  usedBytes: number;
  usedMb: number;
  availableBytes: number;
  utilizationPercent: number;
}

export interface DaemonStorageStats {
  totalAllocatedBytes: number;
  totalAllocatedGb: number;
  totalUsedBytes: number;
  totalUsedMb: number;
  totalFreeDiskBytes: number;
  totalFreeDiskGb: number;
  reservedSystemBytes: number;
}

export interface DaemonStatus {
  success: boolean;
  nodeId?: string;
  displayName?: string;
  online?: boolean;
  totalPeerCount?: number;
  networksCount?: number;
  networks?: DaemonNetworkItem[];
  storage?: DaemonStorageStats;
  offline?: boolean;
  error?: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  duration?: number;
}
