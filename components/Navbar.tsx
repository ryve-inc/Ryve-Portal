'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRyve } from '@/lib/store';
import { useSession, signOut } from '@/lib/auth-client';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Copy, 
  Check, 
  LogOut, 
  User, 
  Building2,
  Server
} from 'lucide-react';
import { copyToClipboard } from '@/lib/format';

export function Navbar() {
  const { data: session } = useSession();
  const { organization, activeTab, setActiveTab, nodes, addToast } = useRyve();

  const [copiedOrgId, setCopiedOrgId] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const orgId = organization?.id || '';

  const handleCopyOrgId = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!orgId) return;
    copyToClipboard(orgId);
    setCopiedOrgId(true);
    addToast({
      type: 'success',
      title: 'Organization ID Copied',
      description: orgId,
    });
    setTimeout(() => setCopiedOrgId(false), 2000);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
      window.location.href = '/login';
    } catch {
      setIsUserMenuOpen(false);
    }
  };

  const userName = session?.user?.name || 'Administrator';
  const userEmail = session?.user?.email || '';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/95 backdrop-blur-md border-b border-zinc-200/90 px-4 sm:px-8 flex items-center justify-between transition-colors">
      {/* Left: Brand Logo & Navigation Tabs */}
      <div className="flex items-center gap-8">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold text-xs tracking-widest shadow-xs">
            RY
          </div>
          <span className="font-bold text-sm tracking-tight text-zinc-950 flex items-center gap-1.5">
            <span>Ryve</span>
            <span className="text-[10px] font-mono text-zinc-500 font-normal">Cloud</span>
          </span>
        </div>

        {/* Navbar Section Tabs: Dashboard & Get Nodes */}
        {session && (
          <nav className="flex items-center gap-1 bg-zinc-100/90 p-1 rounded-xl border border-zinc-200/60">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-zinc-500" />
              <span>Dashboard</span>
              {nodes.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-zinc-200 text-zinc-800">
                  {nodes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('get-nodes')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'get-nodes'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Get Nodes</span>
            </button>
          </nav>
        )}
      </div>

      {/* Right: Organization ID & User Controls */}
      <div className="flex items-center gap-3">
        {session && (
          /* Organization ID display on the header with copy button */
          organization ? (
            <div 
              onClick={handleCopyOrgId}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 rounded-xl border border-zinc-200/90 cursor-pointer transition-colors group select-none"
              title="Click to copy Organization ID"
            >
              <Building2 className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700" />
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Org ID:
                </span>
                <span className="font-mono text-zinc-900 font-semibold text-[11px]">
                  {orgId.length > 12
                    ? `${orgId.substring(0, 8)}...${orgId.substring(orgId.length - 4)}`
                    : orgId}
                </span>
              </div>
              <button
                type="button"
                className="ml-1 p-0.5 text-zinc-400 group-hover:text-zinc-900 transition-colors cursor-pointer"
              >
                {copiedOrgId ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ) : (
            <div className="px-3 py-1 bg-zinc-50 rounded-xl border border-zinc-200/80 text-[11px] font-mono text-zinc-400 animate-pulse">
              Connecting Org...
            </div>
          )
        )}

        {/* User Account / Sign In */}
        {session ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-8 h-8 rounded-full bg-zinc-950 text-white font-medium text-xs flex items-center justify-center border border-zinc-800 hover:ring-2 hover:ring-zinc-300 transition-all cursor-pointer"
              title={userName}
            >
              {userInitials}
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 text-xs">
                <div className="px-3.5 py-2.5 border-b border-zinc-100">
                  <p className="font-semibold text-zinc-900 truncate">{userName}</p>
                  <p className="font-mono text-[10px] text-zinc-400 truncate mt-0.5">{userEmail}</p>
                </div>

                <div className="pt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-3.5 py-1.5 text-xs font-semibold bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl shadow-xs transition-colors"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
