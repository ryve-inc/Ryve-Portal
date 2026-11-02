'use client';

import React, { useState, useMemo } from 'react';
import { useRyve } from '@/lib/store';
import { 
  Server, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Eye, 
  ShieldCheck, 
  HardDrive, 
  Activity, 
  Wifi, 
  WifiOff, 
  Clock, 
  ExternalLink,
  X,
  Sparkles
} from 'lucide-react';
import { formatBytes } from '@/lib/format';
import { NodeDevice, NodeStatus, NodeType } from '@/types/ryve';

export function NodesView() {
  const { 
    nodes, 
    networks, 
    selectedNetworkId, 
    setSelectedNetworkId, 
    openAddNodeModal,
    removeNode,
    toggleNodeStatus,
    addToast
  } = useRyve();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | NodeStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | NodeType>('all');
  const [selectedNode, setSelectedNode] = useState<NodeDevice | null>(null);

  // Filter nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      // Network filter
      if (selectedNetworkId !== 'all' && node.network_id !== selectedNetworkId) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && node.status !== statusFilter) {
        return false;
      }
      // Type filter
      if (typeFilter !== 'all' && node.node_type !== typeFilter) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          node.name.toLowerCase().includes(q) ||
          node.node_id_code.toLowerCase().includes(q) ||
          node.ip_address.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [nodes, selectedNetworkId, statusFilter, typeFilter, searchQuery]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-1 border-b border-zinc-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
            <span>Mesh Node Registry</span>
            <span className="text-xs font-mono font-normal bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded border border-zinc-200">
              {filteredNodes.length} Nodes
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Distributed physical and cloud storage devices actively holding encrypted erasure-coded shards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAddNodeModal('customer')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-md text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enroll Hardware</span>
          </button>
          <button
            onClick={() => openAddNodeModal('ryve')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Add Ryve Pod</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 border border-zinc-200/80 rounded-xl shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Node ID, Hostname, or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-zinc-200 rounded-md bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Network Filter */}
          <select
            value={selectedNetworkId}
            onChange={(e) => setSelectedNetworkId(e.target.value)}
            className="px-2.5 py-1.5 text-xs border border-zinc-200 rounded-md bg-white text-zinc-700"
          >
            <option value="all">All Networks</option>
            {networks.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs border border-zinc-200 rounded-md bg-white text-zinc-700"
          >
            <option value="all">All Node Types</option>
            <option value="customer_owned">Customer-Owned (Free)</option>
            <option value="ryve_provided">Ryve-Provided (Paid)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs border border-zinc-200 rounded-md bg-white text-zinc-700"
          >
            <option value="all">All Statuses</option>
            <option value="healthy">Healthy Only</option>
            <option value="warning">Warning Only</option>
            <option value="offline">Offline Only</option>
          </select>
        </div>
      </div>

      {/* Nodes Table */}
      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Node Name & ID</th>
                <th className="py-3 px-4">Network</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Capacity & Usage</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Seen</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredNodes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-400">
                    No nodes found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredNodes.map((node) => {
                  const net = networks.find((n) => n.id === node.network_id);
                  const usagePct = node.total_storage_bytes > 0 
                    ? Math.round((node.used_storage_bytes / node.total_storage_bytes) * 100)
                    : 0;

                  return (
                    <tr
                      key={node.id}
                      className="hover:bg-zinc-50/70 transition-colors group cursor-pointer"
                      onClick={() => setSelectedNode(node)}
                    >
                      {/* Name & ID */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-zinc-950 group-hover:text-emerald-700 transition-colors">
                            {node.name}
                          </span>
                          <span className="font-mono text-[10px] text-zinc-400">
                            {node.node_id_code}
                          </span>
                        </div>
                      </td>

                      {/* Network */}
                      <td className="py-3 px-4 text-zinc-600 font-medium">
                        {net?.name || 'Unassigned'}
                      </td>

                      {/* Node Type */}
                      <td className="py-3 px-4">
                        {node.node_type === 'customer_owned' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                            Customer (Free)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                            Ryve Managed
                          </span>
                        )}
                      </td>

                      {/* IP Address */}
                      <td className="py-3 px-4 font-mono text-[11px] text-zinc-500">
                        {node.ip_address}
                      </td>

                      {/* Capacity & Usage Bar */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 w-36">
                          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                            <span>{formatBytes(node.used_storage_bytes)}</span>
                            <span>{formatBytes(node.total_storage_bytes)}</span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${usagePct}%` }}
                              className={`h-full rounded-full transition-all ${
                                usagePct > 80 ? 'bg-amber-500' : 'bg-zinc-900'
                              }`}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {node.status === 'healthy' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Healthy ({node.health_score}%)
                          </span>
                        ) : node.status === 'warning' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Warning ({node.health_score}%)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Offline
                          </span>
                        )}
                      </td>

                      {/* Last Seen */}
                      <td className="py-3 px-4 text-zinc-500 font-mono text-[11px]">
                        {node.last_heartbeat}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div 
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => toggleNodeStatus(node.id)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded transition-colors"
                            title="Test status toggle (Simulate Healthy/Warning/Offline)"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedNode(node)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded transition-colors"
                            title="Inspect node telemetry"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeNode(node.id)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Revoke / Remove node"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Node Detail Drawer / Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-zinc-200 bg-zinc-50">
              <div>
                <h3 className="font-semibold text-base text-zinc-950">{selectedNode.name}</h3>
                <span className="font-mono text-xs text-zinc-500">{selectedNode.node_id_code}</span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-200/80">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block">Node Classification</span>
                  <span className="font-semibold text-zinc-800 capitalize mt-0.5 block">
                    {selectedNode.node_type === 'customer_owned' ? 'Customer Self-Hosted' : 'Ryve Managed Pod'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block">Uptime SLA</span>
                  <span className="font-semibold text-zinc-800 font-mono mt-0.5 block">
                    {selectedNode.uptime_pct}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block">IP / Mesh Host</span>
                  <span className="font-mono text-zinc-800 mt-0.5 block">{selectedNode.ip_address}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block">Roundtrip Latency</span>
                  <span className="font-mono text-zinc-800 mt-0.5 block">{selectedNode.latency_ms} ms</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="font-medium text-zinc-700">OS & Hardware Environment</span>
                <div className="p-2.5 bg-zinc-100 rounded border border-zinc-200 font-mono text-[11px] text-zinc-700">
                  {selectedNode.os_info}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="font-medium text-zinc-700">Ryve Daemon Binary Version</span>
                <div className="p-2.5 bg-zinc-100 rounded border border-zinc-200 font-mono text-[11px] text-zinc-700">
                  {selectedNode.version} (AES-256-GCM Hardware Acceleration Enabled)
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-200">
                <button
                  onClick={() => {
                    toggleNodeStatus(selectedNode.id);
                    setSelectedNode(null);
                  }}
                  className="px-3 py-1.5 border border-zinc-200 rounded text-zinc-700 hover:bg-zinc-100"
                >
                  Toggle Simulated Status
                </button>
                <button
                  onClick={() => {
                    removeNode(selectedNode.id);
                    setSelectedNode(null);
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded"
                >
                  Revoke Node Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
