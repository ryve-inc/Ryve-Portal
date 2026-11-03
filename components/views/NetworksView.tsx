'use client';

import React, { useState } from 'react';
import { useRyve } from '@/lib/store';
import { 
  Network as NetworkIcon, 
  Plus, 
  Server, 
  HardDrive, 
  Key, 
  Trash2, 
  Copy, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  Globe,
  Layers,
  X
} from 'lucide-react';
import { formatBytes, copyToClipboard } from '@/lib/format';

export function NetworksView() {
  const { 
    networks, 
    nodes, 
    createNetwork, 
    deleteNetwork, 
    setSelectedNetworkId, 
    setCurrentView,
    generateEnrollmentCode,
    openAddNodeModal,
    addToast
  } = useRyve();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('us-east-1');
  const [redundancyPolicy, setRedundancyPolicy] = useState('Reed-Solomon (8+4)');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(code);
    setCopiedId(id);
    addToast({ type: 'success', title: 'Network ID copied', description: code });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createNetwork({ name, description, region, redundancyPolicy });
    setName('');
    setDescription('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-1 border-b border-zinc-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
            <span>Storage Networks</span>
            <span className="text-xs font-mono font-normal bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded border border-zinc-200">
              {networks.length} Active
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Isolated distributed meshes grouping customer-hosted hardware and Ryve cloud parity nodes.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-md text-xs font-medium shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Network</span>
        </button>
      </div>

      {/* Network Hierarchy Architecture Diagram Banner */}
      <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-xl flex flex-col gap-3">
        <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
          Architecture Topology: Zero-Knowledge Mesh
        </span>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 bg-white border border-zinc-200 rounded-md font-semibold text-zinc-900 shadow-2xs">
            Ryve Org ID
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-md font-semibold shadow-2xs">
            Network ID (e.g. RYV-NET-8492)
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-white border border-zinc-200 text-zinc-800 rounded-md shadow-2xs">
              Customer Devices (Free P2P)
            </div>
            <span className="text-zinc-400">+</span>
            <div className="px-3 py-1.5 bg-zinc-900 text-white rounded-md shadow-2xs">
              Ryve Dedicated Pods (Paid)
            </div>
          </div>
        </div>
      </div>

      {/* Networks Grid */}
      {networks.length === 0 ? (
        <div className="p-12 bg-white border border-zinc-200/80 rounded-xl text-center flex flex-col items-center justify-center">
          <Layers className="w-10 h-10 text-zinc-300 mb-3" />
          <h3 className="text-base font-semibold text-zinc-900">No Storage Networks Active</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-md">
            Networks isolate node clusters and enforce Reed-Solomon redundancy policies. Click Create Network to launch your first mesh.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 px-3.5 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-md text-xs font-medium cursor-pointer"
          >
            Create Network
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {networks.map((net) => {
            const netNodes = nodes.filter((n) => n.network_id === net.id);
            const customerNodes = netNodes.filter((n) => n.node_type === 'customer_owned');
            const ryveNodes = netNodes.filter((n) => n.node_type === 'ryve_provided');

            return (
              <div
                key={net.id}
                className="p-5 bg-white border border-zinc-200/80 rounded-xl shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between gap-4"
              >
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-base text-zinc-950">{net.name}</h3>
                    <div
                      onClick={(e) => handleCopy(net.id, net.network_id_code, e)}
                      className="flex items-center gap-1.5 mt-1 cursor-pointer group"
                      title="Click to copy Network ID"
                    >
                      <span className="font-mono text-xs text-zinc-500 group-hover:text-zinc-900 transition-colors">
                        {net.network_id_code}
                      </span>
                      {copiedId === net.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-zinc-400 group-hover:text-zinc-600" />
                      )}
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Healthy
                  </span>
                </div>

                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  {net.description}
                </p>
              </div>

              {/* Stats Box */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-50/80 rounded-lg border border-zinc-100 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block">Connected Nodes</span>
                  <div className="font-semibold text-zinc-900 mt-0.5">
                    {netNodes.length} devices
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    {customerNodes.length} customer • {ryveNodes.length} ryve
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block">Storage Capacity</span>
                  <div className="font-semibold text-zinc-900 mt-0.5">
                    {formatBytes(net.total_storage_bytes)}
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    {formatBytes(net.used_storage_bytes)} used
                  </span>
                </div>
              </div>

              {/* Redundancy & Region metadata */}
              <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                  {net.redundancy_policy}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-zinc-400" />
                  {net.region}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 gap-2">
                <button
                  onClick={() => {
                    generateEnrollmentCode(net.id);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-xs font-medium transition-colors cursor-pointer"
                  title="Generate node enrollment code"
                >
                  <Key className="w-3 h-3 text-zinc-500" />
                  <span>Enrollment Code</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setSelectedNetworkId(net.id);
                      setCurrentView('nodes');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-medium transition-colors cursor-pointer"
                  >
                    <span>View Nodes</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  {networks.length > 1 && (
                    <button
                      onClick={() => deleteNetwork(net.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete network"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Create Network Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h2 className="text-base font-semibold text-zinc-950">Create New Storage Network</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-3.5 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-zinc-800">Network Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Edge Ingestion Pod"
                  className="px-3 py-2 border border-zinc-200 rounded-md bg-white text-zinc-800"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-zinc-800">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Purpose and hardware specs of this cluster..."
                  className="px-3 py-2 border border-zinc-200 rounded-md bg-white text-zinc-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-medium text-zinc-800">Primary Region</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="px-3 py-2 border border-zinc-200 rounded-md bg-white text-zinc-800"
                  >
                    <option value="us-east-1">us-east-1 (N. Virginia)</option>
                    <option value="ap-south-1">ap-south-1 (Mumbai / Kochi)</option>
                    <option value="eu-central-1">eu-central-1 (Frankfurt)</option>
                    <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-medium text-zinc-800">Redundancy Coding</label>
                  <select
                    value={redundancyPolicy}
                    onChange={(e) => setRedundancyPolicy(e.target.value)}
                    className="px-3 py-2 border border-zinc-200 rounded-md bg-white text-zinc-800"
                  >
                    <option value="Reed-Solomon (8+4)">Reed-Solomon (8+4)</option>
                    <option value="Reed-Solomon (6+3)">Reed-Solomon (6+3)</option>
                    <option value="Reed-Solomon (4+2)">Reed-Solomon (4+2)</option>
                    <option value="3x Replication">3x Distributed Mirror</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-2 border border-zinc-200 rounded-md text-zinc-700 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white font-medium rounded-md"
                >
                  Create Network
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
