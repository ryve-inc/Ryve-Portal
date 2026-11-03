'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRyve } from '@/lib/store';
import { useSession, signOut } from '@/lib/auth-client';
import { 
  Network as NetworkIcon, 
  ChevronDown, 
  Bell, 
  Plus, 
  HardDrive, 
  ShieldCheck, 
  ExternalLink,
  Activity,
  Layers,
  Copy,
  Check,
  LogOut,
  User,
  LogIn
} from 'lucide-react';
import { copyToClipboard } from '@/lib/format';
import { UserRole } from '@/types/ryve';

export function Navbar() {
  const { 
    organization, 
    networks, 
    selectedNetworkId, 
    setSelectedNetworkId,
    currentUserRole,
    setCurrentUserRole,
    stats,
    openAddNodeModal,
    auditLogs,
    addToast
  } = useRyve();

  const { data: session } = useSession();

  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [copiedOrgId, setCopiedOrgId] = useState(false);

  const selectedNet = networks.find((n) => n.id === selectedNetworkId);

  const userName = session?.user?.name || 'Administrator';
  const userEmail = session?.user?.email || 'admin@ryve.network';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const orgIdDisplay = organization.id.startsWith('org-') ? 'RYV-ORG-98241' : organization.id;

  const handleCopyOrgId = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(orgIdDisplay);
    setCopiedOrgId(true);
    addToast({ type: 'success', title: 'Organization ID copied', description: orgIdDisplay });
    setTimeout(() => setCopiedOrgId(false), 2000);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
      addToast({
        type: 'info',
        title: 'Signed out',
        description: 'You have been signed out of Ryve Portal.',
      });
    } catch {
      setIsUserMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Organization Identifier & Network Selector */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Organization Badge */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-zinc-950 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs">
            RY
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-semibold text-zinc-900 leading-tight">
              {organization.name}
            </span>
            <div className="flex items-center gap-1.5 cursor-pointer group" onClick={handleCopyOrgId}>
              <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-900 transition-colors">
                {organization.id.startsWith('org-') ? 'RYV-ORG-98241' : organization.id}
              </span>
              {copiedOrgId ? (
                <Check className="w-2.5 h-2.5 text-emerald-600" />
              ) : (
                <Copy className="w-2.5 h-2.5 text-zinc-400 group-hover:text-zinc-600" />
              )}
            </div>
          </div>
        </div>

        <span className="hidden sm:inline-block text-zinc-300">/</span>

        {/* Network Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNetworkDropdownOpen(!isNetworkDropdownOpen);
              setIsRoleDropdownOpen(false);
              setIsNotificationsOpen(false);
              setIsUserMenuOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-zinc-200 hover:border-zinc-300 bg-zinc-50/60 hover:bg-zinc-100/80 text-xs font-medium text-zinc-800 transition-all cursor-pointer"
          >
            <NetworkIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span className="max-w-[130px] sm:max-w-[180px] truncate">
              {selectedNetworkId === 'all' ? 'All Networks' : selectedNet?.name || 'Select Network'}
            </span>
            <ChevronDown className="w-3 h-3 text-zinc-500 ml-0.5" />
          </button>

          {isNetworkDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-64 bg-white border border-zinc-200 rounded-lg shadow-xl py-1 z-50 text-xs animate-in fade-in-50 zoom-in-95">
              <div className="px-3 py-1.5 border-b border-zinc-100 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Select Active Network
              </div>
              <button
                onClick={() => {
                  setSelectedNetworkId('all');
                  setIsNetworkDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-zinc-50 transition-colors ${
                  selectedNetworkId === 'all' ? 'bg-zinc-100/80 font-semibold text-zinc-900' : 'text-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-zinc-500" />
                  <span>All Networks (Global Mesh)</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">{networks.length}</span>
              </button>
              {networks.map((net) => (
                <button
                  key={net.id}
                  onClick={() => {
                    setSelectedNetworkId(net.id);
                    setIsNetworkDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-zinc-50 transition-colors ${
                    selectedNetworkId === net.id ? 'bg-zinc-100/80 font-semibold text-zinc-900' : 'text-zinc-700'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="truncate">{net.name}</span>
                    <span className="text-[10px] font-mono text-zinc-400">{net.network_id_code}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] font-mono text-zinc-500">{net.node_count} nodes</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Mesh Status, Role Selector, Quick Action, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Drizzle ORM Status Pill */}
        <div 
          title="Drizzle ORM Type-Safe Postgres Engine"
          className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-zinc-200 bg-zinc-50 text-[10px] font-mono text-zinc-600"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Drizzle ORM Engine</span>
        </div>

        {/* Global Mesh Live Pulse */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200/60 text-[11px] font-medium text-emerald-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>{stats.activeNodesCount} Nodes Online</span>
        </div>

        {/* Quick Action: Add Node / Storage */}
        <button
          onClick={() => openAddNodeModal('customer')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Node</span>
        </button>

        {/* Role Switcher (Owner, Admin, Member, Viewer) */}
        <div className="relative">
          <button
            onClick={() => {
              setIsRoleDropdownOpen(!isRoleDropdownOpen);
              setIsNetworkDropdownOpen(false);
              setIsNotificationsOpen(false);
              setIsUserMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border border-zinc-200 hover:border-zinc-300 text-xs text-zinc-700 bg-white cursor-pointer"
            title="Change current view role to test role-based permissions"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
            <span className="capitalize font-medium text-[11px]">{currentUserRole}</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-zinc-200 rounded-lg shadow-xl py-1 z-50 text-xs animate-in fade-in-50 zoom-in-95">
              <div className="px-3 py-1.5 border-b border-zinc-100 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Switch Perspective
              </div>
              {(['owner', 'admin', 'member', 'viewer'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setCurrentUserRole(role);
                    setIsRoleDropdownOpen(false);
                    addToast({ type: 'info', title: `Role switched to ${role}` });
                  }}
                  className={`w-full text-left px-3 py-1.5 capitalize hover:bg-zinc-50 flex items-center justify-between ${
                    currentUserRole === role ? 'font-semibold text-zinc-950 bg-zinc-100/60' : 'text-zinc-600'
                  }`}
                >
                  <span>{role}</span>
                  {currentUserRole === role && <Check className="w-3 h-3 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsNetworkDropdownOpen(false);
              setIsRoleDropdownOpen(false);
              setIsUserMenuOpen(false);
            }}
            className="p-1.5 rounded-md border border-zinc-200 hover:border-zinc-300 text-zinc-600 hover:text-zinc-900 bg-white relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-1.5 w-80 bg-white border border-zinc-200 rounded-lg shadow-2xl py-2 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="px-3 py-1.5 border-b border-zinc-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-900">System Activity</span>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Live</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-zinc-100">
                {auditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="p-3 hover:bg-zinc-50 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-zinc-400">{log.created_at}</span>
                    </div>
                    <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Menu */}
        <div className="relative pl-1 border-l border-zinc-200">
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotificationsOpen(false);
              setIsNetworkDropdownOpen(false);
              setIsRoleDropdownOpen(false);
            }}
            className="w-7 h-7 rounded-full bg-zinc-800 text-white font-medium text-xs flex items-center justify-center border border-zinc-700 hover:border-zinc-500 transition-colors cursor-pointer"
            title={userName}
          >
            {userInitials}
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-56 bg-white border border-zinc-200 rounded-lg shadow-2xl py-2 z-50 animate-in fade-in-50 zoom-in-95 text-xs">
              <div className="px-3 py-2 border-b border-zinc-100">
                <p className="font-semibold text-zinc-900 truncate">{userName}</p>
                <p className="font-mono text-[10px] text-zinc-400 truncate mt-0.5">{userEmail}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] text-zinc-500 capitalize">{currentUserRole} Access</span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/login"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Switch Account / Sign In</span>
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-zinc-700 hover:bg-zinc-50 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Register New Org</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-zinc-100">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
