import React from 'react';
import Link from 'next/link';
import { SignUpForm } from './_components/SignUpForm';
import { ArrowLeft, ShieldCheck, Server, HardDrive } from 'lucide-react';

export const metadata = {
  title: 'Sign Up — Ryve Portal',
  description: 'Create an account and register your organization on Ryve.',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#ebebeb] flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection-coral relative">
      {/* Background radial atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,_#241715_0%,_transparent_70%)] opacity-50"></div>
      </div>

      {/* Top Header */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#888888] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF6B50]" />
          <span>Ryve Distributed Storage Mesh</span>
        </Link>

        <div className="flex items-center gap-2 px-3 py-1 bg-[#111111] border border-[#222222] rounded-full text-xs font-mono text-[#888888]">
          <span className="w-2 h-2 rounded-full bg-[#FF6B50] animate-pulse"></span>
          <span>Mesh Online</span>
        </div>
      </div>

      {/* Main Centered Auth Form */}
      <div className="flex-1 flex items-center justify-center py-10 relative z-10">
        <SignUpForm />
      </div>

      {/* Bottom Footer Technical Features */}
      <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#666666] font-mono border-t border-[#1a1a1a] pt-6 relative z-10">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5 text-[#888888]">
            <Server className="w-3.5 h-3.5 text-[#FF6B50]" /> Free Self-Hosted Nodes
          </span>
          <span className="flex items-center gap-1.5 text-[#888888]">
            <HardDrive className="w-3.5 h-3.5 text-[#FF6B50]" /> Dedicated NVMe Pods
          </span>
          <span className="flex items-center gap-1.5 text-[#888888]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> RS (8+4) Erasure
          </span>
        </div>

        <span>&copy; 2026 Ryve Network Inc.</span>
      </div>
    </div>
  );
}
