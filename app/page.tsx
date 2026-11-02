'use client';

import React from 'react';
import { RyveProvider, useRyve } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { ToastContainer } from '@/components/ToastContainer';
import { AddNodeModal } from '@/components/AddNodeModal';
import { LandingPage } from '@/components/LandingPage';

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

function PortalContent() {
  const { currentView } = useRyve();

  if (currentView === 'landing') {
    return <LandingPage />;
  }

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

      {/* Modals & Toasts */}
      <AddNodeModal />
      <ToastContainer />
    </div>
  );
}

export default function Page() {
  return (
    <RyveProvider>
      <PortalContent />
    </RyveProvider>
  );
}
