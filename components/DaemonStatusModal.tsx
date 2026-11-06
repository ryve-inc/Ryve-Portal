'use client';

import React from 'react';
import { useRyve } from '@/context/store';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div 
        className="w-full max-w-xl bg-[#111111] border border-[#242424] rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-[#ebebeb]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#161616] border-b border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1f1f1f] border border-[#2a2a2a] text-[#FF6B50] flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Managed Node Daemon</h3>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                  isOnline 
                    ? 'bg-[#FF6B50]/10 text-[#FF6B50] border border-[#FF6B50]/30'
                    : 'bg-[#1e1e1e] text-[#777777] border border-[#2a2a2a]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#FF6B50] animate-pulse' : 'bg-[#555555]'}`}></span>
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <p className="text-xs text-[#888888] mt-0.5 font-mono">
                Managed P2P Storage Mesh Node
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#666666] hover:text-white rounded-lg hover:bg-[#202020] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Node ID / Key */}
          {daemonStatus?.nodeId ? (
            <div className="p-4 bg-[#161616] border border-[#262626] rounded-2xl flex items-center justify-between text-xs font-mono">
              <div className="overflow-hidden">
                <span className="text-[10px] text-[#777777] uppercase tracking-wider block font-bold">
                  Node Public Key (ID)
                </span>
                <span className="text-white font-semibold truncate block mt-1" title={daemonStatus.nodeId}>
                  {daemonStatus.nodeId.substring(0, 16)}...{daemonStatus.nodeId.substring(daemonStatus.nodeId.length - 8)}
                </span>
              </div>
              <button
                onClick={() => handleCopy(daemonStatus.nodeId || '')}
                className="ml-3 p-2 bg-[#202020] border border-[#303030] rounded-xl text-[#888888] hover:text-white transition-colors cursor-pointer"
                title="Copy full Node ID"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-[#FF6B50]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ) : (
            <div className="p-4 bg-[#161616] border border-dashed border-[#282828] rounded-2xl text-xs text-[#777777] flex items-center justify-between font-mono">
              <span>Node ID will appear when daemon is queried.</span>
              <button
                onClick={() => getDaemonStatus()}
                disabled={isDaemonChecking}
                className="px-3 py-1.5 bg-[#FF6B50] hover:bg-[#E55A40] text-black text-[11px] font-extrabold uppercase rounded-lg transition-colors cursor-pointer"
              >
                {isDaemonChecking ? 'Querying...' : 'Fetch Status'}
              </button>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 text-center font-mono">
            <div className="p-4 bg-[#161616] border border-[#242424] rounded-2xl">
              <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">
                Connected Peers
              </span>
              <span className="text-2xl font-black text-white mt-1 block">
                {daemonStatus?.totalPeerCount ?? 0}
              </span>
            </div>

            <div className="p-4 bg-[#161616] border border-[#242424] rounded-2xl">
              <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">
                Active Networks
              </span>
              <span className="text-2xl font-black text-white mt-1 block">
                {daemonStatus?.networksCount ?? 0}
              </span>
            </div>

            <div className="p-4 bg-[#161616] border border-[#242424] rounded-2xl">
              <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">
                Free Disk Space
              </span>
              <span className="text-2xl font-black text-[#FF6B50] mt-1 block">
                {daemonStatus?.storage?.totalFreeDiskGb ?? '--'} <span className="text-xs font-normal">GB</span>
              </span>
            </div>
          </div>

          {/* Active Networks in Daemon */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Joined Swarm Networks
              </span>
              <span className="text-[11px] font-mono text-[#666666]">
                {daemonStatus?.networks?.length || 0} Joined
              </span>
            </div>

            {daemonStatus?.networks && daemonStatus.networks.length > 0 ? (
              <div className="max-h-48 overflow-y-auto divide-y divide-[#1e1e1e] border border-[#242424] rounded-2xl">
                {daemonStatus.networks.map((net) => (
                  <div key={net.id} className="p-3.5 bg-[#141414] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white flex items-center gap-1.5 font-mono">
                        <Globe className="w-3.5 h-3.5 text-[#FF6B50]" />
                        <span>{net.name || 'Customer Network'}</span>
                        <span className="text-[10px] font-mono bg-[#1e1e1e] text-[#888888] px-1.5 py-0.2 rounded">
                          {net.id}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#666666] font-mono mt-0.5 truncate max-w-xs">
                        {net.networkLink}
                      </p>
                    </div>

                    <div className="text-right font-mono">
                      <span className="font-bold text-white">
                        {net.allocatedGb} GB
                      </span>
                      <span className="text-[10px] text-[#666666] block">
                        {net.peers} peers
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-[#161616] border border-[#242424] rounded-2xl text-center text-xs text-[#666666] font-mono">
                No active networks joined on daemon yet. Use &quot;Get Nodes&quot; to join a network.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-[#161616] border-t border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => checkDaemonHealth()}
              disabled={isDaemonChecking}
              className="px-3.5 py-2 bg-[#1f1f1f] hover:bg-[#282828] border border-[#2d2d2d] rounded-xl text-xs font-semibold text-[#cccccc] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-[#FF6B50]" />
              <span>Check Health</span>
            </button>

            <button
              onClick={() => getDaemonStatus()}
              disabled={isDaemonChecking}
              className="px-3.5 py-2 bg-[#1f1f1f] hover:bg-[#282828] border border-[#2d2d2d] rounded-xl text-xs font-semibold text-[#cccccc] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#888888] ${isDaemonChecking ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#FF6B50] hover:bg-[#E55A40] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
