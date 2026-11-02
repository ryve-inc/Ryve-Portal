'use client';

import React, { useState } from 'react';
import { useRyve } from '@/lib/store';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  Trash2, 
  Plus, 
  Copy, 
  Check, 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  X,
  Smartphone,
  Eye,
  EyeOff
} from 'lucide-react';
import { copyToClipboard } from '@/lib/format';
import { ApiKey } from '@/types/ryve';

export function SecurityView() {
  const { 
    apiKeys, 
    generateApiKey, 
    revokeApiKey, 
    auditLogs, 
    addToast 
  } = useRyve();

  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(true);

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const { secret } = generateApiKey(newKeyName, ['nodes:read', 'files:read', 'files:write']);
    setGeneratedSecret(secret);
    setNewKeyName('');
  };

  const handleCopySecret = () => {
    if (!generatedSecret) return;
    copyToClipboard(generatedSecret);
    setCopiedSecret(true);
    addToast({ type: 'success', title: 'API Secret copied to clipboard' });
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const filteredLogs = auditLogs.filter((log) =>
    log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.user_name.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-1 border-b border-zinc-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
            <span>Security & Audit Logs</span>
            <span className="text-xs font-mono font-normal bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
              Zero-Knowledge Mesh
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Cryptographic access keys, mutual TLS certificates, and immutable tenant audit trail.
          </p>
        </div>

        <button
          onClick={() => {
            setGeneratedSecret(null);
            setIsKeyModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-md text-xs font-medium shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate API Key</span>
        </button>
      </div>

      {/* Security Posture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-zinc-200/80 rounded-xl shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-100 rounded-lg text-zinc-800">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-900 block">Two-Factor Authentication</span>
              <span className="text-[11px] text-zinc-500">Hardware FIDO2 / Authenticator</span>
            </div>
          </div>
          <button
            onClick={() => {
              setMfaEnabled(!mfaEnabled);
              addToast({ type: 'info', title: `2FA ${!mfaEnabled ? 'Enabled' : 'Disabled'}` });
            }}
            className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
              mfaEnabled ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-zinc-100 text-zinc-600'
            }`}
          >
            {mfaEnabled ? 'Enforced' : 'Optional'}
          </button>
        </div>

        <div className="p-4 bg-white border border-zinc-200/80 rounded-xl shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-100 rounded-lg text-zinc-800">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-900 block">Mutual TLS Peer Handshake</span>
              <span className="text-[11px] text-zinc-500">mTLS Ed25519 node certs</span>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
        </div>

        <div className="p-4 bg-white border border-zinc-200/80 rounded-xl shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-100 rounded-lg text-zinc-800">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-900 block">Data-At-Rest Encryption</span>
              <span className="text-[11px] text-zinc-500">AES-256-GCM Zero-Knowledge</span>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">256-bit</span>
        </div>
      </div>

      {/* API Keys Management */}
      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-200/80 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-zinc-950 flex items-center gap-2">
              <Key className="w-4 h-4 text-zinc-500" />
              <span>Programmatic API Access Keys</span>
            </h3>
            <p className="text-xs text-zinc-500">
              Used by server daemons and CI/CD pipelines to manage storage networks and upload files.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500">{apiKeys.length} Keys Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Key Name</th>
                <th className="py-3 px-4">Token Prefix</th>
                <th className="py-3 px-4">Scope Permissions</th>
                <th className="py-3 px-4">Last Used</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-zinc-900">{key.name}</td>
                  <td className="py-3 px-4 font-mono text-zinc-500">{key.key_prefix}...</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1 flex-wrap">
                      {key.permissions.map((p) => (
                        <span key={p} className="text-[9px] font-mono bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-500">{key.last_used_at}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => revokeApiKey(key.id)}
                      className="p-1 text-zinc-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                      title="Revoke API key"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Audit Logs Table */}
      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-sm text-zinc-950 flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-500" />
              <span>Immutable Organization Audit Trail</span>
            </h3>
            <p className="text-xs text-zinc-500">
              Every node enrollment, file distribution, role update, and billing action is permanently logged.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search audit events..."
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-zinc-200 rounded-md bg-zinc-50 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-zinc-900">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800 text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-zinc-700 font-sans font-medium">{log.user_name}</td>
                  <td className="py-2.5 px-4 text-zinc-500">{log.target_id}</td>
                  <td className="py-2.5 px-4 text-zinc-700 font-sans max-w-sm truncate">{log.details}</td>
                  <td className="py-2.5 px-4 text-zinc-400">{log.ip_address}</td>
                  <td className="py-2.5 px-4 text-right text-zinc-400">{log.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate API Key Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-2xl p-6 flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h3 className="font-semibold text-base text-zinc-950">
                {generatedSecret ? 'API Key Created' : 'Create New API Key'}
              </h3>
              <button onClick={() => setIsKeyModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!generatedSecret ? (
              <form onSubmit={handleCreateKey} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="font-medium text-zinc-800">Key Identifier / Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lab Telemetry Exporter"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="px-3 py-2 border border-zinc-200 rounded-md bg-white text-zinc-800"
                  />
                </div>

                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80 text-[11px] text-zinc-600">
                  This key will be granted <code>nodes:read</code>, <code>files:read</code>, and <code>files:write</code> permissions.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsKeyModalOpen(false)}
                    className="px-3 py-1.5 border border-zinc-200 rounded text-zinc-700 hover:bg-zinc-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded font-medium"
                  >
                    Generate Key
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs">
                  <strong>Important:</strong> Copy your secret key now. You won't be able to view it again.
                </div>

                <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-xs text-emerald-400 break-all select-all flex items-center justify-between gap-2">
                  <span>{generatedSecret}</span>
                  <button
                    onClick={handleCopySecret}
                    className="shrink-0 p-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded"
                  >
                    {copiedSecret ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex justify-end pt-2 border-t border-zinc-100">
                  <button
                    onClick={() => setIsKeyModalOpen(false)}
                    className="px-4 py-2 bg-zinc-950 text-white rounded font-medium text-xs hover:bg-zinc-800"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
