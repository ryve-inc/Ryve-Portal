'use client';

import React from 'react';
import { useRyve } from '@/lib/store';
import { 
  HardDrive, 
  Server, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Cpu
} from 'lucide-react';
import { formatBytes } from '@/lib/format';

export function StorageView() {
  const { stats, networks, nodes, openAddNodeModal } = useRyve();

  const totalBytes = stats.totalStorageBytes || 1;
  const customerOwnedBytes = stats.customerOwnedBytes;
  const ryveProvidedBytes = stats.ryveProvidedBytes;

  const customerUsedPct = customerOwnedBytes > 0 
    ? Math.round((stats.customerUsedBytes / customerOwnedBytes) * 100) 
    : 0;

  const ryveUsedPct = ryveProvidedBytes > 0 
    ? Math.round((stats.ryveUsedBytes / ryveProvidedBytes) * 100) 
    : 0;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-1 border-b border-zinc-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
            <span>Storage Distribution</span>
            <span className="text-xs font-mono font-normal bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded border border-zinc-200">
              {formatBytes(stats.totalStorageBytes)} Total
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Logical capacity split between zero-cost customer devices and high-throughput Ryve cloud pods.
          </p>
        </div>

        <button
          onClick={() => openAddNodeModal('ryve')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Request Storage</span>
        </button>
      </div>

      {/* CORE DIFFERENTIATOR: CLEAR SEPARATION OF STORAGE TIERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Tier 1: Customer-Owned Storage Card (Free) */}
        <div className="p-6 bg-white border border-zinc-200/90 rounded-xl shadow-xs flex flex-col justify-between gap-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-900" />
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-zinc-100 text-zinc-900 border border-zinc-200">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-950">Customer-Owned Storage</h3>
                  <span className="text-[11px] font-mono text-zinc-500">Free Tier (Self-Hosted Infrastructure)</span>
                </div>
              </div>

              <span className="text-xs font-mono font-bold bg-zinc-100 text-zinc-800 px-2.5 py-1 rounded border border-zinc-200">
                $0 / mo
              </span>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed mt-1">
              Encrypted storage provided by user-enrolled lab servers, campus NAS drives, and workstations. Fully decentralised and private.
            </p>
          </div>

          {/* Metrics */}
          <div className="flex flex-col gap-2 p-4 bg-zinc-50 rounded-lg border border-zinc-100">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-zinc-500">Enrolled Hardware Capacity</span>
              <span className="text-lg font-bold text-zinc-950 font-mono">
                {formatBytes(customerOwnedBytes)}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>Used: {formatBytes(stats.customerUsedBytes)}</span>
              <span>Free: {formatBytes(customerOwnedBytes - stats.customerUsedBytes)}</span>
            </div>

            {/* Horizontal Bar */}
            <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${customerUsedPct}%` }}
                className="h-full bg-zinc-900 rounded-full transition-all duration-500"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-1">
              <span>{customerUsedPct}% Utilized</span>
              <span>{nodes.filter((n) => n.node_type === 'customer_owned').length} Connected Devices</span>
            </div>
          </div>

          <button
            onClick={() => openAddNodeModal('customer')}
            className="w-full py-2 px-3 border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-800 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Enroll More Customer Hardware (Free)</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>

        {/* Tier 2: Ryve-Provided Storage Card (Paid Dedicated) */}
        <div className="p-6 bg-white border border-emerald-300/80 rounded-xl shadow-xs flex flex-col justify-between gap-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-950">Ryve-Provided Storage</h3>
                  <span className="text-[11px] font-mono text-emerald-700">Managed Tier (Datacenter NVMe Pods)</span>
                </div>
              </div>

              <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded border border-emerald-200">
                $4.00 / TB / mo
              </span>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed mt-1">
              On-demand high-IOPS datacenter blocks provisioned directly into your network ID. Zero egress fees and instant Reed-Solomon auto-healing.
            </p>
          </div>

          {/* Metrics */}
          <div className="flex flex-col gap-2 p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-zinc-600">Provisioned Cloud Capacity</span>
              <span className="text-lg font-bold text-zinc-950 font-mono">
                {formatBytes(ryveProvidedBytes)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-600">
              <span>Used: {formatBytes(stats.ryveUsedBytes)}</span>
              <span>Free: {formatBytes(ryveProvidedBytes - stats.ryveUsedBytes)}</span>
            </div>

            {/* Horizontal Bar */}
            <div className="w-full h-2.5 bg-emerald-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${ryveUsedPct}%` }}
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-600 font-mono pt-1">
              <span>{ryveUsedPct}% Utilized</span>
              <span>{nodes.filter((n) => n.node_type === 'ryve_provided').length} Active Datacenter Pods</span>
            </div>
          </div>

          <button
            onClick={() => openAddNodeModal('ryve')}
            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Request Additional Storage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Redundancy and Erasure Coding Health */}
      <div className="p-6 bg-white border border-zinc-200/80 rounded-xl shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-zinc-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Reed-Solomon Erasure Coding & Redundancy Fabric</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Every file is encrypted client-side with AES-256-GCM and mathematically divided into 8 data shards + 4 parity shards.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Fault Tolerance: 4 Node Failures
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex flex-col gap-1">
            <span className="text-[10px] text-zinc-400 uppercase font-mono">Erasure Ratio</span>
            <span className="text-base font-bold text-zinc-900 font-mono">8 + 4 (1.5x)</span>
            <span className="text-[11px] text-zinc-500">8 data shards, 4 parity shards</span>
          </div>

          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex flex-col gap-1">
            <span className="text-[10px] text-zinc-400 uppercase font-mono">Reconstruction Time</span>
            <span className="text-base font-bold text-zinc-900 font-mono">&lt; 140 ms</span>
            <span className="text-[11px] text-zinc-500">Autonomous peer re-assembly</span>
          </div>

          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex flex-col gap-1">
            <span className="text-[10px] text-zinc-400 uppercase font-mono">Encryption Standard</span>
            <span className="text-base font-bold text-zinc-900 font-mono">AES-256-GCM</span>
            <span className="text-[11px] text-zinc-500">Zero-knowledge end-to-end</span>
          </div>

          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex flex-col gap-1">
            <span className="text-[10px] text-zinc-400 uppercase font-mono">Egress Bandwidth Fee</span>
            <span className="text-base font-bold text-emerald-600 font-mono">$0.00 / GB</span>
            <span className="text-[11px] text-zinc-500">Direct peer-to-peer data plane</span>
          </div>
        </div>
      </div>
    </div>
  );
}
