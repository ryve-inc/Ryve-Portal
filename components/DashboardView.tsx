'use client';

import React from 'react';
import { useRyve } from '@/lib/store';
import { 
  Server, 
  HardDrive, 
  Calendar, 
  Clock, 
  Activity, 
  PlusCircle, 
  ShieldCheck, 
  Globe, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export function DashboardView() {
  const { nodes, organization, setActiveTab, isLoading } = useRyve();

  const activeNodes = nodes.filter((n) => n.status === 'active');
  const expiredNodes = nodes.filter((n) => n.status === 'expired');
  const totalCapacityGb = nodes.reduce((sum, n) => sum + (n.capacityGb || 0), 0);

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

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Welcome */}
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

        <button
          onClick={() => setActiveTab('get-nodes')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5 text-zinc-400" />
          <span>Allocate New Node</span>
        </button>
      </div>

      {/* Metric Cards */}
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
              {nodes.length} <span className="text-sm font-sans font-normal text-zinc-500">Nodes</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-zinc-600">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {activeNodes.length} Active
              </span>
              {expiredNodes.length > 0 && (
                <span className="text-zinc-400">• {expiredNodes.length} Expired</span>
              )}
            </div>
          </div>
        </div>

        {/* Total Storage Allocated */}
        <div className="p-5 bg-white border border-zinc-200/90 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Total Capacity
            </span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900">
              <HardDrive className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-mono text-zinc-950">
              {totalCapacityGb >= 1000 ? `${(totalCapacityGb / 1000).toFixed(1)} TB` : `${totalCapacityGb} GB`}
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Dedicated storage provisioned across your mesh
            </p>
          </div>
        </div>

        {/* Organization Status */}
        <div className="p-5 bg-white border border-zinc-200/90 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Network Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xl font-bold font-mono text-emerald-700 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Operational
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Zero-knowledge S3-compatible cluster online
            </p>
          </div>
        </div>
      </div>

      {/* Allocated Nodes List */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-950">Allocated Nodes Registry</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Detailed list of all nodes currently provisioned for this organization.
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-md">
            {nodes.length} Total
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
              You haven&apos;t allocated any nodes for your organization. Go to the &quot;Get Nodes&quot; section to specify required capacity and network address.
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
                  <th className="py-3 px-4">Network Address</th>
                  <th className="py-3 px-4">Purchased Date</th>
                  <th className="py-3 px-4">Date of Expiry</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-sans">
                {nodes.map((node, index) => {
                  const isExpired = node.status === 'expired' || new Date(node.expiresAt) < new Date();
                  return (
                    <tr key={node.id} className="hover:bg-zinc-50/70 transition-colors">
                      {/* Node Identifier */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-zinc-900">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-zinc-100 text-zinc-700 flex items-center justify-center text-[10px] font-bold">
                            #{index + 1}
                          </span>
                          <span className="text-zinc-600 text-[11px]" title={node.id}>
                            {node.id.substring(0, 8)}...
                          </span>
                        </div>
                      </td>

                      {/* Capacity */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-zinc-950 text-sm">
                          {node.capacityGb >= 1000 ? `${(node.capacityGb / 1000).toFixed(1)} TB` : `${node.capacityGb} GB`}
                        </span>
                      </td>

                      {/* Network Address */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-100 font-mono text-[11px] text-zinc-800">
                          <Globe className="w-3 h-3 text-zinc-400" />
                          <span>{node.networkAddress}</span>
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
                      <td className="py-3.5 px-4 text-right">
                        {isExpired ? (
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

