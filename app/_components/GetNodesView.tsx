'use client';

import React, { useState } from 'react';
import { useRyve } from '@/context/store';
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
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  Link as LinkIcon 
} from 'lucide-react';

export function GetNodesView() {
  const { allocateNode, setActiveTab, organization } = useRyve();

  // Form State
  const [capacityGb, setCapacityGb] = useState<number>(0.5);
  const [networkAddress, setNetworkAddress] = useState<string>('');
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [networkName, setNetworkName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Success state holding allocated node
  const [allocatedResult, setAllocatedResult] = useState<AllocatedNode | null>(null);

  // Helper to autofill sample 64-char hex P2P Link from daemon docs
  const handleUseSampleLink = () => {
    const sampleLink = 'p2p-drive://network/a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90?name=Customer-Acme';
    setNetworkAddress(sampleLink);
    if (!networkName) setNetworkName('Customer-Acme');
  };

  // Helper to generate a random valid 64-hex P2P Link
  const handleGenerateLink = () => {
    const chars = '0123456789abcdef';
    let hex = '';
    for (let i = 0; i < 64; i++) {
      hex += chars[Math.floor(Math.random() * chars.length)];
    }
    const name = networkName || organization?.name || 'Customer-Acme';
    setNetworkAddress(`p2p-drive://network/${hex}?name=${encodeURIComponent(name)}`);
  };

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
      setErrorMessage('Please enter the network address or P2P network link.');
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
        name: networkName.trim() || organization?.name || 'Customer-Acme',
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
      <div className="max-w-2xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-2 duration-300 font-sans">
        <div className="bg-[#111111] border border-[#242424] rounded-[2.5rem] p-10 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FF6B50]/10 border border-[#FF6B50]/30 text-[#FF6B50] flex items-center justify-center mx-auto mb-6 ring-8 ring-[#FF6B50]/5">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#FF6B50] uppercase block mb-1">
            ALLOCATION CONFIRMED
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Node Successfully Allocated
          </h2>
          <p className="text-xs text-[#888888] mt-2 max-w-md mx-auto font-mono">
            Storage quota provisioned and registered in your organization mesh.
          </p>

          {/* Allocation Details Card */}
          <div className="mt-8 bg-[#161616] border border-[#262626] rounded-2xl p-6 text-left space-y-5 font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 border-b border-[#222222]">
              <div>
                <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">
                  Capacity Allocated
                </span>
                <span className="text-3xl font-black text-white mt-1 block">
                  {allocatedResult.capacityGb} <span className="text-sm font-normal text-[#FF6B50]">GB</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">
                  Network Identifier
                </span>
                <span className="text-sm font-bold text-[#FF6B50] mt-1.5 block">
                  {allocatedResult.networkId || allocatedResult.id.substring(0, 12)}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">
                Target Network Address
              </span>
              <span className="text-xs text-[#cccccc] mt-1.5 block truncate" title={allocatedResult.networkAddress}>
                {allocatedResult.networkAddress}
              </span>
            </div>

            {/* Crucial Dates: Purchased & Expiry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 bg-[#111111] border border-[#222222] rounded-xl">
                <div className="flex items-center gap-1.5 text-xs text-[#777777] font-medium mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#555555]" />
                  <span>Date Purchased</span>
                </div>
                <div className="text-sm font-semibold text-white">
                  {purchasedDate}
                </div>
              </div>

              <div className="p-4 bg-[#111111] border border-[#FF6B50]/30 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs text-[#FF6B50] font-medium mb-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Date of Expiry</span>
                </div>
                <div className="text-sm font-bold text-white">
                  {expiryDate}
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-[#777777]">
              <span>Duration: {allocatedResult.durationMonths} Month(s)</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Node Quota
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="w-full sm:w-auto px-7 py-3 bg-[#FF6B50] hover:bg-[#E55A40] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>View in Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-3 bg-[#161616] hover:bg-[#202020] text-[#cccccc] hover:text-white border border-[#2a2a2a] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#777777]" />
              <span>Allocate Another Node</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4 animate-in fade-in duration-300 font-sans">
      {/* Page Header */}
      <div className="pb-6 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Get Storage Nodes
          </h1>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 bg-[#FF6B50]/10 text-[#FF6B50] rounded-md border border-[#FF6B50]/30 uppercase">
            STORAGE ALLOCATION
          </span>
        </div>
        <p className="text-xs text-[#888888] mt-1.5 font-mono">
          Join your customer network to the Ryve Managed Storage Node Daemon and provision dedicated capacity.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleAllocate} className="mt-8 space-y-6">
        {/* Error notification */}
        {errorMessage && (
          <div className="p-4 bg-rose-950/40 border border-rose-800/50 rounded-2xl text-xs text-rose-300 flex items-center gap-2.5 font-mono">
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* 1. Storage Capacity Needed */}
        <div className="p-7 bg-[#111111] border border-[#222222] rounded-[2rem] shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#FF6B50]" />
                <span>1. Storage Capacity Needed (GB)</span>
              </label>
              <p className="text-xs text-[#888888] mt-1 font-mono">
                Dedicated quota to allocate on the node daemon (allocatedGb).
              </p>
            </div>
            <span className="text-xl font-black font-mono text-white bg-[#161616] border border-[#2a2a2a] px-3.5 py-1.5 rounded-xl">
              {capacityGb} <span className="text-xs text-[#FF6B50]">GB</span>
            </span>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            {[0.5, 1, 2, 5, 10, 20].map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => setCapacityGb(preset)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  capacityGb === preset
                    ? 'bg-[#FF6B50] text-black shadow-md'
                    : 'bg-[#161616] hover:bg-[#202020] text-[#888888] hover:text-white border border-[#262626]'
                }`}
              >
                {preset} GB
              </button>
            ))}
          </div>

          <div className="pt-2">
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="50000"
              required
              value={capacityGb}
              onChange={(e) => setCapacityGb(Math.max(0.1, parseFloat(e.target.value) || 0))}
              placeholder="e.g. 0.5"
              className="w-full px-4 py-3 bg-[#161616] border border-[#282828] rounded-xl text-sm font-mono text-white placeholder:text-[#555555] focus:outline-none focus:border-[#FF6B50] focus:ring-1 focus:ring-[#FF6B50]"
            />
          </div>
        </div>

        {/* 2. Network Address / Link Input */}
        <div className="p-7 bg-[#111111] border border-[#222222] rounded-[2rem] shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#FF6B50]" />
                <span>2. Network Address / P2P Network Link</span>
              </label>
              <p className="text-xs text-[#888888] mt-1 font-mono">
                The 64-character hex link or network address (networkLink).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUseSampleLink}
                className="px-3 py-1.5 bg-[#161616] hover:bg-white hover:text-black border border-[#282828] text-[#cccccc] rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                title="Paste sample link from documentation"
              >
                <LinkIcon className="w-3 h-3 text-[#777777]" />
                <span>Sample Link</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateLink}
                className="px-3 py-1.5 bg-[#FF6B50]/10 hover:bg-[#FF6B50] text-[#FF6B50] hover:text-black border border-[#FF6B50]/30 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                title="Generate fresh 64-character hex P2P link"
              >
                <Sparkles className="w-3 h-3" />
                <span>Generate Hex</span>
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <input
              type="text"
              required
              value={networkAddress}
              onChange={(e) => setNetworkAddress(e.target.value)}
              placeholder="e.g. p2p-drive://network/a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90?name=Customer-Acme"
              className="w-full px-4 py-3 bg-[#161616] border border-[#282828] rounded-xl text-xs font-mono text-white placeholder:text-[#555555] focus:outline-none focus:border-[#FF6B50] focus:ring-1 focus:ring-[#FF6B50]"
            />

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={networkName}
                onChange={(e) => setNetworkName(e.target.value)}
                placeholder="Network display name (e.g. Customer-Acme)"
                className="w-full px-4 py-2.5 bg-[#161616] border border-[#282828] rounded-xl text-xs font-mono text-white placeholder:text-[#555555] focus:outline-none focus:border-[#FF6B50]"
              />
            </div>
          </div>
        </div>

        {/* 3. Duration Required (Months) */}
        <div className="p-7 bg-[#111111] border border-[#222222] rounded-[2rem] shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF6B50]" />
                <span>3. Duration Required (Months)</span>
              </label>
              <p className="text-xs text-[#888888] mt-1 font-mono">
                How many months should this node storage allocation remain active?
              </p>
            </div>
            <span className="text-xl font-black font-mono text-white bg-[#161616] border border-[#2a2a2a] px-3.5 py-1.5 rounded-xl">
              {durationMonths} <span className="text-xs text-[#FF6B50]">{durationMonths === 1 ? 'Month' : 'Months'}</span>
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            {[1, 3, 6, 12, 24].map((m) => (
              <button
                type="button"
                key={m}
                onClick={() => setDurationMonths(m)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  durationMonths === m
                    ? 'bg-[#FF6B50] text-black shadow-md'
                    : 'bg-[#161616] hover:bg-[#202020] text-[#888888] hover:text-white border border-[#262626]'
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
              placeholder="e.g. 3"
              className="w-full px-4 py-3 bg-[#161616] border border-[#282828] rounded-xl text-sm font-mono text-white focus:outline-none focus:border-[#FF6B50] focus:ring-1 focus:ring-[#FF6B50]"
            />
          </div>
        </div>

        {/* Live Preview Summary & Join Network Button */}
        <div className="p-6 bg-[#111111] border border-[#242424] rounded-[2rem] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 shadow-2xl">
          <div className="space-y-1 font-mono">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FF6B50]" />
              <span>Allocation Preview</span>
            </div>
            <div className="text-xs text-[#888888]">
              Active lease from <strong className="text-white">Today</strong> until{' '}
              <strong className="text-[#FF6B50]">{calculatePreviewExpiry()}</strong>.
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-7 py-3.5 bg-[#FF6B50] hover:bg-[#E55A40] text-black rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-[#FF6B50]/15 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Joining Mesh...</span>
              </>
            ) : (
              <>
                <span>Join Network & Allocate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
