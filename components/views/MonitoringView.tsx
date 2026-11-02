'use client';

import React, { useState } from 'react';
import { useRyve } from '@/lib/store';
import { 
  Activity, 
  Server, 
  Wifi, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  RefreshCw, 
  Zap, 
  XOctagon
} from 'lucide-react';
import { formatBytes } from '@/lib/format';

export function MonitoringView() {
  const { nodes, networks, stats, toggleNodeStatus, addToast, auditLogs } = useRyve();
  const [isSimulatingHeartbeats, setIsSimulatingHeartbeats] = useState(false);

  const handlePulseHeartbeats = () => {
    setIsSimulatingHeartbeats(true);
    addToast({
      type: 'info',
      title: 'Pinging all active nodes',
      description: 'Dispatched UDP gossip heartbeat packets across peer mesh...',
    });
    setTimeout(() => {
      setIsSimulatingHeartbeats(false);
      addToast({
        type: 'success',
        title: 'Heartbeat sweep complete',
        description: `Verified ${stats.activeNodesCount} healthy peer responses. Mean latency: 18.4ms`,
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-1 border-b border-zinc-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
            <span>Telemetry & Health Monitoring</span>
            <span className="text-xs font-mono font-normal bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Gossip Daemon
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Continuous peer heartbeats, IOPS throughput, latency jitter, and automatic parity reconstruction status.
          </p>
        </div>

        <button
          onClick={handlePulseHeartbeats}
          disabled={isSimulatingHeartbeats}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-md text-xs font-medium shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingHeartbeats ? 'animate-spin' : ''}`} />
          <span>Sweep Heartbeats</span>
        </button>
      </div>

      {/* Top Diagnostics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-zinc-200/80 rounded-xl shadow-xs">
          <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">Mesh Mean Latency</span>
          <div className="text-2xl font-bold font-mono text-zinc-950 mt-1">18.4 ms</div>
          <span className="text-[11px] text-emerald-700 font-medium">99.2% under 30ms</span>
        </div>

        <div className="p-4 bg-white border border-zinc-200/80 rounded-xl shadow-xs">
          <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">Packet Delivery Ratio</span>
          <div className="text-2xl font-bold font-mono text-zinc-950 mt-1">99.98%</div>
          <span className="text-[11px] text-emerald-700 font-medium">Zero shard dropouts</span>
        </div>

        <div className="p-4 bg-white border border-zinc-200/80 rounded-xl shadow-xs">
          <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">Active Storage Mesh</span>
          <div className="text-2xl font-bold font-mono text-zinc-950 mt-1">{stats.healthScore}%</div>
          <span className="text-[11px] text-zinc-500">Autonomous RS 8+4 sync</span>
        </div>

        <div className="p-4 bg-white border border-zinc-200/80 rounded-xl shadow-xs">
          <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">Nodes In Warning / Degraded</span>
          <div className="text-2xl font-bold font-mono text-zinc-950 mt-1">
            {stats.warningNodesCount + stats.offlineNodesCount}
          </div>
          <span className="text-[11px] text-zinc-500">
            {stats.offlineNodesCount > 0 ? `${stats.offlineNodesCount} offline` : 'All critical nodes nominal'}
          </span>
        </div>
      </div>

      {/* Node Status Matrix Grid */}
      <div className="p-6 bg-white border border-zinc-200/80 rounded-xl shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-zinc-950">Peer Node Telemetry Matrix</h3>
            <p className="text-xs text-zinc-500">
              Click any node card to toggle simulated network disconnect or inspect instant auto-healing.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-600 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Healthy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Warning
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Offline
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {nodes.map((node) => (
            <div
              key={node.id}
              onClick={() => toggleNodeStatus(node.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                node.status === 'healthy'
                  ? 'border-zinc-200 hover:border-emerald-300 bg-white'
                  : node.status === 'warning'
                  ? 'border-amber-300 bg-amber-50/40'
                  : 'border-rose-300 bg-rose-50/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-semibold text-xs text-zinc-900 block truncate max-w-[180px]">
                    {node.name}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400">{node.node_id_code}</span>
                </div>

                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    node.status === 'healthy'
                      ? 'bg-emerald-500'
                      : node.status === 'warning'
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-rose-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-3 gap-1 text-[11px] font-mono text-zinc-600 pt-1 border-t border-zinc-100">
                <div>
                  <span className="text-[9px] text-zinc-400 uppercase block">Latency</span>
                  <span>{node.latency_ms > 0 ? `${node.latency_ms}ms` : '---'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-400 uppercase block">Health</span>
                  <span>{node.health_score}%</span>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-400 uppercase block">Last Seen</span>
                  <span className="truncate">{node.last_heartbeat}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Health & Alerts Banner */}
      <div className="p-5 bg-zinc-900 text-white rounded-xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-800 rounded-lg text-emerald-400 border border-zinc-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Autonomous Auto-Healing Subsystem</h3>
            <p className="text-xs text-zinc-400 leading-snug mt-0.5">
              If any peer drops offline, surviving nodes use Reed-Solomon Galois mathematics to reconstruct missing shards within seconds.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="font-mono text-xs text-emerald-400 font-semibold">Self-Healing Ready</span>
          <span className="text-[10px] text-zinc-500 block">Daemon protocol v1.4.2</span>
        </div>
      </div>
    </div>
  );
}
