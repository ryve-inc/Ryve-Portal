'use client';

import React from 'react';
import { useRyve } from '@/lib/store';
import { 
  HardDrive, 
  Server, 
  Network as NetworkIcon, 
  Activity, 
  Plus, 
  Sparkles, 
  Upload, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Shield,
  Layers,
  Clock
} from 'lucide-react';
import { formatBytes } from '@/lib/format';

export function DashboardView() {
  const { 
    organization, 
    networks, 
    nodes, 
    stats, 
    setCurrentView, 
    setSelectedNetworkId,
    openAddNodeModal,
    auditLogs 
  } = useRyve();

  const usedPct = stats.totalStorageBytes > 0 
    ? Math.round((stats.usedStorageBytes / stats.totalStorageBytes) * 100) 
    : 0;

  const customerPct = stats.totalStorageBytes > 0
    ? Math.round((stats.customerOwnedBytes / stats.totalStorageBytes) * 100)
    : 0;

  const ryvePct = stats.totalStorageBytes > 0
    ? Math.round((stats.ryveProvidedBytes / stats.totalStorageBytes) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* 5-Second System Health Hero Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-1 border-b border-zinc-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
            <span>System Overview</span>
            <span className="text-xs font-normal font-mono bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded border border-zinc-200">
              RYV-ORG-98241
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Real-time status across self-hosted cluster nodes and Ryve managed storage pods.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => openAddNodeModal('customer')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-md text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Node</span>
          </button>
          <button
            onClick={() => openAddNodeModal('ryve')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Request Storage</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (Instant 5-Second Health Assessment) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Storage Card */}
        <div className="p-4 bg-white border border-zinc-200/80 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Mesh Storage</span>
            <HardDrive className="w-4 h-4 text-zinc-400" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-zinc-950">
              {formatBytes(stats.totalStorageBytes)}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
              <span className="font-semibold text-zinc-700">{formatBytes(stats.usedStorageBytes)} used</span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">{formatBytes(stats.availableStorageBytes)} available</span>
            </div>
          </div>
        </div>

        {/* Node Health Status */}
        <div className="p-4 bg-white border border-zinc-200/80 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Connected Nodes</span>
            <Server className="w-4 h-4 text-zinc-400" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-zinc-950 flex items-baseline gap-2">
              <span>{stats.activeNodesCount + stats.warningNodesCount + stats.offlineNodesCount}</span>
              <span className="text-xs font-medium text-emerald-700">({stats.activeNodesCount} healthy)</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {stats.activeNodesCount} online
              </span>
              {stats.warningNodesCount > 0 && (
                <span className="flex items-center gap-1 text-amber-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  {stats.warningNodesCount} warn
                </span>
              )}
              {stats.offlineNodesCount > 0 && (
                <span className="flex items-center gap-1 text-rose-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  {stats.offlineNodesCount} offline
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Networks Active */}
        <div className="p-4 bg-white border border-zinc-200/80 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Managed Networks</span>
            <NetworkIcon className="w-4 h-4 text-zinc-400" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-zinc-950">
              {networks.length}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
              <span className="text-zinc-700 font-medium">Zero-Knowledge Encrypted</span>
              <span>•</span>
              <span className="font-mono text-zinc-600">RS 8+4</span>
            </div>
          </div>
        </div>

        {/* Mesh Integrity Score */}
        <div className="p-4 bg-white border border-zinc-200/80 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Storage Health</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
              <span>{stats.healthScore}%</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Optimal
              </span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">
              Erasure coding parity 100% synchronized
            </div>
          </div>
        </div>
      </div>

      {/* Clean Horizontal Usage Bar: Customer-Owned vs Ryve-Provided Breakdown */}
      <div className="p-5 bg-white border border-zinc-200/80 rounded-xl shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Capacity & Allocation Breakdown</h3>
            <p className="text-xs text-zinc-500">
              Customer-hosted hardware operates free. Managed Ryve pods provide automated high-bandwidth parity.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-600">
            {formatBytes(stats.usedStorageBytes)} / {formatBytes(stats.totalStorageBytes)} ({usedPct}% Utilized)
          </span>
        </div>

        {/* Stacked Clean Bar */}
        <div className="w-full h-3.5 bg-zinc-100 rounded-full overflow-hidden flex p-0.5">
          {/* Customer Used */}
          <div
            style={{ width: `${(stats.customerUsedBytes / (stats.totalStorageBytes || 1)) * 100}%` }}
            className="h-full bg-zinc-900 rounded-l-full transition-all duration-500"
            title={`Customer Used: ${formatBytes(stats.customerUsedBytes)}`}
          />
          {/* Ryve Used */}
          <div
            style={{ width: `${(stats.ryveUsedBytes / (stats.totalStorageBytes || 1)) * 100}%` }}
            className="h-full bg-emerald-600 transition-all duration-500"
            title={`Ryve Used: ${formatBytes(stats.ryveUsedBytes)}`}
          />
          {/* Free Space */}
          <div className="h-full bg-zinc-200 flex-1 rounded-r-full" title="Free Available Space" />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-xs pt-1 border-t border-zinc-100 gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-zinc-900"></span>
              <span className="text-zinc-700">
                Customer Hardware: <strong className="font-semibold">{formatBytes(stats.customerOwnedBytes)}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-600"></span>
              <span className="text-zinc-700">
                Ryve Managed Pods: <strong className="font-semibold">{formatBytes(stats.ryveProvidedBytes)}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-zinc-200"></span>
              <span className="text-zinc-500">Available: {formatBytes(stats.availableStorageBytes)}</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('storage')}
            className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 text-xs cursor-pointer"
          >
            <span>Detailed Storage Analytics</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Two Column Grid: Active Networks & Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Networks Overview */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-500" />
              <span>Active Storage Networks</span>
            </h3>
            <button
              onClick={() => setCurrentView('networks')}
              className="text-xs text-zinc-500 hover:text-zinc-900 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {networks.length === 0 ? (
              <div className="p-8 bg-white border border-zinc-200/80 rounded-xl text-center flex flex-col items-center justify-center">
                <Layers className="w-8 h-8 text-zinc-300 mb-2" />
                <p className="text-sm font-semibold text-zinc-900">No storage networks created yet</p>
                <p className="text-xs text-zinc-500 mt-0.5 max-w-sm">
                  Create your first network to connect self-hosted nodes and provision Ryve storage.
                </p>
                <button
                  onClick={() => setCurrentView('networks')}
                  className="mt-3 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-md text-xs font-medium cursor-pointer"
                >
                  Create Network
                </button>
              </div>
            ) : (
              networks.map((net) => {
                const netNodes = nodes.filter((n) => n.network_id === net.id);
                const healthyCount = netNodes.filter((n) => n.status === 'healthy').length;

                return (
                  <div
                    key={net.id}
                    onClick={() => {
                      setSelectedNetworkId(net.id);
                      setCurrentView('nodes');
                    }}
                    className="p-4 bg-white border border-zinc-200/80 hover:border-zinc-300 rounded-xl shadow-xs transition-all cursor-pointer flex flex-col gap-3 group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-zinc-900 group-hover:text-emerald-700 transition-colors">
                            {net.name}
                          </span>
                          <span className="text-[10px] font-mono bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded">
                            {net.network_id_code}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{net.description}</p>
                      </div>

                      <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Healthy
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-zinc-100">
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Nodes</span>
                        <span className="font-mono font-medium text-zinc-800">{netNodes.length} devices</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Logical Capacity</span>
                        <span className="font-mono font-medium text-zinc-800">{formatBytes(net.total_storage_bytes)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Redundancy</span>
                        <span className="font-mono text-zinc-600 text-[11px]">{net.redundancy_policy}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right (1 col): Live Mesh Activity Ticker */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-zinc-500" />
              <span>Real-Time Events</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              P2P Active
            </span>
          </div>

          <div className="p-4 bg-white border border-zinc-200/80 rounded-xl shadow-xs flex flex-col divide-y divide-zinc-100">
            {auditLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-400">
                No system activity recorded yet.
              </div>
            ) : (
              auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-2.5 first:pt-0 last:pb-0 flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase font-semibold">
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-zinc-400">{log.created_at}</span>
                  </div>
                  <p className="text-zinc-700 leading-snug">{log.details}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
