'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRyve } from '@/context/store';
import { useSession, signOut } from '@/lib/auth-client';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Copy, 
  Check, 
  LogOut, 
  Building2 
} from 'lucide-react';
import { copyToClipboard } from '@/lib/format';

export function Navbar() {
  const { data: session } = useSession();
  const { 
    organization, 
    activeTab, 
    setActiveTab, 
    nodes, 
    addToast 
  } = useRyve();

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
    <header className="sticky top-0 z-40 w-full h-16 glass-nav px-4 sm:px-8 flex items-center justify-between transition-colors font-sans border-b border-[#222222]">
      {/* Left: Brand Logo & Navigation Tabs */}
      <div className="flex items-center gap-6 sm:gap-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-md bg-white text-black flex items-center justify-center font-extrabold text-lg shadow-sm transition-transform group-hover:rotate-12">
            R.
          </div>
          <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
            <span>Ryve</span>
            <span className="text-[10px] font-mono font-semibold text-[#FF6B50] px-1.5 py-0.5 rounded bg-[#FF6B50]/10 border border-[#FF6B50]/20">
              MESH
            </span>
          </span>
        </Link>

        {/* Navbar Section Tabs: Dashboard & Get Nodes */}
        {session && (
          <nav className="flex items-center gap-1 bg-[#111111] p-1 rounded-xl border border-[#222222]">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#FF6B50] text-black shadow-xs font-bold'
                  : 'text-[#888888] hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
              {nodes.length > 0 && (
                <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === 'dashboard' ? 'bg-black text-white' : 'bg-[#222222] text-[#888888]'
                }`}>
                  {nodes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('get-nodes')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'get-nodes'
                  ? 'bg-[#FF6B50] text-black shadow-xs font-bold'
                  : 'text-[#888888] hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Get Nodes</span>
            </button>
          </nav>
        )}
      </div>

      {/* Right: Organization ID & User Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {session && (
          <>
            {/* Organization ID display on the header with copy button */}
            {organization ? (
              <div 
                onClick={handleCopyOrgId}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] hover:bg-[#161616] rounded-xl border border-[#222222] hover:border-[#333333] cursor-pointer transition-colors group select-none"
                title="Click to copy Organization ID"
              >
                <Building2 className="w-3.5 h-3.5 text-[#666666] group-hover:text-[#FF6B50] transition-colors" />
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-[10px] font-semibold text-[#666666] uppercase tracking-wider">
                    Org:
                  </span>
                  <span className="font-mono text-white font-semibold text-[11px]">
                    {orgId.length > 12
                      ? `${orgId.substring(0, 8)}...${orgId.substring(orgId.length - 4)}`
                      : orgId}
                  </span>
                </div>
                <button
                  type="button"
                  className="ml-1 p-0.5 text-[#666666] group-hover:text-white transition-colors cursor-pointer"
                >
                  {copiedOrgId ? (
                    <Check className="w-3.5 h-3.5 text-[#FF6B50]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ) : (
              <div className="px-3 py-1.5 bg-[#111111] rounded-xl border border-[#222222] text-[11px] font-mono text-[#666666] animate-pulse">
                Connecting Org...
              </div>
            )}
          </>
        )}

        {/* User Account / Sign In */}
        {session ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-8 h-8 rounded-xl bg-[#161616] text-[#FF6B50] font-bold text-xs flex items-center justify-center border border-[#333333] hover:border-[#FF6B50] transition-all cursor-pointer"
              title={userName}
            >
              {userInitials}
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#111111] border border-[#282828] rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 text-xs text-[#ebebeb]">
                <div className="px-3.5 py-2.5 border-b border-[#222222]">
                  <p className="font-semibold text-white truncate">{userName}</p>
                  <p className="font-mono text-[10px] text-[#777777] truncate mt-0.5">{userEmail}</p>
                </div>

                <div className="pt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-[#FF6B50] hover:bg-[#1a1a1a] transition-colors cursor-pointer font-medium"
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
              className="px-3 py-1.5 text-xs font-semibold text-[#888888] hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#FF6B50] hover:bg-[#E55A40] text-black rounded-xl shadow-xs transition-colors"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
