'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Organization, 
  OrganizationMember, 
  Network, 
  NodeDevice, 
  FileItem, 
  FileChunk,
  StorageRequest, 
  AuditLog, 
  ApiKey, 
  Invoice,
  EnrollmentCode,
  UserRole,
  NodeType,
  NodeStatus
} from '@/types/ryve';

// Default initial state (without external mock files)
const defaultOrganization: Organization = {
  id: 'org-ryve-primary',
  name: 'SJCET Distributed Labs',
  slug: 'sjcet-labs',
  org_type: 'academic',
  plan: 'pro_managed',
  max_networks: 10,
  created_at: '2026-01-15T08:00:00Z',
};

const defaultMembers: OrganizationMember[] = [
  {
    id: 'mem-1',
    organization_id: 'org-ryve-primary',
    user_id: 'usr-1',
    name: 'Alex Rivers',
    email: 'alex@acme.corp',
    role: 'owner',
    mfa_enabled: true,
    joined_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'mem-2',
    organization_id: 'org-ryve-primary',
    user_id: 'usr-2',
    name: 'Sarah Chen',
    email: 'sarah@acme.corp',
    role: 'admin',
    mfa_enabled: true,
    joined_at: '2026-02-01T10:30:00Z',
  },
  {
    id: 'mem-3',
    organization_id: 'org-ryve-primary',
    user_id: 'usr-3',
    name: 'David Miller',
    email: 'david@acme.corp',
    role: 'member',
    mfa_enabled: false,
    joined_at: '2026-03-11T14:15:00Z',
  },
];

const defaultNetworks: Network[] = [
  {
    id: 'net-1',
    network_id_code: 'RYV-NET-8492',
    organization_id: 'org-ryve-primary',
    name: 'SJCET Lab Network',
    description: 'High-speed campus mesh connecting lab servers and Ryve managed pods',
    region: 'ap-south-1',
    status: 'healthy',
    redundancy_policy: 'Reed-Solomon (8+4)',
    encryption_standard: 'AES-256-GCM Zero-Knowledge',
    created_at: '2026-01-16T12:00:00Z',
    total_storage_bytes: 8400000000000,
    used_storage_bytes: 3120000000000,
    node_count: 5,
  },
  {
    id: 'net-2',
    network_id_code: 'RYV-NET-4029',
    organization_id: 'org-ryve-primary',
    name: 'Production Storage Mesh',
    description: 'Mission-critical distributed storage across rack servers and NVMe blocks',
    region: 'us-east-1',
    status: 'healthy',
    redundancy_policy: 'Reed-Solomon (8+4)',
    encryption_standard: 'AES-256-GCM Zero-Knowledge',
    created_at: '2026-02-10T09:40:00Z',
    total_storage_bytes: 18400000000000,
    used_storage_bytes: 8200000000000,
    node_count: 6,
  },
];

const defaultNodes: NodeDevice[] = [
  {
    id: 'node-1',
    node_id_code: 'NODE-SJC-01',
    network_id: 'net-1',
    organization_id: 'org-ryve-primary',
    name: 'Lab Server Alpha (Rack 01)',
    node_type: 'customer_owned',
    ip_address: '192.168.10.24',
    total_storage_bytes: 2000000000000,
    used_storage_bytes: 840000000000,
    status: 'healthy',
    health_score: 99,
    latency_ms: 12,
    last_heartbeat: 'Just now',
    version: 'v1.4.2-p2p',
    os_info: 'Ubuntu Server 24.04 LTS (x86_64)',
    uptime_pct: 99.98,
    created_at: '2026-01-16T13:00:00Z',
  },
  {
    id: 'node-2',
    node_id_code: 'NODE-SJC-02',
    network_id: 'net-1',
    organization_id: 'org-ryve-primary',
    name: 'CS Dept Synology NAS-8B',
    node_type: 'customer_owned',
    ip_address: '192.168.10.88',
    total_storage_bytes: 2400000000000,
    used_storage_bytes: 1120000000000,
    status: 'healthy',
    health_score: 97,
    latency_ms: 16,
    last_heartbeat: 'Just now',
    version: 'v1.4.2-p2p',
    os_info: 'DSM 7.2 (Linux 5.10)',
    uptime_pct: 99.85,
    created_at: '2026-01-16T14:20:00Z',
  },
  {
    id: 'node-3',
    node_id_code: 'NODE-SJC-03',
    network_id: 'net-1',
    organization_id: 'org-ryve-primary',
    name: 'Ryve Managed Edge Pod 01',
    node_type: 'ryve_provided',
    ip_address: '43.204.18.91',
    total_storage_bytes: 2000000000000,
    used_storage_bytes: 620000000000,
    status: 'healthy',
    health_score: 100,
    latency_ms: 22,
    last_heartbeat: 'Just now',
    version: 'v1.4.2-p2p',
    os_info: 'RyveOS Alpine Container (NVMe High-IOPS)',
    uptime_pct: 100.0,
    created_at: '2026-02-05T10:00:00Z',
  },
  {
    id: 'node-4',
    node_id_code: 'NODE-PRD-01',
    network_id: 'net-2',
    organization_id: 'org-ryve-primary',
    name: 'Primary Cluster Master 01',
    node_type: 'customer_owned',
    ip_address: '10.0.12.50',
    total_storage_bytes: 5000000000000,
    used_storage_bytes: 2400000000000,
    status: 'healthy',
    health_score: 98,
    latency_ms: 9,
    last_heartbeat: 'Just now',
    version: 'v1.4.2-p2p',
    os_info: 'RHEL 9.3 (x86_64)',
    uptime_pct: 99.99,
    created_at: '2026-02-10T10:00:00Z',
  },
  {
    id: 'node-5',
    node_id_code: 'NODE-PRD-02',
    network_id: 'net-2',
    organization_id: 'org-ryve-primary',
    name: 'Ryve Provisioned Block S3-Compat',
    node_type: 'ryve_provided',
    ip_address: '54.210.82.14',
    total_storage_bytes: 6000000000000,
    used_storage_bytes: 2800000000000,
    status: 'healthy',
    health_score: 100,
    latency_ms: 15,
    last_heartbeat: 'Just now',
    version: 'v1.4.2-p2p',
    os_info: 'Ryve Dedicated Datacenter Node (Virginia)',
    uptime_pct: 100.0,
    created_at: '2026-02-12T14:30:00Z',
  },
];

const defaultFiles: FileItem[] = [
  {
    id: 'file-1',
    organization_id: 'org-ryve-primary',
    network_id: 'net-1',
    network_name: 'SJCET Lab Network',
    name: 'distributed_ml_checkpoint_epoch_48.safetensors',
    path: '/models/ai/2026/',
    size_bytes: 4294967296,
    mime_type: 'application/octet-stream',
    is_public: false,
    chunks_count: 12,
    data_chunks: 8,
    parity_chunks: 4,
    encryption_algorithm: 'AES-256-GCM',
    uploaded_by: 'Alex Rivers',
    created_at: '2026-03-28T14:30:00Z',
    hash: 'sha256-9f83ac02d3381a179c3b88a9e201c9a',
  },
  {
    id: 'file-2',
    organization_id: 'org-ryve-primary',
    network_id: 'net-2',
    network_name: 'Production Storage Mesh',
    name: 'postgresql_db_cluster_snapshot_full.tar.zst',
    path: '/backups/databases/',
    size_bytes: 15032385536,
    mime_type: 'application/zstd',
    is_public: false,
    chunks_count: 12,
    data_chunks: 8,
    parity_chunks: 4,
    encryption_algorithm: 'AES-256-GCM',
    uploaded_by: 'Sarah Chen',
    created_at: '2026-03-30T04:00:00Z',
    hash: 'sha256-ee0498b31a29384910cf321ba99d211',
  },
];

const defaultEnrollmentCodes: EnrollmentCode[] = [
  {
    id: 'enr-1',
    network_id: 'net-1',
    network_name: 'SJCET Lab Network',
    code: 'RYV-ENR-9821-XA7',
    created_by: 'Alex Rivers',
    max_uses: 10,
    current_uses: 2,
    is_active: true,
    created_at: '2026-03-30T10:00:00Z',
    expires_at: '2026-04-06T10:00:00Z',
  },
];

const defaultStorageRequests: StorageRequest[] = [
  {
    id: 'req-1',
    organization_id: 'org-ryve-primary',
    network_id: 'net-1',
    network_name: 'SJCET Lab Network',
    requested_capacity_tb: 2,
    billing_cycle: 'monthly',
    price_per_month_usd: 8.0,
    status: 'active',
    provisioned_node_id: 'node-3',
    created_at: '2026-02-05T09:45:00Z',
  },
];

const defaultAuditLogs: AuditLog[] = [
  {
    id: 'aud-1',
    organization_id: 'org-ryve-primary',
    user_name: 'Alex Rivers',
    user_email: 'alex@acme.corp',
    action: 'NODE_ENROLLED',
    target_type: 'node',
    target_id: 'NODE-SJC-02',
    details: 'Customer node joined SJCET Lab Network via enrollment code RYV-ENR-9821-XA7',
    ip_address: '192.168.10.88',
    created_at: 'Just now',
  },
  {
    id: 'aud-2',
    organization_id: 'org-ryve-primary',
    user_name: 'Sarah Chen',
    user_email: 'sarah@acme.corp',
    action: 'STORAGE_PROVISIONED',
    target_type: 'storage_request',
    target_id: 'NODE-PRD-02',
    details: 'Provisioned 6 TB dedicated Ryve High-IOPS NVMe pod under Production Storage Mesh',
    ip_address: '54.210.82.14',
    created_at: '15 mins ago',
  },
];

const defaultApiKeys: ApiKey[] = [
  {
    id: 'key-1',
    organization_id: 'org-ryve-primary',
    name: 'CI/CD Automated Deployment Daemon',
    key_prefix: 'ryve_live_89a3f2819c',
    permissions: ['nodes:read', 'files:read', 'files:write'],
    created_at: '2026-03-10T12:00:00Z',
    last_used_at: '12 minutes ago',
  },
];

const defaultInvoices: Invoice[] = [
  {
    id: 'inv-1',
    organization_id: 'org-ryve-primary',
    invoice_number: 'INV-RYV-2026-03',
    amount_usd: 32.0,
    status: 'paid',
    period_start: '2026-03-01',
    period_end: '2026-03-31',
    paid_at: '2026-04-01T00:05:00Z',
    storage_tb_billed: 8.0,
  },
];

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

interface RyveContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedNetworkId: string;
  setSelectedNetworkId: (id: string) => void;
  
  organization: Organization;
  updateOrganization: (updates: Partial<Organization>) => void;
  members: OrganizationMember[];
  addMember: (name: string, email: string, role: UserRole) => void;
  removeMember: (id: string) => void;
  updateMemberRole: (id: string, role: UserRole) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;

  networks: Network[];
  createNetwork: (data: { name: string; description: string; region: string; redundancyPolicy: string }) => Network;
  deleteNetwork: (id: string) => void;

  nodes: NodeDevice[];
  registerCustomerNode: (networkId: string, nodeName: string, capacityTb: number, osInfo?: string) => NodeDevice;
  requestRyveStorageNode: (networkId: string, capacityTb: number, billingCycle: 'monthly' | 'annual') => Promise<void>;
  removeNode: (id: string) => void;
  toggleNodeStatus: (id: string) => void;

  enrollmentCodes: EnrollmentCode[];
  generateEnrollmentCode: (networkId: string, maxUses?: number) => EnrollmentCode;

  files: FileItem[];
  uploadFile: (file: { name: string; sizeBytes: number; mimeType: string; networkId: string }) => FileItem;
  deleteFile: (id: string) => void;
  toggleFilePublic: (id: string) => void;
  getFileChunks: (file: FileItem) => FileChunk[];

  storageRequests: StorageRequest[];
  invoices: Invoice[];

  auditLogs: AuditLog[];
  apiKeys: ApiKey[];
  generateApiKey: (name: string, permissions: string[]) => { key: ApiKey; secret: string };
  revokeApiKey: (id: string) => void;

  stats: {
    totalStorageBytes: number;
    usedStorageBytes: number;
    availableStorageBytes: number;
    customerOwnedBytes: number;
    ryveProvidedBytes: number;
    customerUsedBytes: number;
    ryveUsedBytes: number;
    activeNodesCount: number;
    warningNodesCount: number;
    offlineNodesCount: number;
    healthScore: number;
    monthlySpendUsd: number;
  };

  isAddNodeModalOpen: boolean;
  openAddNodeModal: (defaultTab?: 'customer' | 'ryve') => void;
  closeAddNodeModal: () => void;
  addNodeModalTab: 'customer' | 'ryve';
  setAddNodeModalTab: (tab: 'customer' | 'ryve') => void;

  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const RyveContext = createContext<RyveContextType | undefined>(undefined);

export function RyveProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedNetworkId, setSelectedNetworkId] = useState<string>('all');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('owner');

  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false);
  const [addNodeModalTab, setAddNodeModalTab] = useState<'customer' | 'ryve'>('customer');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [organization, setOrganization] = useState<Organization>(defaultOrganization);
  const [members, setMembers] = useState<OrganizationMember[]>(defaultMembers);
  const [networks, setNetworks] = useState<Network[]>(defaultNetworks);
  const [nodes, setNodes] = useState<NodeDevice[]>(defaultNodes);
  const [files, setFiles] = useState<FileItem[]>(defaultFiles);
  const [enrollmentCodes, setEnrollmentCodes] = useState<EnrollmentCode[]>(defaultEnrollmentCodes);
  const [storageRequests, setStorageRequests] = useState<StorageRequest[]>(defaultStorageRequests);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(defaultAuditLogs);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(defaultApiKeys);
  const [invoices, setInvoices] = useState<Invoice[]>(defaultInvoices);

  // Sync with Server Drizzle Endpoints on Mount
  useEffect(() => {
    // 1. Fetch Networks from Drizzle ORM
    fetch('/api/networks')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: Network[] = json.data.map((n: any) => ({
            id: n.id,
            network_id_code: n.networkIdCode,
            organization_id: n.organizationId,
            name: n.name,
            description: n.description || '',
            region: n.region,
            status: n.status,
            redundancy_policy: n.redundancyPolicy,
            encryption_standard: n.encryptionStandard,
            total_storage_bytes: Number(n.totalStorageBytes) || 0,
            used_storage_bytes: Number(n.usedStorageBytes) || 0,
            node_count: Number(n.nodeCount) || 0,
            created_at: n.createdAt,
          }));
          setNetworks(mapped);
        }
      })
      .catch(() => {});

    // 2. Fetch Nodes from Drizzle ORM
    fetch('/api/nodes')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: NodeDevice[] = json.data.map((n: any) => ({
            id: n.id,
            node_id_code: n.nodeIdCode,
            network_id: n.networkId,
            organization_id: n.organizationId,
            name: n.name,
            node_type: n.nodeType,
            ip_address: n.ipAddress,
            total_storage_bytes: Number(n.totalStorageBytes) || 0,
            used_storage_bytes: Number(n.usedStorageBytes) || 0,
            status: n.status,
            health_score: Number(n.healthScore) || 100,
            latency_ms: Number(n.latencyMs) || 15,
            last_heartbeat: n.lastHeartbeat || 'Just now',
            version: n.version || 'v1.4.2-p2p',
            os_info: n.osInfo || 'Linux',
            uptime_pct: Number(n.uptimePct) || 100,
            created_at: n.createdAt,
          }));
          setNodes(mapped);
        }
      })
      .catch(() => {});

    // 3. Fetch Files
    fetch('/api/files')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: FileItem[] = json.data.map((f: any) => ({
            id: f.id,
            organization_id: f.organizationId,
            network_id: f.networkId,
            network_name: f.networkName,
            name: f.name,
            path: f.path,
            size_bytes: Number(f.sizeBytes) || 0,
            mime_type: f.mimeType,
            is_public: Boolean(f.isPublic),
            chunks_count: f.chunksCount || 12,
            data_chunks: f.dataChunks || 8,
            parity_chunks: f.parityChunks || 4,
            encryption_algorithm: f.encryptionAlgorithm,
            uploaded_by: f.uploadedBy,
            created_at: f.createdAt,
            hash: f.hash,
          }));
          setFiles(mapped);
        }
      })
      .catch(() => {});

    // 4. Fetch Audit Logs
    fetch('/api/audit-logs')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: AuditLog[] = json.data.map((a: any) => ({
            id: a.id,
            organization_id: a.organizationId,
            user_name: a.userName,
            user_email: a.userEmail,
            action: a.action,
            target_type: a.targetType,
            target_id: a.targetId,
            details: a.details,
            ip_address: a.ipAddress,
            created_at: a.createdAt,
          }));
          setAuditLogs(mapped);
        }
      })
      .catch(() => {});
  }, []);

  // Toasts
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add Log
  const logAction = (action: string, targetType: AuditLog['target_type'], targetId: string, details: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      organization_id: organization.id,
      user_name: 'Alex Rivers',
      user_email: 'alex@acme.corp',
      action,
      target_type: targetType,
      target_id: targetId,
      details,
      ip_address: '127.0.0.1',
      created_at: 'Just now',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Async push to Drizzle
    fetch('/api/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLog),
    }).catch(() => {});
  };

  // Organization
  const updateOrganization = (updates: Partial<Organization>) => {
    setOrganization((prev) => ({ ...prev, ...updates }));
    logAction('ORG_SETTINGS_UPDATED', 'security', organization.id, 'Updated organization details');
    addToast({ type: 'success', title: 'Organization updated' });
  };

  // Members
  const addMember = (name: string, email: string, role: UserRole) => {
    const newMem: OrganizationMember = {
      id: `mem-${Date.now()}`,
      organization_id: organization.id,
      user_id: `usr-${Date.now()}`,
      name,
      email,
      role,
      mfa_enabled: false,
      joined_at: new Date().toISOString(),
    };
    setMembers((prev) => [...prev, newMem]);
    logAction('MEMBER_INVITED', 'security', email, `Invited ${email} as ${role}`);
    addToast({ type: 'success', title: 'Member invited', description: `Invitation dispatched to ${email}` });
  };

  const removeMember = (id: string) => {
    const mem = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (mem) {
      logAction('MEMBER_REMOVED', 'security', mem.email, `Removed ${mem.name} (${mem.email})`);
      addToast({ type: 'info', title: 'Member removed', description: `${mem.name} was removed` });
    }
  };

  const updateMemberRole = (id: string, role: UserRole) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    const mem = members.find((m) => m.id === id);
    if (mem) {
      logAction('ROLE_CHANGED', 'security', mem.email, `Updated role to ${role}`);
      addToast({ type: 'success', title: 'Role updated', description: `${mem.name} is now a ${role}` });
    }
  };

  // Networks
  const createNetwork = (data: { name: string; description: string; region: string; redundancyPolicy: string }) => {
    const netCode = `RYV-NET-${Math.floor(1000 + Math.random() * 9000)}`;
    const newNet: Network = {
      id: `net-${Date.now()}`,
      network_id_code: netCode,
      organization_id: organization.id,
      name: data.name,
      description: data.description,
      region: data.region,
      status: 'healthy',
      redundancy_policy: data.redundancyPolicy || 'Reed-Solomon (8+4)',
      encryption_standard: 'AES-256-GCM Zero-Knowledge',
      created_at: new Date().toISOString(),
      total_storage_bytes: 0,
      used_storage_bytes: 0,
      node_count: 0,
    };

    setNetworks((prev) => [...prev, newNet]);
    logAction('NETWORK_CREATED', 'network', netCode, `Created network "${data.name}"`);
    addToast({ type: 'success', title: 'Network created', description: `${data.name} (${netCode})` });

    // Persist to Drizzle
    fetch('/api/networks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        region: data.region,
        redundancyPolicy: data.redundancyPolicy,
      }),
    }).catch(() => {});

    return newNet;
  };

  const deleteNetwork = (id: string) => {
    const net = networks.find((n) => n.id === id);
    if (!net) return;
    setNetworks((prev) => prev.filter((n) => n.id !== id));
    setNodes((prev) => prev.filter((n) => n.network_id !== id));
    if (selectedNetworkId === id) setSelectedNetworkId('all');
    logAction('NETWORK_DELETED', 'network', net.network_id_code, `Deleted network "${net.name}"`);
    addToast({ type: 'warning', title: 'Network deleted', description: `Network ${net.name} removed` });

    // Drizzle delete
    fetch(`/api/networks?id=${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // Nodes
  const registerCustomerNode = (networkId: string, nodeName: string, capacityTb: number, osInfo?: string) => {
    const net = networks.find((n) => n.id === networkId);
    const nodeCode = `NODE-${Math.floor(100 + Math.random() * 900)}`;
    const totalBytes = capacityTb * 1000000000000;
    const newNode: NodeDevice = {
      id: `node-${Date.now()}`,
      node_id_code: nodeCode,
      network_id: networkId,
      organization_id: organization.id,
      name: nodeName,
      node_type: 'customer_owned',
      ip_address: `192.168.10.${Math.floor(20 + Math.random() * 200)}`,
      total_storage_bytes: totalBytes,
      used_storage_bytes: Math.floor(totalBytes * 0.15),
      status: 'healthy',
      health_score: 99,
      latency_ms: Math.floor(10 + Math.random() * 20),
      last_heartbeat: 'Just now',
      version: 'v1.4.2-p2p',
      os_info: osInfo || 'Ubuntu Server 24.04 (x86_64)',
      uptime_pct: 100.0,
      created_at: new Date().toISOString(),
    };

    setNodes((prev) => [newNode, ...prev]);
    setNetworks((prev) =>
      prev.map((n) =>
        n.id === networkId
          ? {
              ...n,
              node_count: n.node_count + 1,
              total_storage_bytes: n.total_storage_bytes + totalBytes,
              used_storage_bytes: n.used_storage_bytes + Math.floor(totalBytes * 0.15),
            }
          : n
      )
    );

    logAction('NODE_ENROLLED', 'node', nodeCode, `Customer node "${nodeName}" joined ${net?.name || 'network'}`);
    addToast({
      type: 'success',
      title: 'Customer node joined',
      description: `${nodeName} (${capacityTb} TB) is online & syncing shards`,
    });

    // Save via Drizzle API
    fetch('/api/nodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nodeName,
        networkId,
        nodeType: 'customer_owned',
        capacityTb,
        osInfo,
      }),
    }).catch(() => {});

    return newNode;
  };

  const requestRyveStorageNode = async (networkId: string, capacityTb: number, billingCycle: 'monthly' | 'annual') => {
    const net = networks.find((n) => n.id === networkId);
    const pricePerMonth = capacityTb * 4.0;
    const nodeCode = `RYV-POD-${Math.floor(100 + Math.random() * 900)}`;
    const totalBytes = capacityTb * 1000000000000;

    const newRequest: StorageRequest = {
      id: `req-${Date.now()}`,
      organization_id: organization.id,
      network_id: networkId,
      network_name: net?.name || 'Network',
      requested_capacity_tb: capacityTb,
      billing_cycle: billingCycle,
      price_per_month_usd: pricePerMonth,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    setStorageRequests((prev) => [newRequest, ...prev]);

    const newNode: NodeDevice = {
      id: `node-${Date.now()}`,
      node_id_code: nodeCode,
      network_id: networkId,
      organization_id: organization.id,
      name: `Ryve Dedicated Block ${capacityTb}TB`,
      node_type: 'ryve_provided',
      ip_address: `54.${Math.floor(100 + Math.random() * 150)}.${Math.floor(10 + Math.random() * 80)}.${Math.floor(10 + Math.random() * 90)}`,
      total_storage_bytes: totalBytes,
      used_storage_bytes: 0,
      status: 'healthy',
      health_score: 100,
      latency_ms: 14,
      last_heartbeat: 'Just now',
      version: 'v1.4.2-p2p',
      os_info: 'Ryve Managed NVMe Datacenter Pod',
      uptime_pct: 100.0,
      created_at: new Date().toISOString(),
    };

    setNodes((prev) => [newNode, ...prev]);

    setNetworks((prev) =>
      prev.map((n) =>
        n.id === networkId
          ? {
              ...n,
              node_count: n.node_count + 1,
              total_storage_bytes: n.total_storage_bytes + totalBytes,
            }
          : n
      )
    );

    logAction('STORAGE_PROVISIONED', 'storage_request', nodeCode, `Provisioned ${capacityTb} TB Ryve node for ${net?.name}`);
    addToast({
      type: 'success',
      title: 'Ryve Storage Node Provisioned',
      description: `Added ${capacityTb} TB high-speed node (${nodeCode}) to ${net?.name}`,
    });

    // Drizzle API
    fetch('/api/storage-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        networkId,
        capacityTb,
        billingCycle,
      }),
    }).catch(() => {});
  };

  const removeNode = (id: string) => {
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setNetworks((prev) =>
      prev.map((n) =>
        n.id === node.network_id
          ? {
              ...n,
              node_count: Math.max(0, n.node_count - 1),
              total_storage_bytes: Math.max(0, n.total_storage_bytes - node.total_storage_bytes),
              used_storage_bytes: Math.max(0, n.used_storage_bytes - node.used_storage_bytes),
            }
          : n
      )
    );
    logAction('NODE_REVOKED', 'node', node.node_id_code, `Revoked node "${node.name}" from network`);
    addToast({ type: 'warning', title: 'Node revoked', description: `Node ${node.name} was removed` });

    // Drizzle API
    fetch(`/api/nodes?id=${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const toggleNodeStatus = (id: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const nextStatus: NodeStatus = n.status === 'healthy' ? 'warning' : n.status === 'warning' ? 'offline' : 'healthy';
          const nextScore = nextStatus === 'healthy' ? 99 : nextStatus === 'warning' ? 70 : 0;
          
          fetch('/api/nodes', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: nextStatus }),
          }).catch(() => {});

          return { ...n, status: nextStatus, health_score: nextScore, last_heartbeat: nextStatus === 'offline' ? '28m ago' : 'Just now' };
        }
        return n;
      })
    );
  };

  // Enrollment Codes
  const generateEnrollmentCode = (networkId: string, maxUses = 10) => {
    const net = networks.find((n) => n.id === networkId);
    const code = `RYV-ENR-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const newCode: EnrollmentCode = {
      id: `enr-${Date.now()}`,
      network_id: networkId,
      network_name: net?.name,
      code,
      created_by: 'Alex Rivers',
      max_uses: maxUses,
      current_uses: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setEnrollmentCodes((prev) => [newCode, ...prev]);
    logAction('ENROLLMENT_CODE_GENERATED', 'network', code, `Generated enrollment code for ${net?.name}`);
    addToast({ type: 'success', title: 'Enrollment code created', description: code });

    // Drizzle API
    fetch('/api/enrollment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ networkId, maxUses }),
    }).catch(() => {});

    return newCode;
  };

  // Files
  const uploadFile = (data: { name: string; sizeBytes: number; mimeType: string; networkId: string }) => {
    const net = networks.find((n) => n.id === data.networkId);
    const newFile: FileItem = {
      id: `file-${Date.now()}`,
      organization_id: organization.id,
      network_id: data.networkId,
      network_name: net?.name || 'Network',
      name: data.name,
      path: '/uploads/',
      size_bytes: data.sizeBytes,
      mime_type: data.mimeType || 'application/octet-stream',
      is_public: false,
      chunks_count: 12,
      data_chunks: 8,
      parity_chunks: 4,
      encryption_algorithm: 'AES-256-GCM',
      uploaded_by: 'Alex Rivers',
      created_at: new Date().toISOString(),
      hash: `sha256-${Math.random().toString(36).substring(2, 18)}${Math.random().toString(36).substring(2, 18)}`,
    };

    setFiles((prev) => [newFile, ...prev]);
    logAction('FILE_CHUNKED_AND_DISTRIBUTED', 'file', data.name, `Encrypted and dispersed 12 Reed-Solomon shards across nodes`);
    addToast({
      type: 'success',
      title: 'File distributed across nodes',
      description: `${data.name} encrypted & chunked into 8 data + 4 parity pieces`,
    });

    // Drizzle API
    fetch('/api/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {});

    return newFile;
  };

  const deleteFile = (id: string) => {
    const file = files.find((f) => f.id === id);
    if (!file) return;
    setFiles((prev) => prev.filter((f) => f.id !== id));
    logAction('FILE_DELETED', 'file', file.name, `Shards purged across participating nodes`);
    addToast({ type: 'info', title: 'File deleted', description: file.name });

    fetch(`/api/files?id=${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const toggleFilePublic = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const updated = !f.is_public;
          logAction('FILE_VISIBILITY_CHANGED', 'file', f.name, `File set to ${updated ? 'Public Link' : 'Private Mesh'}`);
          addToast({ type: 'info', title: `File is now ${updated ? 'Public' : 'Private'}` });
          fetch('/api/files', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, isPublic: updated }),
          }).catch(() => {});
          return { ...f, is_public: updated };
        }
        return f;
      })
    );
  };

  const getFileChunks = (file: FileItem): FileChunk[] => {
    const relevantNodes = nodes.filter((n) => n.network_id === file.network_id);
    const pool = relevantNodes.length >= 4 ? relevantNodes : nodes;

    const chunks: FileChunk[] = [];
    const totalChunks = 12;
    const chunkSize = Math.ceil(file.size_bytes / 8);

    for (let i = 0; i < totalChunks; i++) {
      const isParity = i >= 8;
      const assignedNode = pool[i % pool.length];
      const isNodeOffline = assignedNode?.status === 'offline';

      chunks.push({
        chunk_index: i + 1,
        chunk_hash: `0x${file.hash.substring(7, 15)}_${i < 8 ? `D${i + 1}` : `P${i - 7}`}`,
        node_id: assignedNode?.id || `node-${i}`,
        node_name: assignedNode?.name || `Node ${i + 1}`,
        node_type: assignedNode?.node_type || (i % 2 === 0 ? 'customer_owned' : 'ryve_provided'),
        size_bytes: chunkSize,
        is_parity: isParity,
        status: isNodeOffline ? 'reconstructing' : 'verified',
      });
    }

    return chunks;
  };

  // API Keys
  const generateApiKey = (name: string, permissions: string[]) => {
    const prefix = `ryve_live_${Math.random().toString(36).substring(2, 10)}`;
    const secret = `${prefix}_${Math.random().toString(36).substring(2, 20)}${Math.random().toString(36).substring(2, 20)}`;
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      organization_id: organization.id,
      name,
      key_prefix: prefix,
      permissions,
      created_at: new Date().toISOString(),
      last_used_at: 'Just created',
    };
    setApiKeys((prev) => [newKey, ...prev]);
    logAction('API_KEY_GENERATED', 'security', prefix, `Generated key "${name}"`);
    addToast({ type: 'success', title: 'API Key generated', description: `Prefix: ${prefix}...` });
    return { key: newKey, secret };
  };

  const revokeApiKey = (id: string) => {
    const key = apiKeys.find((k) => k.id === id);
    if (!key) return;
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    logAction('API_KEY_REVOKED', 'security', key.key_prefix, `Revoked API key "${key.name}"`);
    addToast({ type: 'warning', title: 'API Key revoked', description: key.name });
  };

  // Modals
  const openAddNodeModal = (defaultTab: 'customer' | 'ryve' = 'customer') => {
    setAddNodeModalTab(defaultTab);
    setIsAddNodeModalOpen(true);
  };

  const closeAddNodeModal = () => {
    setIsAddNodeModalOpen(false);
  };

  // Derived Statistics
  const stats = useMemo(() => {
    const filteredNodes = selectedNetworkId === 'all' 
      ? nodes 
      : nodes.filter((n) => n.network_id === selectedNetworkId);

    let customerOwnedBytes = 0;
    let ryveProvidedBytes = 0;
    let customerUsedBytes = 0;
    let ryveUsedBytes = 0;
    let activeNodesCount = 0;
    let warningNodesCount = 0;
    let offlineNodesCount = 0;
    let totalHealthScore = 0;

    filteredNodes.forEach((node) => {
      if (node.node_type === 'customer_owned') {
        customerOwnedBytes += node.total_storage_bytes;
        customerUsedBytes += node.used_storage_bytes;
      } else {
        ryveProvidedBytes += node.total_storage_bytes;
        ryveUsedBytes += node.used_storage_bytes;
      }

      if (node.status === 'healthy') activeNodesCount++;
      else if (node.status === 'warning') warningNodesCount++;
      else offlineNodesCount++;

      totalHealthScore += node.health_score;
    });

    const totalStorageBytes = customerOwnedBytes + ryveProvidedBytes;
    const usedStorageBytes = customerUsedBytes + ryveUsedBytes;
    const availableStorageBytes = Math.max(0, totalStorageBytes - usedStorageBytes);
    const healthScore = filteredNodes.length > 0 ? Math.round(totalHealthScore / filteredNodes.length) : 100;
    const monthlySpendUsd = Math.round((ryveProvidedBytes / 1000000000000) * 4.0);

    return {
      totalStorageBytes,
      usedStorageBytes,
      availableStorageBytes,
      customerOwnedBytes,
      ryveProvidedBytes,
      customerUsedBytes,
      ryveUsedBytes,
      activeNodesCount,
      warningNodesCount,
      offlineNodesCount,
      healthScore,
      monthlySpendUsd,
    };
  }, [nodes, selectedNetworkId]);

  return (
    <RyveContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedNetworkId,
        setSelectedNetworkId,
        organization,
        updateOrganization,
        members,
        addMember,
        removeMember,
        updateMemberRole,
        currentUserRole,
        setCurrentUserRole,
        networks,
        createNetwork,
        deleteNetwork,
        nodes,
        registerCustomerNode,
        requestRyveStorageNode,
        removeNode,
        toggleNodeStatus,
        enrollmentCodes,
        generateEnrollmentCode,
        files,
        uploadFile,
        deleteFile,
        toggleFilePublic,
        getFileChunks,
        storageRequests,
        invoices,
        auditLogs,
        apiKeys,
        generateApiKey,
        revokeApiKey,
        stats,
        isAddNodeModalOpen,
        openAddNodeModal,
        closeAddNodeModal,
        addNodeModalTab,
        setAddNodeModalTab,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </RyveContext.Provider>
  );
}

export function useRyve() {
  const context = useContext(RyveContext);
  if (!context) {
    throw new Error('useRyve must be used within a RyveProvider');
  }
  return context;
}
