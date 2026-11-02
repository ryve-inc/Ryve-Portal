import { db, schema } from './index';
import { config } from '../config';

export async function ensureDatabaseSeeded() {
  try {
    // Check if organization already exists
    const existingOrgs = await db.select().from(schema.organizations).limit(1);
    if (existingOrgs.length > 0) {
      return;
    }

    // 1. Seed Organization
    const [org] = await db
      .insert(schema.organizations)
      .values({
        id: config.defaultOrgId,
        name: config.defaultOrgName,
        slug: config.defaultOrgSlug,
        orgType: 'academic',
        plan: 'pro_managed',
        maxNetworks: 10,
      })
      .returning();

    // 2. Seed Organization Members
    await db.insert(schema.organizationMembers).values([
      {
        organizationId: org.id,
        name: 'Alex Rivers',
        email: 'alex@acme.corp',
        role: 'owner',
        mfaEnabled: true,
      },
      {
        organizationId: org.id,
        name: 'Sarah Chen',
        email: 'sarah@acme.corp',
        role: 'admin',
        mfaEnabled: true,
      },
      {
        organizationId: org.id,
        name: 'David Miller',
        email: 'david@acme.corp',
        role: 'member',
        mfaEnabled: false,
      },
    ]);

    // 3. Seed Networks
    const [net1] = await db
      .insert(schema.networks)
      .values({
        networkIdCode: 'RYV-NET-8492',
        organizationId: org.id,
        name: 'SJCET Lab Network',
        description: 'High-speed campus mesh connecting lab servers and Ryve managed pods',
        region: 'ap-south-1',
        status: 'healthy',
        redundancyPolicy: 'Reed-Solomon (8+4)',
        totalStorageBytes: 8400000000000,
        usedStorageBytes: 3120000000000,
        nodeCount: 5,
      })
      .returning();

    const [net2] = await db
      .insert(schema.networks)
      .values({
        networkIdCode: 'RYV-NET-4029',
        organizationId: org.id,
        name: 'Production Storage Mesh',
        description: 'Mission-critical distributed storage across rack servers and NVMe blocks',
        region: 'us-east-1',
        status: 'healthy',
        redundancyPolicy: 'Reed-Solomon (8+4)',
        totalStorageBytes: 18400000000000,
        usedStorageBytes: 8200000000000,
        nodeCount: 6,
      })
      .returning();

    // 4. Seed Nodes
    await db.insert(schema.nodes).values([
      {
        nodeIdCode: 'NODE-SJC-01',
        networkId: net1.id,
        organizationId: org.id,
        name: 'Lab Server Alpha (Rack 01)',
        nodeType: 'customer_owned',
        ipAddress: '192.168.10.24',
        totalStorageBytes: 2000000000000,
        usedStorageBytes: 840000000000,
        status: 'healthy',
        healthScore: 99,
        latencyMs: 12,
        version: 'v1.4.2-p2p',
        osInfo: 'Ubuntu Server 24.04 LTS (x86_64)',
      },
      {
        nodeIdCode: 'NODE-SJC-02',
        networkId: net1.id,
        organizationId: org.id,
        name: 'CS Dept Synology NAS-8B',
        nodeType: 'customer_owned',
        ipAddress: '192.168.10.88',
        totalStorageBytes: 2400000000000,
        usedStorageBytes: 1120000000000,
        status: 'healthy',
        healthScore: 97,
        latencyMs: 16,
        version: 'v1.4.2-p2p',
        osInfo: 'DSM 7.2 (Linux 5.10)',
      },
      {
        nodeIdCode: 'NODE-SJC-03',
        networkId: net1.id,
        organizationId: org.id,
        name: 'Ryve Managed Edge Pod 01',
        nodeType: 'ryve_provided',
        ipAddress: '43.204.18.91',
        totalStorageBytes: 2000000000000,
        usedStorageBytes: 620000000000,
        status: 'healthy',
        healthScore: 100,
        latencyMs: 22,
        version: 'v1.4.2-p2p',
        osInfo: 'RyveOS Alpine Container (NVMe High-IOPS)',
      },
      {
        nodeIdCode: 'NODE-PRD-01',
        networkId: net2.id,
        organizationId: org.id,
        name: 'Primary Cluster Master 01',
        nodeType: 'customer_owned',
        ipAddress: '10.0.12.50',
        totalStorageBytes: 5000000000000,
        usedStorageBytes: 2400000000000,
        status: 'healthy',
        healthScore: 98,
        latencyMs: 9,
        version: 'v1.4.2-p2p',
        osInfo: 'RHEL 9.3 (x86_64)',
      },
      {
        nodeIdCode: 'NODE-PRD-02',
        networkId: net2.id,
        organizationId: org.id,
        name: 'Ryve Provisioned Block S3-Compat',
        nodeType: 'ryve_provided',
        ipAddress: '54.210.82.14',
        totalStorageBytes: 6000000000000,
        usedStorageBytes: 2800000000000,
        status: 'healthy',
        healthScore: 100,
        latencyMs: 15,
        version: 'v1.4.2-p2p',
        osInfo: 'Ryve Dedicated Datacenter Node (Virginia)',
      },
    ]);

    // 5. Seed Files
    await db.insert(schema.files).values([
      {
        organizationId: org.id,
        networkId: net1.id,
        networkName: 'SJCET Lab Network',
        name: 'distributed_ml_checkpoint_epoch_48.safetensors',
        path: '/models/ai/2026/',
        sizeBytes: 4294967296,
        mimeType: 'application/octet-stream',
        isPublic: false,
        chunksCount: 12,
        dataChunks: 8,
        parityChunks: 4,
        encryptionAlgorithm: 'AES-256-GCM',
        hash: 'sha256-9f83ac02d3381a179c3b88a9e201c9a',
        uploadedBy: 'Alex Rivers',
      },
      {
        organizationId: org.id,
        networkId: net2.id,
        networkName: 'Production Storage Mesh',
        name: 'postgresql_db_cluster_snapshot_full.tar.zst',
        path: '/backups/databases/',
        sizeBytes: 15032385536,
        mimeType: 'application/zstd',
        isPublic: false,
        chunksCount: 12,
        dataChunks: 8,
        parityChunks: 4,
        encryptionAlgorithm: 'AES-256-GCM',
        hash: 'sha256-ee0498b31a29384910cf321ba99d211',
        uploadedBy: 'Sarah Chen',
      },
    ]);

    // 6. Seed Invoices
    await db.insert(schema.invoices).values([
      {
        organizationId: org.id,
        invoiceNumber: 'INV-RYV-2026-03',
        amountUsd: '32.00',
        status: 'paid',
        periodStart: '2026-03-01',
        periodEnd: '2026-03-31',
        storageTbBilled: '8.0',
      },
    ]);
  } catch (err) {
    // If table doesn't exist yet, seed is skipped
    console.warn('Database seed check skipped:', err instanceof Error ? err.message : err);
  }
}
