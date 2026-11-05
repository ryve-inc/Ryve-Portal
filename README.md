# Ryve Portal — Distributed Storage Control Plane

The **Ryve Portal acts as the central control panel for the Ryve distributed ecosystem**, while actual file storage and P2P operations take place across self-hosted customer devices and Ryve-provided datacenter storage nodes.

---

## Architecture Overview

```text
                           RYVE PORTAL
                               │
                         Authentication
                               │
                     ┌─────────┴─────────┐
                     │   Ryve Control    │
                     │      Plane        │
                     └─────────┬─────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
          Organizations     Networks          Nodes
              │                │                │
          Users/Roles      Network ID       Node ID
                                               │
                                     ┌─────────┴─────────┐
                                     │                   │
                              Customer Devices     Ryve Nodes
                              (Free storage)       (Paid storage)
```

- **Control Plane**: Identity, Organization management, Networks, Node Registry, Billing, Monitoring, and Audit logs.
- **P2P Data Plane**: AES-256-GCM client-side encryption, Reed-Solomon 8+4 erasure sharding, and direct peer distribution.

---

## Features Implemented

1. **Landing Page**: Complete technical marketing homepage with architecture overview, interactive storage pricing estimator ($4/TB/mo vs AWS S3), features breakdown, and instant portal launcher.
2. **5-Second Health Assessment Dashboard**: Instant system comprehension: total logical storage, utilized vs available space, active/warning/offline nodes, and clean horizontal allocation bars.
3. **Networks Management**: Isolated storage networks, Network IDs (e.g. `RYV-NET-8492`), redundancy policy selection, and connected node counts.
4. **Hardware & Node Registry**:
   - **Customer-Owned Nodes (Free)**: Enrollment code generator with copyable CLI command (`curl -sSL https://ryve.io/install.sh | bash && ryve-daemon join --enroll ...`) and simulated device joining.
   - **Ryve-Provided Nodes (Paid)**: Provisioning flow with capacity presets (1 TB to 25 TB) at $4/TB/month, SLA guarantees, and instant allocation.
5. **Storage Distribution**: Strict visual separation between Customer-Owned Storage and Ryve-Provided Storage, with Reed-Solomon (8+4) health status.
6. **Encrypted File Mesh & Distributed Chunking Inspector**:
   - File upload, download, delete, and public/private access toggles.
   - Interactive modal showing all 12 Reed-Solomon shards (8 data + 4 parity) mapped to peer nodes with hash verification.
7. **Monitoring & Telemetry**: Live peer health matrix, heartbeat sweeping, mean latency metrics, and simulated node failure / auto-healing testing.
8. **Billing & Invoices**: Real-time monthly usage metering ($4/TB/mo for Ryve nodes, $0 for customer nodes), invoices list with downloadable/printable invoice viewer.
9. **Security & Audit Logs**: API key generator with secret reveal, 2FA enforcement toggle, and comprehensive immutable audit log table with search and filtering.
10. **Organization & Roles**: Member directory with role management (`Owner`, `Admin`, `Member`, `Viewer`) and quick perspective switcher.

---

## Database Setup (Drizzle ORM & Neon Serverless PostgreSQL)

This project uses **Drizzle ORM** with **Neon Serverless PostgreSQL** (`@neondatabase/serverless`). All configurations are kept strictly server-side in TypeScript ([lib/config.ts](file:///c:/Users/asus/Downloads/ryveportal/lib/config.ts)) with **no NEXT_PUBLIC keys exposed to the client browser**.

### 1. Database Schema
The complete type-safe database schema is defined in [lib/db/schema.ts](file:///c:/Users/asus/Downloads/ryveportal/lib/db/schema.ts):
- `organizations`
- `organization_members`
- `networks`
- `nodes`
- `enrollment_codes`
- `storage_requests`
- `files`
- `audit_logs`
- `api_keys`
- `invoices`
- Better Auth tables (`user`, `session`, `account`, `verification`)

### 2. Environment Configuration (Server-Side Only)
Set your `DATABASE_URL` in `.env` or `.env.local`:
```env
# Neon Serverless PostgreSQL Connection
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-random-name.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 3. Migrations & Drizzle Studio
```bash
# Push schema directly to your Neon database
npx drizzle-kit push

# Or open Drizzle Studio UI
npx drizzle-kit studio
```
---

## Running the Application

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Or build for production
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
