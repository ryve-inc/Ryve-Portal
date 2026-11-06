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
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-emerald-100 selection:text-emerald-950">
      {/* Top Header */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ryve Distributed Storage Mesh</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-mono text-zinc-600">Mesh Online</span>
        </div>
      </div>

      {/* Main Centered Auth Form */}
      <div className="flex-1 flex items-center justify-center py-10">
        <SignUpForm />
      </div>

      {/* Bottom Footer Technical Features */}
      <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500 font-mono border-t border-zinc-200/80 pt-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Server className="w-3.5 h-3.5 text-zinc-400" /> Free Self-Hosted Nodes
          </span>
          <span className="flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-zinc-400" /> Dedicated NVMe Pods
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> RS (8+4) Erasure
          </span>
        </div>

        <span>© 2026 Ryve Inc. All rights reserved.</span>
      </div>
    </div>
  );
}
