export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

export type NodeType = 'customer_owned' | 'ryve_provided';

export type NodeStatus = 'healthy' | 'warning' | 'offline';

export type NetworkStatus = 'healthy' | 'degraded' | 'offline';

export type StorageRequestStatus = 'pending' | 'provisioning' | 'active' | 'cancelled';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  org_type: 'enterprise' | 'academic' | 'team' | 'individual';
  created_at: string;
  plan: 'free_tier' | 'pro_managed' | 'enterprise';
  max_networks: number;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  joined_at: string;
  mfa_enabled: boolean;
}

export interface Network {
  id: string;
  network_id_code: string; // e.g. RYV-NET-8492
  organization_id: string;
  name: string;
  description: string;
  region: string;
  status: NetworkStatus;
  redundancy_policy: string; // e.g. "Reed-Solomon (8+4)"
  encryption_standard: string; // e.g. "AES-256-GCM Zero-Knowledge"
  created_at: string;
  total_storage_bytes: number;
  used_storage_bytes: number;
  node_count: number;
}

export interface NodeDevice {
  id: string;
  node_id_code: string; // e.g. NODE-SJC-01
  network_id: string;
  organization_id: string;
  name: string;
  node_type: NodeType;
  ip_address: string;
  public_key?: string;
  total_storage_bytes: number;
  used_storage_bytes: number;
  status: NodeStatus;
  health_score: number; // 0 - 100
  latency_ms: number;
  last_heartbeat: string;
  version: string;
  os_info: string;
  uptime_pct: number;
  created_at: string;
}

export interface EnrollmentCode {
  id: string;
  network_id: string;
  network_name?: string;
  code: string; // e.g. RYV-ENR-9823-XA7
  created_at: string;
  expires_at: string;
  created_by: string;
  max_uses: number;
  current_uses: number;
  is_active: boolean;
}

export interface StorageRequest {
  id: string;
  organization_id: string;
  network_id: string;
  network_name: string;
  requested_capacity_tb: number;
  billing_cycle: 'monthly' | 'annual';
  price_per_month_usd: number;
  status: StorageRequestStatus;
  provisioned_node_id?: string;
  created_at: string;
}

export interface FileItem {
  id: string;
  organization_id: string;
  network_id: string;
  network_name: string;
  name: string;
  path: string;
  size_bytes: number;
  mime_type: string;
  is_public: boolean;
  chunks_count: number;
  data_chunks: number;
  parity_chunks: number;
  encryption_algorithm: string;
  uploaded_by: string;
  created_at: string;
  hash: string;
}

export interface FileChunk {
  chunk_index: number;
  chunk_hash: string;
  node_id: string;
  node_name: string;
  node_type: NodeType;
  size_bytes: number;
  is_parity: boolean;
  status: 'verified' | 'reconstructing' | 'offline';
}

export interface AuditLog {
  id: string;
  organization_id: string;
  user_name: string;
  user_email: string;
  action: string;
  target_type: 'network' | 'node' | 'file' | 'storage_request' | 'security' | 'billing';
  target_id: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export interface ApiKey {
  id: string;
  organization_id: string;
  name: string;
  key_prefix: string; // e.g. ryve_live_8a3...
  permissions: string[];
  created_at: string;
  last_used_at?: string;
  expires_at?: string;
}

export interface Invoice {
  id: string;
  organization_id: string;
  invoice_number: string;
  amount_usd: number;
  status: 'paid' | 'pending' | 'draft';
  period_start: string;
  period_end: string;
  paid_at?: string;
  storage_tb_billed: number;
}
