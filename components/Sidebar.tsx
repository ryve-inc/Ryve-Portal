'use client';

import React from 'react';
import { useRyve } from '@/lib/store';
import { 
  LayoutDashboard, 
  Network, 
  Server, 
  HardDrive, 
  Files, 
  Activity, 
  CreditCard, 
  ShieldCheck, 
  Users, 
  Terminal,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export function Sidebar() {
  const { currentView, setCurrentView, stats, networks, files, openAddNodeModal } = useRyve();

  const navItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'networks', label: 'Networks', icon: Network, badge: networks.length },
    { id: 'nodes', label: 'Nodes', icon: Server, badge: stats.activeNodesCount },
    { id: 'storage', label: 'Storage', icon: HardDrive },
    { id: 'files', label: 'Files', icon: Files, badge: files.length },
    { id: 'monitoring', label: 'Monitoring', icon: Activity },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'organization', label: 'Organization', icon: Users },
  ];

  return (
    <aside className="w-56 shrink-0 h-[calc(100vh-3.5rem)] bg-zinc-50/70 border-r border-zinc-200/80 flex flex-col justify-between py-4 px-3 select-none">
      <div className="flex flex-col gap-5">
        {/* Navigation list */}
        <div className="flex flex-col gap-0.5">
          <div className="px-2 pb-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
            Control Plane
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-xs font-semibold'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-200 text-zinc-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick CTA to Request Storage */}
        <div className="px-1">
          <div className="p-3 bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-lg border border-zinc-800 shadow-sm">
            <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono uppercase tracking-wide mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Dedicated Storage</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-snug mb-2.5">
              Need more capacity? Provision managed Ryve nodes at $4/TB/mo.
            </p>
            <button
              onClick={() => openAddNodeModal('ryve')}
              className="w-full py-1.5 px-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Request Storage</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer / Utilities */}
      <div className="flex flex-col gap-1 border-t border-zinc-200/80 pt-3 px-1">
        {/* CLI Quick Hint */}
        <div className="px-2 py-1.5 rounded bg-zinc-100/80 border border-zinc-200 text-[11px] text-zinc-600 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-mono text-[10px]">ryve-cli v1.4.2</span>
          </div>
          <span className="text-[9px] bg-emerald-100 text-emerald-700 font-mono px-1 rounded">ready</span>
        </div>
      </div>
    </aside>
  );
}
