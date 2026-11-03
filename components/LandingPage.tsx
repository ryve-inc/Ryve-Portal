'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRyve } from '@/lib/store';
import { 
  Server, 
  HardDrive, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Check, 
  Terminal, 
  Layers, 
  Lock, 
  Globe, 
  Cpu, 
  Sparkles,
  ChevronRight,
  Activity,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { copyToClipboard } from '@/lib/format';

export function LandingPage() {
  const { setCurrentView, openAddNodeModal, addToast } = useRyve();
  const [capacitySlider, setCapacitySlider] = useState(5);
  const [copiedInstall, setCopiedInstall] = useState(false);

  // Pricing calculations
  const ryveMonthly = capacitySlider * 4;
  const awsS3Monthly = Math.round(capacitySlider * 23 + capacitySlider * 0.2 * 90); // $23/TB storage + 20% egress at $0.09/GB

  const handleCopyInstall = () => {
    copyToClipboard('curl -sSL https://get.ryve.io | sh');
    setCopiedInstall(true);
    addToast({ type: 'success', title: 'CLI command copied', description: 'curl -sSL https://get.ryve.io | sh' });
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-emerald-100 selection:text-emerald-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-zinc-200/80 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-sm tracking-widest shadow-xs">
            RY
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-zinc-950 flex items-center gap-1.5">
              <span>Ryve</span>
              <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                P2P FABRIC
              </span>
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-600">
          <a href="#how-it-works" className="hover:text-zinc-950 transition-colors">How It Works</a>
          <a href="#architecture" className="hover:text-zinc-950 transition-colors">Architecture</a>
          <a href="#storage-model" className="hover:text-zinc-950 transition-colors">Free vs Managed</a>
          <a href="#pricing" className="hover:text-zinc-950 transition-colors">Pricing</a>
          <a href="#security" className="hover:text-zinc-950 transition-colors">Security</a>
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            className="px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            Get Started
          </Link>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>Launch Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-24 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-mono text-zinc-700 mb-8 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Ryve Control Plane v1.4.2 Released</span>
          <span className="text-zinc-300">|</span>
          <span className="text-emerald-700 font-semibold">$0 Egress Fees</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 max-w-4xl leading-[1.12]">
          The Distributed P2P Cloud Storage Fabric for Modern Infrastructure.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-zinc-600 max-w-2xl leading-relaxed">
          Transform your self-hosted servers and lab workstations into a resilient, zero-knowledge storage cloud for free. Expand instantly with dedicated Ryve NVMe nodes when you need more capacity.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="w-full sm:w-auto px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Enter Ryve Control Panel</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopyInstall}
            className="w-full sm:w-auto px-4 py-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-lg text-xs font-mono text-zinc-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Terminal className="w-4 h-4 text-zinc-500" />
            <span>curl -sSL https://get.ryve.io | sh</span>
            {copiedInstall ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
          </button>
        </div>

        {/* 5-Second Health Telemetry Teaser */}
        <div className="mt-14 w-full p-4 bg-zinc-50 border border-zinc-200/90 rounded-2xl shadow-sm text-left">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-zinc-900">Live Peer Mesh Health Snapshot</span>
            </div>
            <span className="font-mono text-[11px] text-zinc-500">Network ID: RYV-NET-8492</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400">Total Mesh Storage</span>
              <div className="text-lg font-bold font-mono text-zinc-950 mt-0.5">30.8 TB</div>
              <span className="text-[11px] text-emerald-700">11.4 TB utilized</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400">Connected Nodes</span>
              <div className="text-lg font-bold font-mono text-zinc-950 mt-0.5">27 Devices</div>
              <span className="text-[11px] text-emerald-700">100% nominal</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400">Redundancy Coding</span>
              <div className="text-lg font-bold font-mono text-zinc-950 mt-0.5">RS (8+4)</div>
              <span className="text-[11px] text-zinc-600">Survives 4 node failures</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400">Mean P2P Latency</span>
              <div className="text-lg font-bold font-mono text-zinc-950 mt-0.5">18.4 ms</div>
              <span className="text-[11px] text-emerald-700">Zero packet loss</span>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & How It Works */}
      <section id="how-it-works" className="py-20 bg-zinc-50 border-t border-b border-zinc-200/80 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono font-semibold text-emerald-700 uppercase tracking-widest">
              Core Architecture
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 mt-2">
              Separation of Control Plane & P2P Data Plane
            </h2>
            <p className="text-sm text-zinc-600 mt-2">
              Ryve Portal manages identity, networks, billing, and telemetry, while your files stay strictly encrypted and distributed across self-hosted and dedicated nodes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-zinc-200/80 rounded-xl shadow-xs flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-semibold text-base text-zinc-950">Enroll Your Hardware</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Generate an enrollment code from the portal. Run the 1-line daemon on any Ubuntu, Debian, macOS, or NAS appliance. The device securely joins your private Network ID.
              </p>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold mt-auto">
                Free Forever ($0/TB)
              </span>
            </div>

            <div className="p-6 bg-white border border-zinc-200/80 rounded-xl shadow-xs flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-semibold text-base text-zinc-950">Client-Side Erasure Sharding</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Files are encrypted with AES-256-GCM and mathematically chunked into 8 data shards + 4 parity shards using Reed-Solomon encoding before being sent to peers.
              </p>
              <span className="text-[11px] font-mono text-zinc-700 font-semibold mt-auto">
                Zero-Knowledge Privacy
              </span>
            </div>

            <div className="p-6 bg-white border border-emerald-200 rounded-xl shadow-xs flex flex-col gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-semibold text-base text-zinc-950">Scale With Ryve Pods</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                When you run out of local storage, request additional capacity directly in the portal. A dedicated high-IOPS datacenter node is provisioned and joins your mesh immediately.
              </p>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold mt-auto">
                $4.00 / TB / month • $0 Egress
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Free vs Managed Storage Comparison */}
      <section id="storage-model" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold text-emerald-700 uppercase tracking-widest">
            Storage Model
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 mt-2">
            Customer-Owned vs. Ryve-Provided Storage
          </h2>
          <p className="text-sm text-zinc-600 mt-2">
            No vendor lock-in. Use your own hardware for maximum sovereignty or mix with Ryve managed pods for enterprise throughput.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Node Tier */}
          <div className="p-8 bg-white border border-zinc-200 rounded-2xl shadow-xs flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">Self-Hosted</span>
                <span className="px-2.5 py-1 rounded bg-zinc-100 text-zinc-900 font-mono text-xs font-bold">$0 Free Forever</span>
              </div>
              <h3 className="text-2xl font-bold text-zinc-950">Customer-Owned Devices</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Connect your existing servers, university lab machines, workstations, or NAS arrays to create a sovereign private mesh.
              </p>

              <ul className="flex flex-col gap-2.5 text-xs text-zinc-700 mt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited connected self-hosted devices</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full P2P encryption, chunking, and file distribution</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Cross-platform daemon (Linux, macOS, FreeBSD, TrueNAS)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero egress and bandwidth charges</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setCurrentView('dashboard');
                setTimeout(() => openAddNodeModal('customer'), 200);
              }}
              className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Enroll Free Customer Node
            </button>
          </div>

          {/* Ryve Managed Tier */}
          <div className="p-8 bg-white border-2 border-emerald-400/80 rounded-2xl shadow-md flex flex-col justify-between gap-6 relative">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-semibold">Managed Cloud</span>
                <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-900 font-mono text-xs font-bold">$4.00 / TB / mo</span>
              </div>
              <h3 className="text-2xl font-bold text-zinc-950">Ryve-Provided Storage Pods</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Enterprise datacenter NVMe nodes automatically provisioned and joined into your selected Network ID on demand.
              </p>

              <ul className="flex flex-col gap-2.5 text-xs text-zinc-700 mt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Provisioned in seconds directly to your Network ID</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>High-IOPS datacenter NVMe storage blocks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Guaranteed 99.99% uptime SLA with active parity mirrors</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Strictly zero egress fees ($0/GB download)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setCurrentView('dashboard');
                setTimeout(() => openAddNodeModal('ryve'), 200);
              }}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Request Managed Storage
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Pricing Calculator */}
      <section id="pricing" className="py-20 bg-zinc-50 border-t border-b border-zinc-200/80 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          <div className="text-center">
            <span className="text-xs font-mono font-semibold text-emerald-700 uppercase tracking-widest">
              Cost Comparison
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 mt-2">
              Transparent, Predictable Storage Economics
            </h2>
            <p className="text-sm text-zinc-600 mt-2">
              No hidden egress penalties. No API request surcharges. Just pure capacity.
            </p>
          </div>

          <div className="p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-semibold text-zinc-800">
                  Select Required Ryve Cloud Capacity:
                </label>
                <span className="text-xl font-bold font-mono text-zinc-950">{capacitySlider} TB</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={capacitySlider}
                onChange={(e) => setCapacitySlider(parseInt(e.target.value) || 1)}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                <span>1 TB</span>
                <span>25 TB</span>
                <span>50 TB</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-800 uppercase font-semibold">Ryve Managed Storage</span>
                  <div className="text-3xl font-extrabold font-mono text-emerald-950 mt-1">
                    ${ryveMonthly} <span className="text-xs font-normal text-emerald-700">/ month</span>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-800 mt-3 font-mono">
                  $4.00/TB • Zero egress • RS 8+4 included
                </div>
              </div>

              <div className="p-4 bg-zinc-100 rounded-xl border border-zinc-200 flex flex-col justify-between opacity-80">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Traditional Cloud (AWS S3)</span>
                  <div className="text-3xl font-extrabold font-mono text-zinc-600 mt-1">
                    ~${awsS3Monthly} <span className="text-xs font-normal text-zinc-500">/ month</span>
                  </div>
                </div>
                <div className="text-[11px] text-zinc-500 mt-3 font-mono">
                  $23/TB storage + $0.09/GB egress fees
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 border-t border-zinc-200">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-zinc-950 text-white flex items-center justify-center font-bold text-[10px]">
            RY
          </div>
          <span className="font-semibold text-zinc-900">Ryve Portal</span>
          <span>© 2026 Ryve Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-zinc-900">Security Whitepaper</a>
          <a href="#" className="hover:text-zinc-900">Protocol Spec</a>
          <button onClick={() => setCurrentView('dashboard')} className="font-semibold text-zinc-900 hover:underline">
            Open Portal
          </button>
        </div>
      </footer>
    </div>
  );
}
