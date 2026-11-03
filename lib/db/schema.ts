import { pgTable, uuid, text, integer, bigint, boolean, timestamp, numeric, jsonb } from 'drizzle-orm/pg-core';

// ==============================================================================
// 1. BETTER AUTH CORE SCHEMA (User, Session, Account, Verification)
// ==============================================================================

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==============================================================================
// 2. RYVE DOMAIN SCHEMA (Organizations, Networks, Nodes, Files, etc.)
// ==============================================================================

// Organizations
export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  orgType: text('org_type').notNull().default('enterprise'), // 'enterprise' | 'academic' | 'team' | 'individual'
  plan: text('plan').notNull().default('pro_managed'), // 'free_tier' | 'pro_managed' | 'enterprise'
  maxNetworks: integer('max_networks').notNull().default(10),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Organization Members
export const organizationMembers = pgTable('organization_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  userId: text('user_id'),
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: text('role').notNull().default('member'), // 'owner' | 'admin' | 'member' | 'viewer'
  mfaEnabled: boolean('mfa_enabled').notNull().default(false),
  avatarUrl: text('avatar_url'),
  joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
});

// Networks
export const networks = pgTable('networks', {
  id: uuid('id').primaryKey().defaultRandom(),
  networkIdCode: text('network_id_code').notNull().unique(), // e.g. RYV-NET-8492
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  region: text('region').notNull().default('us-east-1'),
  status: text('status').notNull().default('healthy'), // 'healthy' | 'degraded' | 'offline'
  redundancyPolicy: text('redundancy_policy').notNull().default('Reed-Solomon (8+4)'),
  encryptionStandard: text('encryption_standard').notNull().default('AES-256-GCM Zero-Knowledge'),
  totalStorageBytes: bigint('total_storage_bytes', { mode: 'number' }).notNull().default(0),
  usedStorageBytes: bigint('used_storage_bytes', { mode: 'number' }).notNull().default(0),
  nodeCount: integer('node_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Nodes (Customer-Owned vs Ryve-Provided)
export const nodes = pgTable('nodes', {
  id: uuid('id').primaryKey().defaultRandom(),
  nodeIdCode: text('node_id_code').notNull().unique(), // e.g. NODE-SJC-01
  networkId: uuid('network_id')
    .notNull()
    .references(() => networks.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  nodeType: text('node_type').notNull().default('customer_owned'), // 'customer_owned' | 'ryve_provided'
  ipAddress: text('ip_address').notNull(),
  publicKey: text('public_key'),
  totalStorageBytes: bigint('total_storage_bytes', { mode: 'number' }).notNull().default(0),
  usedStorageBytes: bigint('used_storage_bytes', { mode: 'number' }).notNull().default(0),
  status: text('status').notNull().default('healthy'), // 'healthy' | 'warning' | 'offline'
  healthScore: integer('health_score').notNull().default(100),
  latencyMs: integer('latency_ms').notNull().default(15),
  uptimePct: numeric('uptime_pct').notNull().default('99.95'),
  version: text('version').notNull().default('v1.4.2-p2p'),
  osInfo: text('os_info').notNull().default('Ubuntu Server 24.04 (x86_64)'),
  lastHeartbeat: text('last_heartbeat'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Enrollment Codes (Customer hardware registration)
export const enrollmentCodes = pgTable('enrollment_codes', {
  id: uuid('id').primaryKey().defaultRandom(),
  networkId: uuid('network_id')
    .notNull()
    .references(() => networks.id, { onDelete: 'cascade' }),
  code: text('code').notNull().unique(), // e.g. RYV-ENR-9821-XA7
  createdBy: text('created_by').notNull().default('system'),
  maxUses: integer('max_uses').notNull().default(10),
  currentUses: integer('current_uses').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Storage Requests (Ryve-provided managed nodes)
export const storageRequests = pgTable('storage_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  networkId: uuid('network_id')
    .notNull()
    .references(() => networks.id, { onDelete: 'cascade' }),
  networkName: text('network_name').notNull(),
  requestedCapacityTb: numeric('requested_capacity_tb').notNull(),
  billingCycle: text('billing_cycle').notNull().default('monthly'), // 'monthly' | 'annual'
  pricePerMonthUsd: numeric('price_per_month_usd').notNull(),
  status: text('status').notNull().default('active'), // 'pending' | 'provisioning' | 'active' | 'cancelled'
  provisionedNodeId: text('provisioned_node_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Files (Metadata & Shard specs)
export const files = pgTable('files', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  networkId: uuid('network_id')
    .notNull()
    .references(() => networks.id, { onDelete: 'cascade' }),
  networkName: text('network_name').notNull(),
  name: text('name').notNull(),
  path: text('path').notNull().default('/'),
  sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull().default(0),
  mimeType: text('mime_type').notNull().default('application/octet-stream'),
  isPublic: boolean('is_public').notNull().default(false),
  chunksCount: integer('chunks_count').notNull().default(12),
  dataChunks: integer('data_chunks').notNull().default(8),
  parityChunks: integer('parity_chunks').notNull().default(4),
  encryptionAlgorithm: text('encryption_algorithm').notNull().default('AES-256-GCM'),
  hash: text('hash').notNull(),
  uploadedBy: text('uploaded_by').notNull().default('system'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  userName: text('user_name').notNull().default('System'),
  userEmail: text('user_email').notNull().default('system@ryve.local'),
  action: text('action').notNull(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id').notNull(),
  details: text('details').notNull(),
  ipAddress: text('ip_address').notNull().default('127.0.0.1'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// API Keys
export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  keyPrefix: text('key_prefix').notNull(),
  permissions: jsonb('permissions').notNull().default(['nodes:read', 'files:read', 'files:write']),
  lastUsedAt: text('last_used_at'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Invoices
export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  invoiceNumber: text('invoice_number').notNull().unique(),
  amountUsd: numeric('amount_usd').notNull(),
  status: text('status').notNull().default('paid'), // 'paid' | 'pending' | 'draft'
  periodStart: text('period_start').notNull(),
  periodEnd: text('period_end').notNull(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  storageTbBilled: numeric('storage_tb_billed').notNull().default('0'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
