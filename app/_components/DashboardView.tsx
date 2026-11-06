'use client';

import React, { useState } from 'react';
import { useRyve } from '@/lib/store';
import { AllocatedNode } from '@/types/ryve';
import { 
  Server, 
  HardDrive, 
  Calendar, 
  Clock, 
  Activity, 
  PlusCircle, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  LogOut,
  X,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { DaemonStatusModal } from '@/components/DaemonStatusModal';

export function DashboardView() {
  const { 
    nodes, 
    organization, 
    setActiveTab, 
    isLoading,
    checkDaemonHealth,
    getDaemonStatus,
    isDaemonChecking,
    upgradeNodeCapacity,
    leaveNodeNetwork
  } = useRyve();

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
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
      await upgradeNodeCapacity(resizingNode.id, resizingNode.networkId, newCapacityGb);
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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Welcome & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
            Node Infrastructure Overview
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time monitoring of nodes allocated to{' '}
            <span className="font-semibold text-zinc-800">{organization?.name || 'your organization'}</span>.
          </p>
        </div>

        {/* API Action Buttons: Health, Status, Allocate */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => checkDaemonHealth()}
            disabled={isDaemonChecking}
            title="Check Node Daemon Health"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 shadow-2xs transition-colors cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Health Check</span>
          </button>

          <button
            onClick={() => {
              setIsStatusModalOpen(true);
              getDaemonStatus();
            }}
            title="View Daemon Status"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 shadow-2xs transition-colors cursor-pointer"
          >
            <Server className="w-3.5 h-3.5 text-zinc-700" />
            <span>Daemon Status</span>
          </button>

          <button
            onClick={() => setActiveTab('get-nodes')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-zinc-400" />
            <span>Get Nodes</span>
          </button>
        </div>
      </div>

      {/* Metric Cards - Showing How Many Nodes Are Taken */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Nodes Taken */}
        <div className="p-5 bg-white border border-zinc-200/90 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Nodes Taken
            </span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
              <Server className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-mono text-zinc-950">
              {nodes.length} <span className="text-sm font-sans font-normal text-zinc-500">Total Taken</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-zinc-600">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {activeNodes.length} Active
              </span>
              {decommissionedNodes.length > 0 && (
                <span className="text-zinc-400">• {decommissionedNodes.length} Left</span>
              )}
              {expiredNodes.length > 0 && (
                <span className="text-rose-500">• {expiredNodes.length} Expired</span>
              )}
            </div>
          </div>
        </div>

        {/* Total Storage Allocated */}
        <div className="p-5 bg-white border border-zinc-200/90 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Total Storage Capacity
            </span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
              <HardDrive className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-mono text-zinc-950">
              {totalCapacityGb >= 1000 ? `${(totalCapacityGb / 1000).toFixed(2)} TB` : `${Number(totalCapacityGb.toFixed(2))} GB`}
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Total active storage capacity across your network
            </p>
          </div>
        </div>
      </div>

      {/* Allocated Nodes List Table */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-950">Allocated Nodes Registry</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Manage your active storage nodes, resize capacity, or leave networks.
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-md">
            {nodes.length} Nodes
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-zinc-400 font-mono">
            Loading allocated nodes...
          </div>
        ) : nodes.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900">No storage nodes taken yet</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm leading-relaxed">
              You haven&apos;t allocated any nodes for your organization. Go to &quot;Get Nodes&quot; to join a network and allocate storage.
            </p>
            <button
              onClick={() => setActiveTab('get-nodes')}
              className="mt-4 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Get Your First Node &rarr;
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 font-medium uppercase tracking-wider text-[11px] border-b border-zinc-100">
                <tr>
                  <th className="py-3 px-4">Node / ID</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Network Address / Link</th>
                  <th className="py-3 px-4">Purchased Date</th>
                  <th className="py-3 px-4">Date of Expiry</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">API Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-sans">
                {nodes.map((node, index) => {
                  const isDecommissioned = node.status === 'decommissioned';
                  const isExpired = node.status === 'expired' || (!isDecommissioned && new Date(node.expiresAt) < new Date());
                  
                  return (
                    <tr key={node.id} className="hover:bg-zinc-50/70 transition-colors">
                      {/* Node Identifier */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-zinc-900">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-zinc-100 text-zinc-700 flex items-center justify-center text-[10px] font-bold">
                            #{index + 1}
                          </span>
                          <div>
                            <span className="text-zinc-900 text-xs font-semibold block" title={node.id}>
                              {node.networkId ? node.networkId : node.id.substring(0, 8)}
                            </span>
                            {node.networkId && (
                              <span className="text-[10px] text-zinc-400 font-mono block">
                                Net: {node.networkId}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Capacity */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-zinc-950 text-sm">
                          {node.capacityGb >= 1000 ? `${(node.capacityGb / 1000).toFixed(2)} TB` : `${node.capacityGb} GB`}
                        </span>
                      </td>

                      {/* Network Address */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-100 font-mono text-[11px] text-zinc-800 truncate max-w-full" title={node.networkAddress}>
                          <Globe className="w-3 h-3 text-zinc-400 shrink-0" />
                          <span className="truncate">{node.networkAddress}</span>
                        </div>
                      </td>

                      {/* Purchased Date */}
                      <td className="py-3.5 px-4 text-zinc-700 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{formatDate(node.purchasedAt)}</span>
                        </div>
                      </td>

                      {/* Date of Expiry */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className={`flex items-center gap-1.5 ${isExpired ? 'text-rose-600 font-semibold' : 'text-emerald-700 font-medium'}`}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDate(node.expiresAt)}</span>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 text-zinc-600 font-medium">
                        {node.durationMonths} {node.durationMonths === 1 ? 'Month' : 'Months'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isDecommissioned ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">
                            Left Network
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertCircle className="w-3 h-3" />
                            Expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        )}
                      </td>

                      {/* API Action Buttons: Upgrade (Resize) and Leave Network */}
                      <td className="py-3.5 px-4 text-right">
                        {!isDecommissioned ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Upgrade Capacity Button (POST /api/v1/node/resize-network) */}
                            <button
                              onClick={() => {
                                setResizingNode(node);
                                setNewCapacityGb(Number((node.capacityGb + 0.5).toFixed(1)));
                              }}
                              className="px-2.5 py-1 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] font-semibold text-zinc-800 hover:text-zinc-950 transition-colors flex items-center gap-1 cursor-pointer"
                              title="Upgrade / Resize Network Capacity"
                            >
                              <TrendingUp className="w-3 h-3 text-emerald-600" />
                              <span>Upgrade</span>
                            </button>

                            {/* Leave Network Button (POST /api/v1/node/leave-network) */}
                            <button
                              onClick={() => setLeavingNode(node)}
                              className="px-2 py-1 bg-white hover:bg-rose-50 border border-zinc-200 hover:border-rose-200 rounded-lg text-[11px] font-semibold text-zinc-600 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                              title="Leave Network (Decommission)"
                            >
                              <LogOut className="w-3 h-3" />
                              <span>Leave</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-zinc-400 font-mono">Decommissioned</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950">Upgrade Storage Capacity</h3>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Node Network: {resizingNode.networkId || resizingNode.id.substring(0, 8)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setResizingNode(null)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmResize} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Current Capacity: <strong className="font-mono text-zinc-900">{resizingNode.capacityGb} GB</strong>
                </label>
                <label className="text-xs font-semibold text-zinc-900 block mt-3 mb-1">
                  New Allocated Capacity (GB):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={Number((resizingNode.capacityGb + 0.1).toFixed(1))}
                  required
                  value={newCapacityGb}
                  onChange={(e) => setNewCapacityGb(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {[0.5, 1, 2, 5].map((inc) => (
                    <button
                      type="button"
                      key={inc}
                      onClick={() => setNewCapacityGb(Number((resizingNode.capacityGb + inc).toFixed(1)))}
                      className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-mono rounded-lg transition-colors cursor-pointer"
                    >
                      +{inc} GB
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Network Address</span>
                <span className="text-[11px] text-zinc-700 font-mono break-all block" title={resizingNode.networkAddress}>
                  {resizingNode.networkAddress || resizingNode.networkId || resizingNode.id.substring(0, 12)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResizingNode(null)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingResize}
                  className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-950">Leave P2P Network</h3>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Network: {leavingNode.networkId || leavingNode.id.substring(0, 8)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLeavingNode(null)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              Are you sure you want to disconnect this node from the swarm network? The node daemon will decommission this storage allocation.
            </p>

            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Network Address</span>
              <span className="text-[11px] text-zinc-700 font-mono break-all block" title={leavingNode.networkAddress}>
                {leavingNode.networkAddress || leavingNode.networkId || leavingNode.id.substring(0, 12)}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLeavingNode(null)}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLeave}
                disabled={isSubmittingLeave}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isSubmittingLeave ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Leave Network</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daemon Status Slide-Over Modal */}
      <DaemonStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      />
    </div>
  );
}
