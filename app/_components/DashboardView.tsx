'use client';

import React, { useState } from 'react';
import { useRyve } from '@/context/store';
import { AllocatedNode } from '@/types/ryve';
import { 
  Server, 
  HardDrive, 
  Calendar, 
  Clock, 
  Activity, 
  PlusCircle, 
  Globe, 
  AlertCircle,
  TrendingUp,
  LogOut,
  X,
  Loader2
} from 'lucide-react';

export function DashboardView() {
  const { 
    nodes, 
    organization, 
    setActiveTab, 
    isLoading,
    upgradeNodeCapacity,
    leaveNodeNetwork
  } = useRyve();

  const [resizingNode, setResizingNode] = useState<AllocatedNode | null>(null);
  const [newCapacityGb, setNewCapacityGb] = useState<number>(10);
  const [isSubmittingResize, setIsSubmittingResize] = useState(false);

  const [leavingNode, setLeavingNode] = useState<AllocatedNode | null>(null);
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);

  const activeNodes = nodes.filter((n) => n.status === 'active');
  const expiredNodes = nodes.filter((n) => n.status === 'expired');
  const decommissionedNodes = nodes.filter((n) => n.status === 'decommissioned');
  const totalCapacityGb = activeNodes.reduce((sum, n) => sum + (n.capacityGb || 0), 0);

  // Format date helper
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Handle Resize Submit
  const handleConfirmResize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resizingNode) return;
    setIsSubmittingResize(true);
    try {
      await upgradeNodeCapacity(
        resizingNode.id,
        resizingNode.networkId,
        newCapacityGb,
        resizingNode.networkAddress
      );
      setResizingNode(null);
    } finally {
      setIsSubmittingResize(false);
    }
  };

  // Handle Leave Network Submit
  const handleConfirmLeave = async () => {
    if (!leavingNode) return;
    setIsSubmittingLeave(true);
    try {
      await leaveNodeNetwork(leavingNode.id, leavingNode.networkId, leavingNode.networkAddress);
      setLeavingNode(null);
    } finally {
      setIsSubmittingLeave(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300 font-sans">
      {/* Top Banner / Welcome & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-[#1f1f1f]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF6B50] animate-pulse"></span>
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#888888] uppercase">
              Control Plane &mdash; Node Telemetry
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Infrastructure Mesh
          </h1>
          <p className="text-xs text-[#888888] mt-1 font-mono">
            Active allocations for{' '}
            <span className="font-semibold text-white">{organization?.name || 'Your Organization'}</span>.
          </p>
        </div>

        {/* Action Button: Allocate */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('get-nodes')}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FF6B50] hover:bg-[#E55A40] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Get Nodes</span>
          </button>
        </div>
      </div>

      {/* Metric Cards - Showing How Many Nodes Are Taken */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Nodes Taken */}
        <div className="p-7 bg-[#111111] border border-[#222222] rounded-4xl flex flex-col justify-between hover:border-[#333333] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#888888] uppercase">
              Nodes Taken
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#161616] border border-[#2a2a2a] flex items-center justify-center text-[#FF6B50]">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-6">
            <div className="text-4xl font-black font-mono text-white tracking-tight">
              {nodes.length} <span className="text-xs font-mono font-normal text-[#666666]">Total</span>
            </div>
            <div className="flex items-center gap-2.5 mt-3 text-xs font-mono">
              <span className="inline-flex items-center gap-1 text-[#FF6B50] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B50]"></span>
                {activeNodes.length} Active
              </span>
              {decommissionedNodes.length > 0 && (
                <span className="text-[#666666]">&bull; {decommissionedNodes.length} Left</span>
              )}
              {expiredNodes.length > 0 && (
                <span className="text-rose-400">&bull; {expiredNodes.length} Expired</span>
              )}
            </div>
          </div>
        </div>

        {/* Total Storage Allocated */}
        <div className="p-7 bg-[#111111] border border-[#222222] rounded-4xl flex flex-col justify-between hover:border-[#333333] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#888888] uppercase">
              Total Quota
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#161616] border border-[#2a2a2a] flex items-center justify-center text-[#FF6B50]">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-6">
            <div className="text-4xl font-black font-mono text-white tracking-tight">
              {totalCapacityGb >= 1000 ? `${(totalCapacityGb / 1000).toFixed(2)} TB` : `${Number(totalCapacityGb.toFixed(2))} GB`}
            </div>
            <p className="mt-3 text-xs text-[#888888] font-mono">
              Dedicated storage provisioned across swarm
            </p>
          </div>
        </div>

        {/* Managed Swarm Network */}
        <div className="p-7 bg-[#111111] border border-[#222222] rounded-4xl flex flex-col justify-between hover:border-[#333333] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#888888] uppercase">
              P2P Discovery
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#161616] border border-[#2a2a2a] flex items-center justify-center text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-6">
            <div className="text-lg font-bold font-mono text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SWARM CONNECTED
            </div>
            <p className="mt-3 text-xs text-[#888888] font-mono">
              Hyperswarm DHT & Reed-Solomon (8+4)
            </p>
          </div>
        </div>
      </div>

      {/* Allocated Nodes List Table */}
      <div className="bg-[#111111] border border-[#222222] rounded-4xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#1f1f1f] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Allocated Nodes Registry</h2>
            <p className="text-xs text-[#888888] mt-0.5 font-mono">
              Manage your active storage nodes, resize capacity, or leave networks.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#FF6B50] bg-[#1a1a1a] border border-[#2d2d2d] px-3 py-1 rounded-xl">
            {nodes.length} Nodes Registered
          </span>
        </div>

        {isLoading ? (
          <div className="p-16 text-center text-xs text-[#666666] font-mono">
            Syncing allocated storage nodes...
          </div>
        ) : nodes.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center text-[#666666] mb-4">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No storage nodes taken yet</h3>
            <p className="text-xs text-[#888888] mt-1 max-w-sm leading-relaxed font-mono">
              You haven&apos;t allocated any storage nodes for your organization. Allocate a node to join the encrypted P2P swarm.
            </p>
            <button
              onClick={() => setActiveTab('get-nodes')}
              className="mt-6 px-5 py-2.5 bg-[#FF6B50] hover:bg-[#E55A40] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
            >
              Get Your First Node &rarr;
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161616] text-[#888888] font-mono font-bold uppercase tracking-wider text-[10px] border-b border-[#222222]">
                <tr>
                  <th className="py-4 px-5">Node / ID</th>
                  <th className="py-4 px-5">Capacity</th>
                  <th className="py-4 px-5">Network Target</th>
                  <th className="py-4 px-5">Purchased Date</th>
                  <th className="py-4 px-5">Date of Expiry</th>
                  <th className="py-4 px-5">Duration</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1c1c] font-sans">
                {nodes.map((node, index) => {
                  const isDecommissioned = node.status === 'decommissioned';
                  const isExpired = node.status === 'expired' || (!isDecommissioned && new Date(node.expiresAt) < new Date());
                  
                  return (
                    <tr key={node.id} className="hover:bg-[#161616]/70 transition-colors">
                      {/* Node Identifier */}
                      <td className="py-4 px-5 font-mono font-semibold text-white">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-[#1e1e1e] border border-[#2d2d2d] text-[#888888] flex items-center justify-center text-[10px] font-bold">
                            #{index + 1}
                          </span>
                          <div>
                            <span className="text-white text-xs font-semibold block" title={node.id}>
                              {node.networkId ? node.networkId : node.id.substring(0, 8)}
                            </span>
                            {node.networkId && (
                              <span className="text-[10px] text-[#666666] font-mono block">
                                Net: {node.networkId}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Capacity */}
                      <td className="py-4 px-5">
                        <span className="font-mono font-extrabold text-white text-sm">
                          {node.capacityGb >= 1000 ? `${(node.capacityGb / 1000).toFixed(2)} TB` : `${node.capacityGb} GB`}
                        </span>
                      </td>

                      {/* Network Address */}
                      <td className="py-4 px-5 max-w-xs">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#161616] border border-[#262626] font-mono text-[11px] text-[#cccccc] truncate max-w-full" title={node.networkAddress}>
                          <Globe className="w-3 h-3 text-[#FF6B50]" />
                          <span className="truncate">{node.networkAddress}</span>
                        </div>
                      </td>

                      {/* Purchased Date */}
                      <td className="py-4 px-5 text-[#888888] font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#555555]" />
                          <span>{formatDate(node.purchasedAt)}</span>
                        </div>
                      </td>

                      {/* Date of Expiry */}
                      <td className="py-4 px-5 font-mono text-[11px]">
                        <div className={`flex items-center gap-1.5 ${isExpired ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-medium'}`}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDate(node.expiresAt)}</span>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="py-4 px-5 text-[#aaaaaa] font-mono">
                        {node.durationMonths} {node.durationMonths === 1 ? 'Month' : 'Months'}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        {isDecommissioned ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#1a1a1a] text-[#777777] border border-[#2a2a2a]">
                            Decommissioned
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-rose-950/40 text-rose-400 border border-rose-800/40">
                            <AlertCircle className="w-3 h-3" />
                            Expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Active
                          </span>
                        )}
                      </td>

                      {/* API Action Buttons */}
                      <td className="py-4 px-5 text-right">
                        {!isDecommissioned ? (
                          <div className="flex items-center justify-end gap-2">
                            {/* Upgrade Capacity Button */}
                            <button
                              onClick={() => {
                                setResizingNode(node);
                                setNewCapacityGb(Number((node.capacityGb + 0.5).toFixed(1)));
                              }}
                              className="px-3 py-1.5 bg-[#161616] hover:bg-[#202020] border border-[#2a2a2a] hover:border-[#FF6B50] rounded-lg text-[11px] font-semibold text-[#ebebeb] hover:text-[#FF6B50] transition-all flex items-center gap-1.5 cursor-pointer"
                              title="Upgrade / Resize Network Capacity"
                            >
                              <TrendingUp className="w-3 h-3 text-[#FF6B50]" />
                              <span>Upgrade</span>
                            </button>

                            {/* Leave Network Button */}
                            <button
                              onClick={() => setLeavingNode(node)}
                              className="px-2.5 py-1.5 bg-[#161616] hover:bg-rose-950/30 border border-[#2a2a2a] hover:border-rose-900/50 rounded-lg text-[11px] font-semibold text-[#888888] hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                              title="Leave Network (Decommission)"
                            >
                              <LogOut className="w-3 h-3" />
                              <span>Leave</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#555555] font-mono">Archived</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upgrade / Resize Modal */}
      {resizingNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#111111] border border-[#242424] rounded-3xl p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-[#ebebeb]">
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1a1a1a] border border-[#2d2d2d] text-[#FF6B50] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Upgrade Storage Capacity</h3>
                  <p className="text-[11px] text-[#888888] font-mono">
                    Network: {resizingNode.networkId || resizingNode.id.substring(0, 8)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setResizingNode(null)}
                className="text-[#666666] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmResize} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-[#888888] block mb-1">
                  Current Capacity: <strong className="font-mono text-white">{resizingNode.capacityGb} GB</strong>
                </label>
                <label className="text-xs font-bold text-white block mt-4 mb-1.5 uppercase font-mono tracking-wider">
                  New Quota (GB):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={Number((resizingNode.capacityGb + 0.1).toFixed(1))}
                  required
                  value={newCapacityGb}
                  onChange={(e) => setNewCapacityGb(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-full px-4 py-3 bg-[#161616] border border-[#2a2a2a] rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#FF6B50] focus:ring-1 focus:ring-[#FF6B50]"
                />
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {[0.5, 1, 2, 5].map((inc) => (
                    <button
                      type="button"
                      key={inc}
                      onClick={() => setNewCapacityGb(Number((resizingNode.capacityGb + inc).toFixed(1)))}
                      className="px-3 py-1 bg-[#1a1a1a] hover:bg-[#252525] border border-[#2e2e2e] text-[#cccccc] hover:text-white text-xs font-mono rounded-lg transition-colors cursor-pointer"
                    >
                      +{inc} GB
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-[#161616] rounded-xl border border-[#262626] space-y-1">
                <span className="text-[10px] font-semibold text-[#888888] uppercase tracking-wider block font-mono">Target Network Address</span>
                <span className="text-[11px] text-[#cccccc] font-mono break-all block" title={resizingNode.networkAddress}>
                  {resizingNode.networkAddress || resizingNode.networkId || resizingNode.id.substring(0, 12)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setResizingNode(null)}
                  className="px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#222222] text-[#888888] hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingResize}
                  className="px-5 py-2.5 bg-[#FF6B50] hover:bg-[#E55A40] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  {isSubmittingResize ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Confirm Resize</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Network Modal */}
      {leavingNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#111111] border border-[#242424] rounded-3xl p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-[#ebebeb]">
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-400 flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Leave P2P Network</h3>
                  <p className="text-[11px] text-[#888888] font-mono">
                    Network: {leavingNode.networkId || leavingNode.id.substring(0, 8)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLeavingNode(null)}
                className="text-[#666666] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#888888] leading-relaxed font-mono">
              Are you sure you want to disconnect this node from the swarm? The node daemon will decommission this storage quota allocation.
            </p>

            <div className="p-3.5 bg-[#161616] rounded-xl border border-[#262626] space-y-1">
              <span className="text-[10px] font-semibold text-[#888888] uppercase tracking-wider block font-mono">Network Target</span>
              <span className="text-[11px] text-[#cccccc] font-mono break-all block" title={leavingNode.networkAddress}>
                {leavingNode.networkAddress || leavingNode.networkId || leavingNode.id.substring(0, 12)}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3">
              <button
                type="button"
                onClick={() => setLeavingNode(null)}
                className="px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#222222] text-[#888888] hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLeave}
                disabled={isSubmittingLeave}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                {isSubmittingLeave ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Leave Network</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
