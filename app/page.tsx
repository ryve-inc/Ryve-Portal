'use client';

import React from 'react';
import { useRyve } from '@/lib/store';
import { useSession } from '@/lib/auth-client';
import { LandingPage } from './_components/LandingPage';
import { Navbar } from '@/components/Navbar';
import { DashboardView } from './_components/DashboardView';
import { GetNodesView } from './_components/GetNodesView';

function AuthenticatedPortal() {
  const { activeTab, setActiveTab } = useRyve();

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-950 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-950">
      {/* Top Header with Brand, Navbar Tabs, and Organization ID */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' ? <DashboardView /> : <GetNodesView />}
      </main>
    </div>
  );
}

export default function Page() {
  const { data: session, isPending } = useSession();
  const { setActiveTab } = useRyve();

  // Loading state while verifying authentication
  if (isPending) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold text-lg tracking-widest shadow-md animate-pulse">
          RY
        </div>
        <p className="mt-3 text-xs font-mono text-zinc-400">Loading Ryve session...</p>
      </div>
    );
  }

  // If authenticated, show the dashboard portal
  if (session) {
    return <AuthenticatedPortal />;
  }

  // If not authenticated, show the public landing page
  return <LandingPage onEnterDashboard={() => setActiveTab('dashboard')} />;
}
