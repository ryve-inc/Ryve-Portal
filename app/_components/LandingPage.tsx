'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { 
  Server, 
  HardDrive, 
  ShieldCheck, 
  Globe, 
  ArrowUpRight, 
  Terminal, 
  Layers, 
  Lock, 
  ArrowRight,
  Activity,
  Cpu,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface LandingPageProps {
  onEnterDashboard?: () => void;
}

export function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#050505] text-[#ebebeb] selection-coral overflow-x-hidden font-sans">
      
      {/* Top Glass Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-100 px-6 md:px-12 py-5 flex items-center justify-between text-sm font-medium tracking-tight glass-nav">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-black font-extrabold text-xl transition-transform group-hover:rotate-12 shadow-sm">
              R.
            </div>
            <span className="font-bold tracking-tight text-white text-base hidden sm:inline-block">
              Ryve
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-[#888888] text-xs font-mono uppercase tracking-wider">
            <a href="#about" className="hover:text-white transition-colors">Architecture</a>
            <a href="#protocol" className="hover:text-white transition-colors">Protocol</a>
            <a href="#storage" className="hover:text-white transition-colors">Nodes</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <span className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#111111] border border-[#222222] text-[11px] font-mono text-[#888888]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B50] animate-pulse"></span>
            SWARM v1.4
          </span>

          {session ? (
            <button
              onClick={onEnterDashboard}
              className="px-5 py-2.5 bg-[#FF6B50] hover:bg-[#E55A40] text-black font-bold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span>Control Panel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:block text-[#888888] hover:text-white text-xs font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-white hover:text-black border border-[#333333] text-white text-xs font-semibold rounded-xl transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-110 hidden md:flex items-center gap-2 p-2 glass-nav rounded-2xl shadow-2xl">
        <div className="flex items-center gap-1 pr-4 border-r border-[#333333]">
          <a href="#about" className="p-3 hover:bg-[#222222] text-[#888888] hover:text-white rounded-xl transition-all" title="Architecture">
            <Layers className="w-4 h-4" />
          </a>
          <a href="#protocol" className="p-3 hover:bg-[#222222] text-[#888888] hover:text-white rounded-xl transition-all" title="Protocol">
            <Cpu className="w-4 h-4" />
          </a>
          <a href="#storage" className="p-3 hover:bg-[#222222] text-[#888888] hover:text-white rounded-xl transition-all" title="Nodes">
            <HardDrive className="w-4 h-4" />
          </a>
          <a href="#contact" className="p-3 hover:bg-[#222222] text-[#888888] hover:text-white rounded-xl transition-all" title="Contact">
            <Globe className="w-4 h-4" />
          </a>
        </div>
        {session ? (
          <button 
            onClick={onEnterDashboard}
            className="px-6 py-3 bg-[#FF6B50] hover:bg-[#E55A40] text-black font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer"
          >
            Dashboard
          </button>
        ) : (
          <Link
            href="/signup"
            className="px-6 py-3 bg-[#FF6B50] hover:bg-[#E55A40] text-black font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer"
          >
            Join Mesh
          </Link>
        )}
      </div>

      {/* Hero Section */}
      <header className="relative min-h-screen w-full flex flex-col items-center justify-center pt-24 pb-16 px-6">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#201514_0%,#050505_70%)] opacity-50"></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FF6B50] animate-pulse"></span>
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#888888] uppercase">
              Distributed P2P Storage Mesh
            </span>
          </div>

          <h1 className="hero-text font-black text-white text-center select-none uppercase tracking-tighter">
            RYVE
          </h1>

          <p className="mt-8 text-base md:text-xl text-[#888888] max-w-2xl font-normal leading-relaxed">
            Transform self-hosted hardware, edge servers, and NVMe pods into a sovereign, zero-knowledge cloud with zero egress fees and Reed-Solomon redundancy.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href={session ? "#" : "/signup"}
              onClick={session ? onEnterDashboard : undefined}
              className="w-full sm:w-auto px-8 py-4 bg-[#FF6B50] hover:bg-[#E55A40] text-black font-extrabold text-sm tracking-wider uppercase rounded-xl shadow-lg shadow-[#FF6B50]/15 transition-all hover:scale-[1.02] cursor-pointer"
            >
              {session ? 'Enter Control Plane' : 'Deploy Storage Nodes Free'}
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-[#141414] hover:bg-white hover:text-black border border-[#2a2a2a] text-[#ebebeb] text-sm font-semibold rounded-xl transition-all"
            >
              Sign In to Organization
            </Link>
          </div>
        </div>

        {/* Bottom UI Overlays */}
        <div className="w-full max-w-7xl mx-auto mt-20 pt-10 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 z-10 text-xs font-mono text-[#888888]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>HYPERSWARM P2P FABRIC ONLINE</span>
            <span className="text-[#333333]">|</span>
            <span className="text-white font-semibold">REED-SOLOMON (8+4)</span>
          </div>

          <div className="flex items-center gap-6">
            <span>$0 EGRESS PENALTIES</span>
            <span className="text-[#333333]">|</span>
            <span className="text-[#FF6B50] font-bold">100% PRIVATE</span>
          </div>
        </div>
      </header>

      {/* Benefits Section */}
      <section id="about" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-2 rounded-full bg-[#FF6B50] animate-pulse"></div>
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#888888] uppercase">
            Why pay cloud egress when you can own the mesh?
          </span>
        </div>

        <h2 className="text-4xl md:text-7xl font-medium leading-[1.05] tracking-tight text-white max-w-5xl mb-20">
          Clean, sovereign storage that helps you <span className="text-[#555555]">ship faster</span> and eliminate cloud bandwidth taxes.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Benefit Card 1 */}
          <div className="bg-[#111111] rounded-[2.5rem] p-10 md:p-14 min-h-125 flex flex-col justify-between relative overflow-hidden group hover:bg-[#151515] transition-all duration-500 border border-[#222222]">
            <div className="flex items-center justify-between">
              <span className="bg-[#1a1a1a] text-[10px] font-mono font-bold px-4 py-2 rounded-full uppercase tracking-widest text-[#FF6B50] border border-[#333333]">
                Zero-Egress SLA
              </span>
              <span className="text-xs font-mono text-[#666666]">11 9s Durability</span>
            </div>
            
            <div className="mt-20">
              <h3 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-2 text-white">
                Start faster.
              </h3>
              <h3 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-[#333333] group-hover:text-[#666666] transition-colors">
                Store forever.
              </h3>
              <p className="mt-6 text-sm text-[#888888] font-normal leading-relaxed max-w-md">
                Encrypted erasure chunks are distributed over Hyperswarm P2P links. Even if 4 physical nodes go offline at once, every byte remains immediately readable.
              </p>
            </div>
          </div>

          {/* Benefit Card 2 */}
          <div className="bg-linear-to-br from-[#1a162b] to-[#120d20] border border-[#2b2440] rounded-[2.5rem] p-8 md:p-12 min-h-125 flex items-center justify-center relative overflow-hidden group">
            {/* Terminal / Browser Mockup Representation */}
            <div className="w-full max-w-md bg-[#0a0a0a] rounded-2xl shadow-2xl overflow-hidden border border-[#2a243d] transform group-hover:scale-[1.02] transition-transform duration-700 ease-out font-mono">
              <div className="bg-[#14101e] px-4 py-3 border-b border-[#2a243d] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-[10px] text-[#888888]">daemon: p2p://node-core</span>
              </div>
              <div className="p-6 text-xs space-y-3">
                <div className="text-[#FF6B50] font-bold">
                  $ ryve-node-daemon --status
                </div>
                <div className="text-white font-semibold">
                  [NodeStatus] ONLINE (Unlocked)
                </div>
                <div className="text-[#888888]">
                  Swarm Topic: <span className="text-[#ebebeb]">22863cbf985b32a1...</span>
                </div>
                <div className="text-[#888888]">
                  Storage Mode: <span className="text-[#ebebeb]">RS(8+4) Erasure Shards</span>
                </div>
                <div className="p-3 bg-[#110e19] rounded-xl border border-[#251e36] text-[11px] text-white flex items-center justify-between">
                  <span>Quota Allocated:</span>
                  <span className="text-[#FF6B50] font-bold">Dedicated Pod</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Architecture / Selected Capabilities */}
      <section id="protocol" className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#1a1a1a]">
        <div className="flex justify-between items-end mb-20 border-b border-[#222222] pb-10">
          <div>
            <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-[#FF6B50]">Protocol Capabilities</h2>
            <p className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-2">Engineered for absolute hardware custody.</p>
          </div>
          <span className="hidden md:block text-[#555555] text-xs font-mono uppercase tracking-widest">SPECIFICATION v1.4</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
          
          {/* Capability 1 */}
          <article className="group cursor-pointer">
            <div className="aspect-video overflow-hidden bg-[#111111] rounded-2xl border border-[#222222] p-8 flex flex-col justify-between group-hover:border-[#333333] transition-all">
              <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
                <span>01 / FABRIC</span>
                <span className="text-[#FF6B50]">SWIM GOSSIP</span>
              </div>
              <div>
                <Server className="w-10 h-10 text-white mb-4" />
                <h4 className="text-xl font-bold text-white">Instant Self-Discovery</h4>
                <p className="text-xs text-[#888888] mt-2 leading-relaxed">Nodes automatically peer over encrypted WireGuard links with sub-15ms failure detection.</p>
              </div>
            </div>
            <div className="mt-6 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-1 text-white group-hover:text-[#FF6B50] transition-colors">HYPERSWARM DHT</h3>
                <p className="text-[#666666] text-[10px] font-bold uppercase tracking-[0.2em]">P2P Holepunching & Peer Discovery</p>
              </div>
              <div className="p-3 rounded-full border border-[#333333] group-hover:bg-[#FF6B50] group-hover:text-black group-hover:border-transparent transition-all duration-300">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </article>

          {/* Capability 2 */}
          <article className="group cursor-pointer md:mt-16">
            <div className="aspect-video overflow-hidden bg-[#111111] rounded-2xl border border-[#222222] p-8 flex flex-col justify-between group-hover:border-[#333333] transition-all">
              <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
                <span>02 / DURABILITY</span>
                <span className="text-emerald-400">11 9s SLA</span>
              </div>
              <div>
                <ShieldCheck className="w-10 h-10 text-white mb-4" />
                <h4 className="text-xl font-bold text-white">Reed-Solomon Erasure Coding</h4>
                <p className="text-xs text-[#888888] mt-2 leading-relaxed">8 data shards + 4 parity shards guarantee survival across multi-datacenter catastrophic failure.</p>
              </div>
            </div>
            <div className="mt-6 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-1 text-white group-hover:text-[#FF6B50] transition-colors">CHUNKSTORE REPAIR</h3>
                <p className="text-[#666666] text-[10px] font-bold uppercase tracking-[0.2em]">Autonomous Swarm Self-Healing</p>
              </div>
              <div className="p-3 rounded-full border border-[#333333] group-hover:bg-[#FF6B50] group-hover:text-black group-hover:border-transparent transition-all duration-300">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </article>

          {/* Capability 3 */}
          <article className="group cursor-pointer">
            <div className="aspect-video overflow-hidden bg-[#111111] rounded-2xl border border-[#222222] p-8 flex flex-col justify-between group-hover:border-[#333333] transition-all">
              <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
                <span>03 / ENCRYPTION</span>
                <span className="text-purple-400">CHACHA20-POLY1305</span>
              </div>
              <div>
                <Lock className="w-10 h-10 text-white mb-4" />
                <h4 className="text-xl font-bold text-white">Zero-Knowledge Sovereign Keys</h4>
                <p className="text-xs text-[#888888] mt-2 leading-relaxed">Encryption occurs on your client machine before shards are distributed. No intermediary can decrypt your payloads.</p>
              </div>
            </div>
            <div className="mt-6 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-1 text-white group-hover:text-[#FF6B50] transition-colors">SOVEREIGN STORAGE</h3>
                <p className="text-[#666666] text-[10px] font-bold uppercase tracking-[0.2em]">End-to-End Cryptographic Custody</p>
              </div>
              <div className="p-3 rounded-full border border-[#333333] group-hover:bg-[#FF6B50] group-hover:text-black group-hover:border-transparent transition-all duration-300">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </article>

          {/* Capability 4 */}
          <article className="group cursor-pointer md:mt-16">
            <div className="aspect-video overflow-hidden bg-[#111111] rounded-2xl border border-[#222222] p-8 flex flex-col justify-between group-hover:border-[#333333] transition-all">
              <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
                <span>04 / GATEWAY</span>
                <span className="text-white">S3 API</span>
              </div>
              <div>
                <Globe className="w-10 h-10 text-white mb-4" />
                <h4 className="text-xl font-bold text-white">S3 Compatibility Layer</h4>
                <p className="text-xs text-[#888888] mt-2 leading-relaxed">Drop-in compatibility with standard AWS S3 SDKs, backups, and applications without refactoring code.</p>
              </div>
            </div>
            <div className="mt-6 flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-1 text-white group-hover:text-[#FF6B50] transition-colors">DROP-IN S3 ACCESS</h3>
                <p className="text-[#666666] text-[10px] font-bold uppercase tracking-[0.2em]">Zero Vendor Lock-in</p>
              </div>
              <div className="p-3 rounded-full border border-[#333333] group-hover:bg-[#FF6B50] group-hover:text-black group-hover:border-transparent transition-all duration-300">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </article>

        </div>
      </section>

      {/* Deployment Modes Section */}
      <section id="storage" className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#1a1a1a]">
        <div className="mb-16">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#FF6B50]">Deployment Models</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mt-2">Self-Hosted or Dedicated Pods.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-10 bg-[#111111] rounded-3xl border border-[#222222] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#888888] uppercase">Self-Hosted Hardware</span>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase">100% Free</span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-4">Community & On-Prem Nodes</h3>
              <p className="text-xs text-[#888888] mt-2 leading-relaxed">
                Enroll existing Linux boxes, homelabs, or Raspberry Pis into your sovereign network.
              </p>
              <ul className="mt-6 space-y-3 text-xs text-[#bbbbbb]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B50] shrink-0" />
                  <span>Unlimited self-hosted storage nodes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B50] shrink-0" />
                  <span>Zero subscription or storage fees</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B50] shrink-0" />
                  <span>Full control plane and live node metrics</span>
                </li>
              </ul>
            </div>

            <Link
              href="/signup"
              className="mt-8 w-full py-3 bg-[#1a1a1a] hover:bg-white hover:text-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-center border border-[#333333]"
            >
              Start Free
            </Link>
          </div>

          <div className="p-10 bg-[#16131c] rounded-3xl border border-[#322744] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#FF6B50] uppercase font-bold">Managed Pods</span>
                <span className="text-xs font-mono text-[#888888]">Enterprise SLA</span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-4">Dedicated NVMe Pods</h3>
              <p className="text-xs text-[#a09bb0] mt-2 leading-relaxed">
                High-performance Gen4 NVMe arrays with guaranteed 10 Gbps uplinks and zero egress fees.
              </p>
              <ul className="mt-6 space-y-3 text-xs text-[#d5d0e3]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B50] shrink-0" />
                  <span>Guaranteed 99.99% uptime SLA</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B50] shrink-0" />
                  <span>Geographic multi-region redundancy</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B50] shrink-0" />
                  <span>Zero egress penalties ($0/GB download)</span>
                </li>
              </ul>
            </div>

            <Link
              href="/signup"
              className="mt-8 w-full py-3 bg-[#FF6B50] hover:bg-[#E55A40] text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-center"
            >
              Provision Dedicated Capacity
            </Link>
          </div>
        </div>
      </section>

      {/* Massive Editorial Footer */}
      <footer id="contact" className="relative pt-40 pb-20 px-6 md:px-12 border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-16">
          <div className="flex-1">
            <h2 className="text-[14vw] md:text-[10vw] leading-[0.85] font-black tracking-tighter text-white mb-12 select-none">
              JOIN<br />THE MESH.
            </h2>
            <div className="flex flex-col gap-4">
              <Link
                href="/signup"
                className="text-3xl md:text-5xl font-extrabold text-white hover:text-[#FF6B50] transition-colors w-fit flex items-center gap-3"
              >
                <span>Deploy your organization</span>
                <ArrowRight className="w-8 h-8" />
              </Link>
              <p className="text-[#666666] text-xs font-mono">
                Sovereign, encrypted P2P storage mesh &mdash; zero egress fees.
              </p>
            </div>
          </div>

          <div className="flex gap-4 md:mb-6">
            <Link
              href="/login"
              className="px-6 py-3.5 bg-[#141414] hover:bg-white hover:text-black border border-[#2a2a2a] rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3.5 bg-[#FF6B50] hover:bg-[#E55A40] text-black rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              Sign Up Free
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-32 pt-8 border-t border-[#111111] flex flex-col md:flex-row justify-between text-[#444444] text-[10px] font-mono font-bold uppercase tracking-widest">
          <p>&copy; 2026 Ryve Network Inc. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#about" className="hover:text-white transition-colors">Architecture</a>
            <a href="#protocol" className="hover:text-white transition-colors">Protocol Spec</a>
            <Link href="/login" className="hover:text-white transition-colors">Portal</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
