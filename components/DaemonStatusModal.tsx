'use client';

import React from 'react';
import { useRyve } from '@/lib/store';
import { 
  Server, 
  Activity, 
  HardDrive, 
  Globe, 
  Check, 
  Copy, 
  X, 
  RefreshCw, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { copyToClipboard } from '@/lib/format';

interface DaemonStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DaemonStatusModal({ isOpen, onClose }: DaemonStatusModalProps) {
  const { daemonStatus, getDaemonStatus, isDaemonChecking, daemonHealth, checkDaemonHealth } = useRyve();
  const [copiedId, setCopiedId] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const isOnline = daemonStatus?.online ?? daemonHealth?.nodeReady ?? false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-zinc-50 to-white border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 text-white flex items-center justify-center">
              <Server className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-950">Managed Node Daemon</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                  isOnline 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`}></span>
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Managed P2P Storage Mesh Node
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Node ID / Key */}
          {daemonStatus?.nodeId ? (
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-between text-xs font-mono">
              <div className="overflow-hidden">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-sans font-semibold">
                  Node Public Key (ID)
                </span>
                <span className="text-zinc-900 font-semibold truncate block mt-0.5" title={daemonStatus.nodeId}>
                  {daemonStatus.nodeId.substring(0, 16)}...{daemonStatus.nodeId.substring(daemonStatus.nodeId.length - 8)}
                </span>
              </div>
              <button
                onClick={() => handleCopy(daemonStatus.nodeId || '')}
                className="ml-3 p-2 bg-white border border-zinc-200 rounded-xl text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
                title="Copy full Node ID"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ) : (
            <div className="p-3.5 bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl text-xs text-zinc-500 flex items-center justify-between">
              <span>Node ID will appear when daemon is queried.</span>
              <button
                onClick={() => getDaemonStatus()}
                disabled={isDaemonChecking}
                className="px-3 py-1 bg-zinc-950 text-white text-[11px] font-semibold rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                {isDaemonChecking ? 'Querying...' : 'Fetch Status'}
              </button>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Connected Peers
              </span>
              <span className="text-2xl font-bold font-mono text-zinc-950 mt-1 block">
                {daemonStatus?.totalPeerCount ?? 0}
              </span>
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Active Networks
              </span>
              <span className="text-2xl font-bold font-mono text-zinc-950 mt-1 block">
                {daemonStatus?.networksCount ?? 0}
              </span>
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                Free Disk Space
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-700 mt-1 block">
                {daemonStatus?.storage?.totalFreeDiskGb ?? '--'} <span className="text-xs font-normal">GB</span>
              </span>
            </div>
          </div>

          {/* Active Networks in Daemon */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                Joined Swarm Networks
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {daemonStatus?.networks?.length || 0} Joined
              </span>
            </div>

            {daemonStatus?.networks && daemonStatus.networks.length > 0 ? (
              <div className="max-h-48 overflow-y-auto divide-y divide-zinc-100 border border-zinc-200 rounded-2xl">
                {daemonStatus.networks.map((net) => (
                  <div key={net.id} className="p-3 bg-white flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{net.name || 'Customer Network'}</span>
                        <span className="text-[10px] font-mono bg-zinc-100 text-zinc-600 px-1.5 py-0.2 rounded">
                          {net.id}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate max-w-xs">
                        {net.networkLink}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-zinc-950">
                        {net.allocatedGb} GB
                      </span>
                      <span className="text-[10px] text-zinc-400 block font-mono">
                        {net.peers} peers
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl text-center text-xs text-zinc-500">
                No active networks joined on the daemon yet. Use &quot;Get Nodes&quot; to join a network.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => checkDaemonHealth()}
              disabled={isDaemonChecking}
              className="px-3 py-1.5 bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl text-xs font-semibold text-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Check Health</span>
            </button>

            <button
              onClick={() => getDaemonStatus()}
              disabled={isDaemonChecking}
              className="px-3 py-1.5 bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl text-xs font-semibold text-zinc-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-zinc-500 ${isDaemonChecking ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

