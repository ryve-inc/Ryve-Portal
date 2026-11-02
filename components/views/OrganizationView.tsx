'use client';

import React, { useState } from 'react';
import { useRyve } from '@/lib/store';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Trash2, 
  Copy, 
  Check, 
  Mail, 
  CheckCircle2, 
  Building, 
  X,
  Lock
} from 'lucide-react';
import { copyToClipboard } from '@/lib/format';
import { UserRole } from '@/types/ryve';

export function OrganizationView() {
  const { 
    organization, 
    updateOrganization, 
    members, 
    addMember, 
    removeMember, 
    updateMemberRole,
    currentUserRole,
    addToast 
  } = useRyve();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('member');
  const [copiedOrgId, setCopiedOrgId] = useState(false);

  const canManageMembers = currentUserRole === 'owner' || currentUserRole === 'admin';

  const handleCopyOrg = () => {
    copyToClipboard('RYV-ORG-98241');
    setCopiedOrgId(true);
    addToast({ type: 'success', title: 'Organization ID copied', description: 'RYV-ORG-98241' });
    setTimeout(() => setCopiedOrgId(false), 2000);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    addMember(inviteName, inviteEmail, inviteRole);
    setInviteName('');
    setInviteEmail('');
    setIsInviteModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-1 border-b border-zinc-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
            <span>Organization & Access Control</span>
            <span className="text-xs font-mono font-normal bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded border border-zinc-200">
              {members.length} Members
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Role-based access permissions, team member directory, and cryptographic tenant identity.
          </p>
        </div>

        {canManageMembers && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-md text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Member</span>
          </button>
        )}
      </div>

      {/* Organization Details Card */}
      <div className="p-5 bg-white border border-zinc-200/80 rounded-xl shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
            Organization Name
          </span>
          <span className="text-base font-bold text-zinc-900">{organization.name}</span>
          <span className="text-xs text-zinc-500">Slug: {organization.slug}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
            Organization ID (Cryptographic Root)
          </span>
          <div
            onClick={handleCopyOrg}
            className="flex items-center gap-2 font-mono text-xs font-semibold text-zinc-800 hover:text-emerald-700 cursor-pointer group"
          >
            <span>RYV-ORG-98241</span>
            {copiedOrgId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-zinc-400" />}
          </div>
          <span className="text-[11px] text-zinc-500">Root identifier for all sub-networks</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
            Organization Type
          </span>
          <span className="text-xs font-semibold text-zinc-900 uppercase">
            {organization.org_type} (Higher Education & Research)
          </span>
          <span className="text-[11px] text-emerald-700 font-mono">Pro Managed Tier</span>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-200/80 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-zinc-950 flex items-center gap-2">
            <Users className="w-4 h-4 text-zinc-500" />
            <span>Organization Members & Roles</span>
          </h3>
          <span className="text-xs text-zinc-500">
            Current perspective: <strong className="font-semibold capitalize text-zinc-800">{currentUserRole}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role Permission</th>
                <th className="py-3 px-4">2FA Security</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 text-white font-bold text-[10px] flex items-center justify-center">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-zinc-900">{member.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-zinc-600">{member.email}</td>

                  <td className="py-3 px-4">
                    {canManageMembers ? (
                      <select
                        value={member.role}
                        onChange={(e) => updateMemberRole(member.id, e.target.value as UserRole)}
                        className="px-2 py-1 rounded text-xs border border-zinc-200 bg-white font-medium capitalize text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                      >
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-800 capitalize">
                        {member.role}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {member.mfa_enabled ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Enforced
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-400">Disabled</span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono text-zinc-500">
                    {new Date(member.joined_at).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {canManageMembers && member.role !== 'owner' && (
                      <button
                        onClick={() => removeMember(member.id)}
                        className="p-1 text-zinc-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Matrix */}
      <div className="p-5 bg-zinc-50 border border-zinc-200/80 rounded-xl flex flex-col gap-3 text-xs">
        <h4 className="font-semibold text-zinc-900">Role Privilege Hierarchy</h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white rounded-lg border border-zinc-200/80 flex flex-col gap-1">
            <span className="font-bold text-zinc-950 uppercase font-mono text-[11px]">Owner</span>
            <p className="text-zinc-600 text-[11px]">
              Full control over organization identity, networks, billing, invoices, member roles, and node allocation.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-zinc-200/80 flex flex-col gap-1">
            <span className="font-bold text-zinc-950 uppercase font-mono text-[11px]">Admin</span>
            <p className="text-zinc-600 text-[11px]">
              Can create and delete networks, enroll hardware nodes, request storage, and manage API keys.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-zinc-200/80 flex flex-col gap-1">
            <span className="font-bold text-zinc-950 uppercase font-mono text-[11px]">Member</span>
            <p className="text-zinc-600 text-[11px]">
              Upload, download, share, and inspect files across authorized networks. View telemetry.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-zinc-200/80 flex flex-col gap-1">
            <span className="font-bold text-zinc-950 uppercase font-mono text-[11px]">Viewer</span>
            <p className="text-zinc-600 text-[11px]">
              Read-only inspection of networks, node health, storage usage, and audit logs.
            </p>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-2xl p-6 flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h3 className="font-semibold text-base text-zinc-950">Invite Organization Member</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-zinc-800">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Thomas Kurian"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="px-3 py-2 border border-zinc-200 rounded-md bg-white text-zinc-800"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-zinc-800">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. kurian@sjcet.ac.in"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="px-3 py-2 border border-zinc-200 rounded-md bg-white text-zinc-800"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-zinc-800">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="px-3 py-2 border border-zinc-200 rounded-md bg-white text-zinc-800"
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-3 py-1.5 border border-zinc-200 rounded text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded font-medium"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
