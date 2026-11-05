'use client';

import React, { useState } from 'react';
import { useRyve } from '@/lib/store';
import { AllocatedNode } from '@/types/ryve';
import { 
  Server, 
  HardDrive, 
  Globe, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Sparkles,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export function GetNodesView() {
  const { allocateNode, setActiveTab } = useRyve();

  // Form State
  const [capacityGb, setCapacityGb] = useState<number>(500);
  const [networkAddress, setNetworkAddress] = useState<string>('');
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Success state holding allocated node
  const [allocatedResult, setAllocatedResult] = useState<AllocatedNode | null>(null);

  // Calculated Preview Expiry Date
  const calculatePreviewExpiry = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + (Number(durationMonths) || 1));
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!capacityGb || capacityGb <= 0) {
      setErrorMessage('Please specify how much GB of storage capacity is needed.');
      return;
    }

    if (!networkAddress.trim()) {
      setErrorMessage('Please enter the network address (IP or hostname) for this node.');
      return;
    }

    if (!durationMonths || durationMonths <= 0) {
      setErrorMessage('Please enter how many months the node is required.');
      return;
    }

    setIsLoading(true);

    try {
      const newNode = await allocateNode({
        capacityGb: Number(capacityGb),
        networkAddress: networkAddress.trim(),
        durationMonths: Number(durationMonths),
      });

      setAllocatedResult(newNode);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to allocate storage node.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form to allocate another
  const handleReset = () => {
    setAllocatedResult(null);
    setNetworkAddress('');
    setErrorMessage(null);
  };

  // If node was just allocated, show the detailed success screen
  if (allocatedResult) {
    const purchasedDate = new Date(allocatedResult.purchasedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const expiryDate = new Date(allocatedResult.expiresAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div className="max-w-2xl mx-auto py-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="bg-white border border-emerald-200 rounded-3xl p-8 shadow-xl shadow-emerald-950/5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
            Node Successfully Allocated!
          </h2>
          <p className="text-xs text-zinc-600 mt-1.5 max-w-md mx-auto">
            Your distributed storage node has been provisioned and enrolled into your organization&apos;s mesh.
          </p>

          {/* Allocation Details Card */}
          <div className="mt-8 bg-zinc-50 border border-zinc-200/90 rounded-2xl p-6 text-left space-y-4 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-zinc-200">
              <div>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Capacity Allocated
                </span>
                <span className="text-xl font-bold font-mono text-zinc-950 mt-0.5 block">
                  {allocatedResult.capacityGb} GB
                </span>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Network Address
                </span>
                <span className="text-sm font-mono font-medium text-zinc-900 mt-1 block truncate">
                  {allocatedResult.networkAddress}
                </span>
              </div>
            </div>

            {/* Crucial Dates: Purchased & Expiry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-3.5 bg-white border border-zinc-200 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium mb-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Date Purchased</span>
                </div>
                <div className="text-sm font-mono font-semibold text-zinc-900">
                  {purchasedDate}
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium mb-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Date of Expiry</span>
                </div>
                <div className="text-sm font-mono font-bold text-emerald-950">
                  {expiryDate}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>Duration: {allocatedResult.durationMonths} Month(s)</span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Active Node
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>View in Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Allocate Another Node</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-2 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="pb-6 border-b border-zinc-200">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
          Get Storage Nodes
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Specify your capacity requirement, network destination, and lease duration to provision nodes instantly.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleAllocate} className="mt-8 space-y-6">
        {/* Error notification */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2.5">
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* 1. Storage Capacity Needed */}
        <div className="p-6 bg-white border border-zinc-200/90 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-600" />
                <span>1. Storage Capacity Needed (GB)</span>
              </label>
              <p className="text-xs text-zinc-500 mt-0.5">
                Enter the amount of storage space required for this node.
              </p>
            </div>
            <span className="text-lg font-extrabold font-mono text-zinc-950 bg-zinc-100 px-3 py-1 rounded-xl">
              {capacityGb} GB
            </span>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[100, 250, 500, 1000, 2500, 5000].map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => setCapacityGb(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                  capacityGb === preset
                    ? 'bg-zinc-950 text-white font-semibold shadow-xs'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                {preset >= 1000 ? `${preset / 1000} TB` : `${preset} GB`}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <input
              type="number"
              min="1"
              max="100000"
              required
              value={capacityGb}
              onChange={(e) => setCapacityGb(Math.max(1, parseInt(e.target.value) || 0))}
              placeholder="e.g. 500"
              className="w-full px-4 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-sm font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900"
            />
          </div>
        </div>

        {/* 2. Network Address */}
        <div className="p-6 bg-white border border-zinc-200/90 rounded-2xl shadow-xs space-y-3">
          <div>
            <label className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>2. Network Address</span>
            </label>
            <p className="text-xs text-zinc-500 mt-0.5">
              Enter the target IP address, DNS domain, or peer address for the node.
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              required
              value={networkAddress}
              onChange={(e) => setNetworkAddress(e.target.value)}
              placeholder="e.g. 192.168.1.120:9000 or node-east.ryve.internal:443"
              className="w-full px-4 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-sm font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900"
            />
          </div>
        </div>

        {/* 3. Duration Required (Months) */}
        <div className="p-6 bg-white border border-zinc-200/90 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-bold text-zinc-950 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>3. Duration Required (Months)</span>
              </label>
              <p className="text-xs text-zinc-500 mt-0.5">
                How many months should this node remain actively provisioned?
              </p>
            </div>
            <span className="text-lg font-extrabold font-mono text-zinc-950 bg-zinc-100 px-3 py-1 rounded-xl">
              {durationMonths} {durationMonths === 1 ? 'Month' : 'Months'}
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[1, 3, 6, 12, 24].map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setDurationMonths(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer ${
                  durationMonths === m
                    ? 'bg-zinc-950 text-white font-semibold shadow-xs'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                {m} {m === 1 ? 'Month' : 'Months'}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <input
              type="number"
              min="1"
              max="60"
              required
              value={durationMonths}
              onChange={(e) => setDurationMonths(Math.max(1, parseInt(e.target.value) || 1))}
              placeholder="e.g. 6"
              className="w-full px-4 py-2.5 bg-zinc-50/70 border border-zinc-200 rounded-xl text-sm font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900"
            />
          </div>
        </div>

        {/* Live Preview Summary */}
        <div className="p-5 bg-gradient-to-r from-emerald-50/70 to-zinc-50 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-zinc-950 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Allocation Preview</span>
            </div>
            <div className="text-xs text-zinc-600 font-mono">
              Will be valid from <strong className="text-zinc-900">Today</strong> until{' '}
              <strong className="text-emerald-800">{calculatePreviewExpiry()}</strong>.
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow-md shadow-zinc-950/10 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                <span>Allocating Node...</span>
              </>
            ) : (
              <>
                <span>Confirm & Allocate Node</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

