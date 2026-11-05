'use client';

import React from 'react';
import { useRyve } from '@/lib/store';
import { useSession } from '@/lib/auth-client';
import { LandingPage } from '@/components/LandingPage';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { AddNodeModal } from '@/components/AddNodeModal';

// Views
import { DashboardView } from '@/components/views/DashboardView';
import { NetworksView } from '@/components/views/NetworksView';
import { NodesView } from '@/components/views/NodesView';
import { StorageView } from '@/components/views/StorageView';
import { FilesView } from '@/components/views/FilesView';
import { MonitoringView } from '@/components/views/MonitoringView';
import { BillingView } from '@/components/views/BillingView';
import { SecurityView } from '@/components/views/SecurityView';
import { OrganizationView } from '@/components/views/OrganizationView';

function AuthenticatedPortal() {
  const { currentView } = useRyve();

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-950 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-950">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Dynamic View Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'networks' && <NetworksView />}
          {currentView === 'nodes' && <NodesView />}
          {currentView === 'storage' && <StorageView />}
          {currentView === 'files' && <FilesView />}
          {currentView === 'monitoring' && <MonitoringView />}
          {currentView === 'billing' && <BillingView />}
          {currentView === 'security' && <SecurityView />}
          {currentView === 'organization' && <OrganizationView />}
        </main>
      </div>

      {/* Modals */}
      <AddNodeModal />
    </div>
  );
}

export default function Page() {
  const { data: session, isPending } = useSession();

  // Loading state while checking session
  if (isPending) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold text-lg tracking-widest shadow-md animate-pulse">
          RY
        </div>
        <p className="mt-3 text-xs font-mono text-zinc-400">Verifying Ryve session...</p>
      </div>
    );
  }

  // If authenticated, show the control plane dashboard
  if (session) {
    return <AuthenticatedPortal />;
  }

  // If unauthenticated, show the public landing page
  return <LandingPage />;
}
