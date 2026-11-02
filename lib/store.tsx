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
import { 
  initialOrganization, 
  initialMembers, 
  initialNetworks, 
  initialNodes, 
  initialFiles, 
  initialEnrollmentCodes, 
  initialStorageRequests, 
  initialAuditLogs, 
  initialApiKeys, 
  initialInvoices 
} from './mock-data';
import { supabase, isSupabaseConfigured } from './supabase';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

interface RyveContextType {
  // Navigation / Portal State
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedNetworkId: string; // 'all' or specific network id
  setSelectedNetworkId: (id: string) => void;
  
  // Organization & Roles
  organization: Organization;
  updateOrganization: (updates: Partial<Organization>) => void;
  members: OrganizationMember[];
  addMember: (name: string, email: string, role: UserRole) => void;
  removeMember: (id: string) => void;
  updateMemberRole: (id: string, role: UserRole) => void;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;

  // Networks
  networks: Network[];
  createNetwork: (data: { name: string; description: string; region: string; redundancyPolicy: string }) => Network;
  deleteNetwork: (id: string) => void;

  // Nodes (Customer vs Ryve-Provided)
  nodes: NodeDevice[];
  registerCustomerNode: (networkId: string, nodeName: string, capacityTb: number, osInfo?: string) => NodeDevice;
  requestRyveStorageNode: (networkId: string, capacityTb: number, billingCycle: 'monthly' | 'annual') => Promise<void>;
  removeNode: (id: string) => void;
  toggleNodeStatus: (id: string) => void;

  // Enrollment Codes
  enrollmentCodes: EnrollmentCode[];
  generateEnrollmentCode: (networkId: string, maxUses?: number) => EnrollmentCode;

  // Files & Chunking
  files: FileItem[];
  uploadFile: (file: { name: string; sizeBytes: number; mimeType: string; networkId: string }) => FileItem;
  deleteFile: (id: string) => void;
  toggleFilePublic: (id: string) => void;
  getFileChunks: (file: FileItem) => FileChunk[];

  // Storage Requests & Billing
  storageRequests: StorageRequest[];
  invoices: Invoice[];

  // Security & Audit
  auditLogs: AuditLog[];
  apiKeys: ApiKey[];
  generateApiKey: (name: string, permissions: string[]) => { key: ApiKey; secret: string };
  revokeApiKey: (id: string) => void;

  // System Stats (Derived)
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

  // Modals & UI Controls
  isAddNodeModalOpen: boolean;
  openAddNodeModal: (defaultTab?: 'customer' | 'ryve') => void;
  closeAddNodeModal: () => void;
  addNodeModalTab: 'customer' | 'ryve';
  setAddNodeModalTab: (tab: 'customer' | 'ryve') => void;

  // Toast notifications
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Status
  isSupabaseActive: boolean;
}

const RyveContext = createContext<RyveContextType | undefined>(undefined);

export function RyveProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedNetworkId, setSelectedNetworkId] = useState<string>('all');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('owner');

  // Modals state
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false);
  const [addNodeModalTab, setAddNodeModalTab] = useState<'customer' | 'ryve'>('customer');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Core entities
  const [organization, setOrganization] = useState<Organization>(initialOrganization);
  const [members, setMembers] = useState<OrganizationMember[]>(initialMembers);
  const [networks, setNetworks] = useState<Network[]>(initialNetworks);
  const [nodes, setNodes] = useState<NodeDevice[]>(initialNodes);
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [enrollmentCodes, setEnrollmentCodes] = useState<EnrollmentCode[]>(initialEnrollmentCodes);
  const [storageRequests, setStorageRequests] = useState<StorageRequest[]>(initialStorageRequests);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedOrg = localStorage.getItem('ryve_org');
      if (savedOrg) setOrganization(JSON.parse(savedOrg));

      const savedNetworks = localStorage.getItem('ryve_networks');
      if (savedNetworks) setNetworks(JSON.parse(savedNetworks));

      const savedNodes = localStorage.getItem('ryve_nodes');
      if (savedNodes) setNodes(JSON.parse(savedNodes));

      const savedFiles = localStorage.getItem('ryve_files');
      if (savedFiles) setFiles(JSON.parse(savedFiles));

      const savedAudit = localStorage.getItem('ryve_audit');
      if (savedAudit) setAuditLogs(JSON.parse(savedAudit));
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ryve_org', JSON.stringify(organization));
      localStorage.setItem('ryve_networks', JSON.stringify(networks));
      localStorage.setItem('ryve_nodes', JSON.stringify(nodes));
      localStorage.setItem('ryve_files', JSON.stringify(files));
      localStorage.setItem('ryve_audit', JSON.stringify(auditLogs));
    } catch {
      // Ignore
    }
  }, [organization, networks, nodes, files, auditLogs]);

  // Toast Helpers
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
  };

  // Organization update
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
      addToast({ type: 'info', title: 'Member removed', description: `${mem.name} was removed from organization` });
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
    addToast({ type: 'success', title: 'Network created', description: `${data.name} (${netCode}) is ready for nodes` });
    return newNet;
  };

  const deleteNetwork = (id: string) => {
    const net = networks.find((n) => n.id === id);
    if (!net) return;
    setNetworks((prev) => prev.filter((n) => n.id !== id));
    setNodes((prev) => prev.filter((n) => n.network_id !== id));
    if (selectedNetworkId === id) setSelectedNetworkId('all');
    logAction('NETWORK_DELETED', 'network', net.network_id_code, `Deleted network "${net.name}"`);
    addToast({ type: 'warning', title: 'Network deleted', description: `Network ${net.name} and nodes removed` });
  };

  // Nodes
  const registerCustomerNode = (networkId: string, nodeName: string, capacityTb: number, osInfo?: string) => {
    const net = networks.find((n) => n.id === networkId);
    const nodeCode = `NODE-${(net?.name.substring(0, 3) || 'SJC').toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
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
      health_score: 98,
      latency_ms: Math.floor(10 + Math.random() * 20),
      last_heartbeat: 'Just now',
      version: 'v1.4.2-p2p',
      os_info: osInfo || 'Ubuntu 24.04 LTS (x86_64)',
      uptime_pct: 100.0,
      created_at: new Date().toISOString(),
    };

    setNodes((prev) => [newNode, ...prev]);
    // Update network capacity
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

    logAction('NODE_ENROLLED', 'node', nodeCode, `Self-hosted node "${nodeName}" enrolled into ${net?.name || 'network'}`);
    addToast({
      type: 'success',
      title: 'Customer node joined',
      description: `${nodeName} (${capacityTb} TB) is online & syncing shards`,
    });
    return newNode;
  };

  const requestRyveStorageNode = async (networkId: string, capacityTb: number, billingCycle: 'monthly' | 'annual') => {
    const net = networks.find((n) => n.id === networkId);
    const pricePerMonth = capacityTb * 4.0; // $4/TB/mo
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

    // Provision the Ryve Node immediately into the network
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

    // Update network metrics
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
    addToast({ type: 'warning', title: 'Node revoked', description: `Node ${node.name} was removed from the cluster` });
  };

  const toggleNodeStatus = (id: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const nextStatus: NodeStatus = n.status === 'healthy' ? 'warning' : n.status === 'warning' ? 'offline' : 'healthy';
          const nextScore = nextStatus === 'healthy' ? 99 : nextStatus === 'warning' ? 75 : 0;
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
      encryption_algorithm: 'AES-256-GCM (Zero-Knowledge)',
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
    return newFile;
  };

  const deleteFile = (id: string) => {
    const file = files.find((f) => f.id === id);
    if (!file) return;
    setFiles((prev) => prev.filter((f) => f.id !== id));
    logAction('FILE_DELETED', 'file', file.name, `Shards purged across all participating nodes`);
    addToast({ type: 'info', title: 'File deleted', description: file.name });
  };

  const toggleFilePublic = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const updated = !f.is_public;
          logAction('FILE_VISIBILITY_CHANGED', 'file', f.name, `File set to ${updated ? 'Public Link' : 'Private Mesh'}`);
          addToast({ type: 'info', title: `File is now ${updated ? 'Public' : 'Private'}` });
          return { ...f, is_public: updated };
        }
        return f;
      })
    );
  };

  // File Chunk Inspector Generator
  const getFileChunks = (file: FileItem): FileChunk[] => {
    const relevantNodes = nodes.filter((n) => n.network_id === file.network_id);
    const fallbackNodes = nodes.length > 0 ? nodes : initialNodes;
    const pool = relevantNodes.length >= 4 ? relevantNodes : fallbackNodes;

    const chunks: FileChunk[] = [];
    const totalChunks = 12; // Reed-Solomon 8 + 4
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
    addToast({ type: 'success', title: 'API Key generated', description: `Keep secret safe: ${prefix}...` });
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

  // Derived Statistics (Filtered by selectedNetworkId)
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

    // Monthly spend on Ryve provided nodes ($4/TB)
    const ryveTb = ryveProvidedBytes / 1000000000000;
    const monthlySpendUsd = Math.round(ryveTb * 4.0);

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
        isSupabaseActive: isSupabaseConfigured,
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
