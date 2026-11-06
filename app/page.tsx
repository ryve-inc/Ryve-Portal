'use client';

import React from 'react';
import { useRyve } from '@/context/store';
import { useSession } from '@/lib/auth-client';
import { LandingPage } from './_components/LandingPage';
import { Navbar } from '@/components/Navbar';
import { DashboardView } from './_components/DashboardView';
import { GetNodesView } from './_components/GetNodesView';

function AuthenticatedPortal() {
  const { activeTab } = useRyve();

  return (
    <div className="min-h-screen bg-[#050505] text-[#ebebeb] flex flex-col font-sans selection-coral relative">
      {/* Radial atmosphere glow in background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-125 bg-[radial-gradient(ellipse_at_top,#1f1412_0%,transparent_70%)] opacity-40"></div>
      </div>

      {/* Top Header with Brand, Navbar Tabs, and Organization ID */}
      <div className="relative z-10">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' ? <DashboardView /> : <GetNodesView />}
      </main>
    </div>
  );
}

export default function Page() {
  const { data: session } = useSession();
  const { setActiveTab } = useRyve();

  // If authenticated, show the dashboard portal
  if (session) {
    return <AuthenticatedPortal />;
  }

  // If not authenticated, show the public landing page immediately with zero loading screen
  return <LandingPage onEnterDashboard={() => setActiveTab('dashboard')} />;
}
