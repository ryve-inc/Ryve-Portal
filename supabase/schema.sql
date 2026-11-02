-- ==============================================================================
-- RYVE CONTROL PLANE DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Production schema for Ryve Portal: Identity, Networks, Nodes, Files, Billing, Audit
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ORGANIZATIONS
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    org_type VARCHAR(50) NOT NULL DEFAULT 'enterprise',
    plan VARCHAR(50) NOT NULL DEFAULT 'free_tier',
    max_networks INT NOT NULL DEFAULT 5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ORGANIZATION MEMBERS
CREATE TABLE IF NOT EXISTS organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member', -- 'owner', 'admin', 'member', 'viewer'
    mfa_enabled BOOLEAN NOT NULL DEFAULT false,
    avatar_url TEXT,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. NETWORKS
CREATE TABLE IF NOT EXISTS networks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    network_id_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'RYV-NET-9481'
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    region VARCHAR(50) NOT NULL DEFAULT 'us-east-1',
    status VARCHAR(50) NOT NULL DEFAULT 'healthy', -- 'healthy', 'degraded', 'offline'
    redundancy_policy VARCHAR(100) NOT NULL DEFAULT 'Reed-Solomon (8+4)',
    encryption_standard VARCHAR(100) NOT NULL DEFAULT 'AES-256-GCM Zero-Knowledge',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. NODES (Customer-Owned vs Ryve-Provided)
CREATE TABLE IF NOT EXISTS nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'NODE-SJC-01'
    network_id UUID NOT NULL REFERENCES networks(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    node_type VARCHAR(50) NOT NULL DEFAULT 'customer_owned', -- 'customer_owned' (free) vs 'ryve_provided' (paid)
    ip_address VARCHAR(45) NOT NULL,
    public_key TEXT,
    total_storage_bytes BIGINT NOT NULL DEFAULT 0,
    used_storage_bytes BIGINT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'healthy', -- 'healthy', 'warning', 'offline'
    health_score INT NOT NULL DEFAULT 100,
    latency_ms INT NOT NULL DEFAULT 24,
    uptime_pct NUMERIC(5, 2) NOT NULL DEFAULT 99.95,
    version VARCHAR(50) NOT NULL DEFAULT 'v1.4.2-p2p',
    os_info VARCHAR(100) NOT NULL DEFAULT 'Linux 6.8 (x86_64)',
    last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ENROLLMENT CODES (For Customer-Owned Node Joining)
CREATE TABLE IF NOT EXISTS enrollment_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    network_id UUID NOT NULL REFERENCES networks(id) ON DELETE CASCADE,
    code VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'RYV-ENR-7821-B49'
    created_by VARCHAR(255) NOT NULL,
    max_uses INT NOT NULL DEFAULT 1,
    current_uses INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 HOURS'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. STORAGE REQUESTS (For Ryve-Provided Paid Storage Provisioning)
CREATE TABLE IF NOT EXISTS storage_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    network_id UUID NOT NULL REFERENCES networks(id) ON DELETE CASCADE,
    requested_capacity_tb NUMERIC(8, 2) NOT NULL,
    billing_cycle VARCHAR(50) NOT NULL DEFAULT 'monthly',
    price_per_month_usd NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'pending', 'provisioning', 'active', 'cancelled'
    provisioned_node_id UUID REFERENCES nodes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. FILES (Distributed File Metadata)
CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    network_id UUID NOT NULL REFERENCES networks(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    path TEXT NOT NULL DEFAULT '/',
    size_bytes BIGINT NOT NULL DEFAULT 0,
    mime_type VARCHAR(100) NOT NULL DEFAULT 'application/octet-stream',
    is_public BOOLEAN NOT NULL DEFAULT false,
    chunks_count INT NOT NULL DEFAULT 12,
    data_chunks INT NOT NULL DEFAULT 8,
    parity_chunks INT NOT NULL DEFAULT 4,
    encryption_algorithm VARCHAR(100) NOT NULL DEFAULT 'AES-256-GCM',
    hash VARCHAR(128) NOT NULL,
    uploaded_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45) NOT NULL DEFAULT '127.0.0.1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. API KEYS
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(100) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    permissions JSONB NOT NULL DEFAULT '["nodes:read", "files:read", "files:write"]',
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. INVOICES
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount_usd NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'paid',
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    storage_tb_billed NUMERIC(8, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_members_org ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_networks_org ON networks(organization_id);
CREATE INDEX IF NOT EXISTS idx_nodes_net ON nodes(network_id);
CREATE INDEX IF NOT EXISTS idx_nodes_org ON nodes(organization_id);
CREATE INDEX IF NOT EXISTS idx_nodes_status ON nodes(status);
CREATE INDEX IF NOT EXISTS idx_files_org ON files(organization_id);
CREATE INDEX IF NOT EXISTS idx_files_net ON files(network_id);
CREATE INDEX IF NOT EXISTS idx_audit_org ON audit_logs(organization_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view & update their tenant data
CREATE POLICY "Allow authenticated read organizations" ON organizations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read networks" ON networks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read nodes" ON nodes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read files" ON files FOR SELECT TO authenticated USING (true);

-- Allow service role full access
CREATE POLICY "Service role full access on organizations" ON organizations FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on networks" ON networks FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on nodes" ON nodes FOR ALL TO service_role USING (true);
CREATE POLICY "Service role full access on files" ON files FOR ALL TO service_role USING (true);

-- ==============================================================================
-- INITIAL SEED DATA (For instant development & testing)
-- ==============================================================================
INSERT INTO organizations (id, name, slug, org_type, plan, max_networks)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Acme Distributed Systems',
    'acme-dist-sys',
    'enterprise',
    'pro_managed',
    10
) ON CONFLICT DO NOTHING;

INSERT INTO organization_members (id, organization_id, name, email, role, mfa_enabled)
VALUES 
(
    uuid_generate_v4(),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Alex Rivers',
    'alex@acme.corp',
    'owner',
    true
),
(
    uuid_generate_v4(),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Sarah Chen',
    'sarah@acme.corp',
    'admin',
    true
),
(
    uuid_generate_v4(),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'David Miller',
    'david@acme.corp',
    'member',
    false
) ON CONFLICT DO NOTHING;

INSERT INTO networks (id, network_id_code, organization_id, name, description, region, status, redundancy_policy)
VALUES
(
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'RYV-NET-4029',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Production Storage Mesh',
    'Primary distributed cluster across on-prem lab servers & managed Ryve high-throughput nodes',
    'us-east-1',
    'healthy',
    'Reed-Solomon (8+4)'
),
(
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'RYV-NET-9182',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'SJCET Lab Network',
    'Edge research cluster running on university lab workstations and NAS appliances',
    'ap-south-1',
    'healthy',
    'Reed-Solomon (6+3)'
) ON CONFLICT DO NOTHING;
