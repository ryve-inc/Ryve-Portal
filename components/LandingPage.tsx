'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
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
  Activity,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { copyToClipboard } from '@/lib/format';

interface LandingPageProps {
  onEnterDashboard?: () => void;
}

export function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const { data: session } = useSession();
  const [capacitySlider, setCapacitySlider] = useState(10);
  const [copiedInstall, setCopiedInstall] = useState(false);

  // Pricing calculations
  const ryveMonthly = capacitySlider * 4;
  const awsS3Monthly = Math.round(capacitySlider * 23 + capacitySlider * 0.25 * 90); // $23/TB storage + 25% egress at $0.09/GB

  const handleCopyInstall = () => {
    copyToClipboard('curl -sSL https://get.ryve.io | sh');
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-emerald-100 selection:text-emerald-950">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-zinc-200/80 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-sm tracking-widest shadow-xs">
            RY
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-zinc-950 flex items-center gap-1.5">
              <span>Ryve</span>
              <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                P2P FABRIC
              </span>
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-600">
          <a href="#how-it-works" className="hover:text-zinc-950 transition-colors">How It Works</a>
          <a href="#architecture" className="hover:text-zinc-950 transition-colors">Architecture</a>
          <a href="#storage-model" className="hover:text-zinc-950 transition-colors">Self-Hosted vs Managed</a>
          <a href="#pricing" className="hover:text-zinc-950 transition-colors">Pricing</a>
          <a href="#security" className="hover:text-zinc-950 transition-colors">Security</a>
        </nav>

        <div className="flex items-center gap-2.5">
          {session ? (
            <button
              onClick={onEnterDashboard}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>Go to Control Panel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-20 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-mono text-zinc-700 mb-8 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Ryve Fabric Protocol v1.4</span>
          <span className="text-zinc-300">|</span>
          <span className="text-emerald-700 font-semibold">$0 Egress Fees</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 max-w-4xl leading-[1.12]">
          The Distributed P2P Cloud Storage Fabric for Modern Infrastructure.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-zinc-600 max-w-2xl leading-relaxed">
          Transform your self-hosted servers, homelabs, and datacenter NVMe pods into a unified, zero-knowledge S3-compatible cloud. Fully private, zero egress penalties, and mathematically guaranteed redundancy.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-zinc-950/10 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Create Organization Free</span>
            <ArrowRight className="w-4 h-4 text-zinc-400" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200/90 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Sign In to Portal</span>
          </Link>
        </div>

        {/* Terminal Quickstart Snippet */}
        <div className="mt-10 w-full max-w-xl bg-zinc-950 text-zinc-200 rounded-xl p-3.5 border border-zinc-800 shadow-xl flex items-center justify-between text-left font-mono text-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="text-emerald-400 select-none">$</span>
            <span className="text-zinc-300 truncate">curl -sSL https://get.ryve.io | sh</span>
          </div>
          <button
            onClick={handleCopyInstall}
            className="ml-3 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            {copiedInstall ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Highlight Badges */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl text-left">
          <div className="p-4 bg-zinc-50/70 border border-zinc-200/80 rounded-xl">
            <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-950">11 9&apos;s</div>
            <div className="text-xs font-semibold text-zinc-900 mt-1">Durability SLA</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Reed-Solomon (8+4) erasure</div>
          </div>
          <div className="p-4 bg-zinc-50/70 border border-zinc-200/80 rounded-xl">
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600">$0.00</div>
            <div className="text-xs font-semibold text-zinc-900 mt-1">Egress Surcharges</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Free unlimited downloads</div>
          </div>
          <div className="p-4 bg-zinc-50/70 border border-zinc-200/80 rounded-xl">
            <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-950">&lt; 15 ms</div>
            <div className="text-xs font-semibold text-zinc-900 mt-1">Gossip Telemetry</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">SWIM failure detection</div>
          </div>
          <div className="p-4 bg-zinc-50/70 border border-zinc-200/80 rounded-xl">
            <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-950">Zero-Knowl.</div>
            <div className="text-xs font-semibold text-zinc-900 mt-1">AES-256-GCM</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Client-side sharded keys</div>
          </div>
        </div>
      </section>

      {/* Architecture / How it Works */}
      <section id="how-it-works" className="py-20 bg-zinc-50/70 border-t border-b border-zinc-200/80 px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-mono font-semibold text-emerald-700 uppercase tracking-widest">
              Distributed Mesh Architecture
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 mt-2">
              Engineered for Sovereign, Zero-Knowledge Storage
            </h2>
            <p className="text-sm text-zinc-600 mt-2">
              Every file is encrypted client-side, sliced into erasure shards, and distributed across independent physical nodes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-xs flex flex-col">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900 mb-4">
                <Server className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-zinc-950">1. Instant Node Enrollment</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed flex-1">
                Run our lightweight binary on any Linux server, Raspberry Pi cluster, or cloud VM. Nodes self-discover and establish encrypted WireGuard peer links automatically.
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-100 text-[11px] font-mono text-zinc-400">
                SWIM Gossip Protocol
              </div>
            </div>

            <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-xs flex flex-col">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900 mb-4">
                <Layers className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-zinc-950">2. Reed-Solomon Erasure</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed flex-1">
                Data is encoded with 8 data shards + 4 parity shards. Up to 4 physical nodes can suffer simultaneous catastrophic failure without losing a single byte of data.
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-100 text-[11px] font-mono text-zinc-400">
                11 9s Theoretical Durability
              </div>
            </div>

            <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-xs flex flex-col">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900 mb-4">
                <Globe className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-bold text-zinc-950">3. Drop-in S3 Gateway</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed flex-1">
                Point existing applications, backups, and S3 SDKs directly to your Ryve cluster endpoint. No code refactoring or proprietary vendor lock-in required.
              </p>
              <div className="mt-4 pt-4 border-t border-zinc-100 text-[11px] font-mono text-zinc-400">
                100% S3-API Compatible
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Storage Models: Free vs Managed */}
      <section id="storage-model" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold text-emerald-700 uppercase tracking-widest">
            Flexible Deployment
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 mt-2">
            Bring Your Own Nodes or Provision Ryve Pods
          </h2>
          <p className="text-sm text-zinc-600 mt-2">
            Mix and match self-hosted hardware with high-performance datacenter nodes seamlessly in the same storage network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Model 1: Free Self-Hosted */}
          <div className="p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-md">
                  Community & Self-Hosted
                </span>
                <span className="text-xs font-bold text-emerald-600 uppercase font-mono">100% Free</span>
              </div>

              <h3 className="text-2xl font-bold text-zinc-950 mt-4">Self-Hosted Storage Nodes</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Connect your existing servers, NAS devices, or homelabs. Retain complete hardware custody with zero subscription or storage charges.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-zinc-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited self-hosted nodes and total capacity</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full control plane and node gossip health metrics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Client-side AES-256-GCM zero-knowledge encryption</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Complete S3 compatibility with API access tokens</span>
                </li>
              </ul>
            </div>

            <Link
              href="/signup"
              className="mt-8 w-full py-2.5 px-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-colors text-center block"
            >
              Start Self-Hosting Free
            </Link>
          </div>

          {/* Model 2: Dedicated Ryve NVMe */}
          <div className="p-8 bg-zinc-950 text-white border border-zinc-800 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                Enterprise SLA
              </span>
            </div>

            <div>
              <span className="text-xs font-mono font-semibold text-emerald-400">
                Dedicated NVMe Infrastructure
              </span>

              <h3 className="text-2xl font-bold text-white mt-4">Ryve-Provided Storage Pods</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Need guaranteed datacenter bandwidth and 99.99% uptime? Provision dedicated enterprise NVMe storage pods directly in your network.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Enterprise Gen4 NVMe arrays with 10 Gbps uplinks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Geographic distribution across North America & Europe</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Strictly zero egress fees ($0 / GB download)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Flat $4.00 / TB / month predictable billing</span>
                </li>
              </ul>
            </div>

            <Link
              href="/signup"
              className="mt-8 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors text-center block"
            >
              Deploy Dedicated Pods
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section id="pricing" className="py-20 bg-zinc-50/70 border-t border-b border-zinc-200/80 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          <div className="text-center">
            <span className="text-xs font-mono font-semibold text-emerald-700 uppercase tracking-widest">
              Cost Economics
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 mt-2">
              Predictable, Transparent Storage Economics
            </h2>
            <p className="text-sm text-zinc-600 mt-2">
              No hidden egress penalties. No API request surcharges.
            </p>
          </div>

          <div className="p-8 bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-semibold text-zinc-800">
                  Select Required Dedicated Capacity:
                </label>
                <span className="text-xl font-bold font-mono text-zinc-950">{capacitySlider} TB</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={capacitySlider}
                onChange={(e) => setCapacitySlider(parseInt(e.target.value) || 1)}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-950"
              />
              <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                <span>1 TB</span>
                <span>25 TB</span>
                <span>50 TB</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
              <div className="p-5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-800 uppercase font-semibold">Ryve Managed Storage</span>
                  <div className="text-3xl font-extrabold font-mono text-emerald-950 mt-1">
                    ${ryveMonthly} <span className="text-xs font-normal text-emerald-700">/ month</span>
                  </div>
                </div>
                <div className="text-[11px] text-emerald-800 mt-3 font-mono">
                  $4.00/TB • Zero egress fees • RS 8+4 included
                </div>
              </div>

              <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-200 flex flex-col justify-between opacity-80">
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

      {/* Bottom CTA Banner */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <div className="p-10 bg-zinc-950 text-white rounded-3xl shadow-xl border border-zinc-800 relative overflow-hidden">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to orchestrate your sovereign storage cloud?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-3 max-w-md mx-auto leading-relaxed">
            Register your organization in under 60 seconds. Enroll existing hardware or provision high-speed NVMe nodes instantly.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="px-6 py-3 bg-white text-zinc-950 hover:bg-zinc-100 rounded-xl text-xs font-semibold transition-all shadow-md"
            >
              Create Account Free
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 bg-zinc-900 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold transition-colors border border-zinc-800"
            >
              Sign In to Organization
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 border-t border-zinc-200">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-zinc-950 text-white flex items-center justify-center font-bold text-[10px]">
            RY
          </div>
          <span className="font-semibold text-zinc-900">Ryve Protocol</span>
          <span>© 2026 Ryve Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="hover:text-zinc-900 transition-colors">Sign In</Link>
          <Link href="/signup" className="hover:text-zinc-900 transition-colors">Sign Up</Link>
          <a href="#architecture" className="hover:text-zinc-900 transition-colors">Protocol Spec</a>
        </div>
      </footer>
    </div>
  );
}

