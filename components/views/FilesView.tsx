'use client';

import React, { useState } from 'react';
import { useRyve } from '@/lib/store';
import { 
  Files as FilesIcon, 
  Upload, 
  Download, 
  Trash2, 
  Share2, 
  Lock, 
  Globe, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Search, 
  ShieldCheck, 
  Server, 
  HardDrive, 
  Copy, 
  Check, 
  FileText
} from 'lucide-react';
import { formatBytes, copyToClipboard } from '@/lib/format';
import { FileItem, FileChunk } from '@/types/ryve';

export function FilesView() {
  const { 
    files, 
    networks, 
    uploadFile, 
    deleteFile, 
    toggleFilePublic, 
    getFileChunks, 
    addToast 
  } = useRyve();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileForChunks, setSelectedFileForChunks] = useState<FileItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [shareModalFile, setShareModalFile] = useState<FileItem | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Upload Form State
  const [uploadName, setUploadName] = useState('');
  const [uploadSizeMb, setUploadSizeMb] = useState(250);
  const [uploadNetworkId, setUploadNetworkId] = useState(networks[0]?.id || '');
  const [isUploading, setIsUploading] = useState(false);

  // Filtered files
  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName.trim()) return;

    setIsUploading(true);
    setTimeout(() => {
      uploadFile({
        name: uploadName,
        sizeBytes: uploadSizeMb * 1024 * 1024,
        mimeType: uploadName.endsWith('.tar') ? 'application/x-tar' : 'application/octet-stream',
        networkId: uploadNetworkId || networks[0]?.id,
      });
      setIsUploading(false);
      setIsUploadModalOpen(false);
      setUploadName('');
    }, 700);
  };

  const handleDownload = (file: FileItem) => {
    addToast({
      type: 'info',
      title: 'Reconstructing file from peer shards',
      description: `Gathering 8 data chunks across network ${file.network_name}...`,
    });
    setTimeout(() => {
      addToast({
        type: 'success',
        title: 'File verified & downloaded',
        description: `Decrypted ${file.name} (${formatBytes(file.size_bytes)}) via AES-256-GCM`,
      });
    }, 1000);
  };

  const handleCopyShareLink = (file: FileItem) => {
    const url = `https://ryve.mesh/share/${file.id}?key=${file.hash.substring(7, 19)}`;
    copyToClipboard(url);
    setCopiedShareLink(true);
    addToast({ type: 'success', title: 'Share link copied', description: url });
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-1 border-b border-zinc-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
            <span>Encrypted File Mesh</span>
            <span className="text-xs font-mono font-normal bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded border border-zinc-200">
              {files.length} Objects
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Zero-knowledge encrypted files stored across self-hosted cluster nodes and Ryve parity blocks.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-md text-xs font-medium shadow-xs transition-colors cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Filter files by name or directory path..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
        />
      </div>

      {/* Files Table */}
      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">File Name & Path</th>
                <th className="py-3 px-4">Network Mesh</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Erasure Shards</th>
                <th className="py-3 px-4">Access Control</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    No files found in the mesh. Click Upload to distribute a file.
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-zinc-50/70 transition-colors group">
                    {/* Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-zinc-900 truncate max-w-xs">
                            {file.name}
                          </span>
                          <span className="font-mono text-[10px] text-zinc-400 truncate">
                            {file.path}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Network */}
                    <td className="py-3 px-4 text-zinc-600 font-medium">
                      {file.network_name}
                    </td>

                    {/* Size */}
                    <td className="py-3 px-4 font-mono text-zinc-800">
                      {formatBytes(file.size_bytes)}
                    </td>

                    {/* Shards */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedFileForChunks(file)}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 transition-colors cursor-pointer"
                        title="Click to inspect Reed-Solomon distributed chunks"
                      >
                        <Layers className="w-3 h-3 text-emerald-600" />
                        <span>12 Shards (8+4)</span>
                      </button>
                    </td>

                    {/* Access */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleFilePublic(file.id)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                          file.is_public
                            ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                            : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                        }`}
                      >
                        {file.is_public ? (
                          <>
                            <Globe className="w-2.5 h-2.5 text-cyan-600" />
                            <span>Public Link</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-2.5 h-2.5 text-zinc-500" />
                            <span>Mesh Only</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Owner */}
                    <td className="py-3 px-4 text-zinc-600">
                      {file.uploaded_by}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDownload(file)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors cursor-pointer"
                          title="Download & reconstruct"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setShareModalFile(file)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors cursor-pointer"
                          title="Share link"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteFile(file.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INTERACTIVE DISTRIBUTED CHUNKING INSPECTOR MODAL */}
      {selectedFileForChunks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-zinc-200 bg-zinc-50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base text-zinc-950 truncate max-w-md">
                    {selectedFileForChunks.name}
                  </h3>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                    AES-256-GCM
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5 font-mono">
                  Reed-Solomon (8 Data + 4 Parity) Distributed Shard Map
                </p>
              </div>
              <button
                onClick={() => setSelectedFileForChunks(null)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs max-h-[75vh] overflow-y-auto">
              {/* Architecture Summary */}
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80 flex items-center justify-between">
                <div>
                  <span className="text-zinc-600 block">Total File Size: <strong className="text-zinc-900">{formatBytes(selectedFileForChunks.size_bytes)}</strong></span>
                  <span className="text-zinc-500 text-[11px]">Chunk Size: {formatBytes(Math.ceil(selectedFileForChunks.size_bytes / 8))} per shard</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 font-semibold block">Fault Tolerant</span>
                  <span className="text-zinc-500 text-[11px]">Any 8 of 12 shards can reconstruct entire file</span>
                </div>
              </div>

              {/* Shards Grid */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                  Participating Peer Shards (8 Data + 4 Parity)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {getFileChunks(selectedFileForChunks).map((chunk) => (
                    <div
                      key={chunk.chunk_index}
                      className={`p-3 rounded-lg border transition-all flex flex-col gap-1.5 ${
                        chunk.is_parity
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-zinc-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-[10px] ${
                              chunk.is_parity
                                ? 'bg-emerald-600 text-white'
                                : 'bg-zinc-900 text-white'
                            }`}
                          >
                            {chunk.is_parity ? `P${chunk.chunk_index - 8}` : `D${chunk.chunk_index}`}
                          </span>
                          <span className="font-mono text-xs font-semibold text-zinc-900">
                            Shard #{chunk.chunk_index}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {chunk.chunk_hash}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-100">
                        <span className="text-zinc-600 truncate max-w-[170px]">
                          {chunk.node_name}
                        </span>
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-medium ${
                            chunk.status === 'verified'
                              ? 'text-emerald-700 bg-emerald-100'
                              : 'text-amber-700 bg-amber-100'
                          }`}
                        >
                          {chunk.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedFileForChunks(null)}
                  className="px-4 py-2 bg-zinc-900 text-white rounded-md font-medium text-xs hover:bg-zinc-800"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-2xl p-6 flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h3 className="font-semibold text-base text-zinc-950">Share File</h3>
              <button onClick={() => setShareModalFile(null)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-zinc-600">
              Generates a zero-knowledge peer-to-peer download URL for <strong>{shareModalFile.name}</strong>. The decryption key is embedded in the hash fragment and never touches any central server.
            </p>

            <div className="p-2.5 bg-zinc-100 rounded-lg border border-zinc-200 font-mono text-[11px] text-zinc-800 break-all select-all">
              https://ryve.mesh/share/{shareModalFile.id}?key={shareModalFile.hash.substring(7, 19)}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                onClick={() => setShareModalFile(null)}
                className="px-3 py-1.5 border border-zinc-200 rounded text-zinc-700 hover:bg-zinc-50"
              >
                Close
              </button>
              <button
                onClick={() => handleCopyShareLink(shareModalFile)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded font-medium"
              >
                {copiedShareLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedShareLink ? 'Copied' : 'Copy Share Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-2xl p-6 flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <h3 className="font-semibold text-base text-zinc-950">Upload & Encrypt to Mesh</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-zinc-800">Target Storage Network</label>
                <select
                  value={uploadNetworkId}
                  onChange={(e) => setUploadNetworkId(e.target.value)}
                  className="px-3 py-2 border border-zinc-200 rounded-md bg-white text-zinc-800"
                >
                  {networks.map((net) => (
                    <option key={net.id} value={net.id}>
                      {net.name} ({net.network_id_code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-zinc-800">File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. training_dataset_march2026.tar.zst"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="px-3 py-2 border border-zinc-200 rounded-md bg-white text-zinc-800"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-zinc-800">File Size (MB)</label>
                <input
                  type="number"
                  min="1"
                  max="100000"
                  value={uploadSizeMb}
                  onChange={(e) => setUploadSizeMb(parseInt(e.target.value) || 10)}
                  className="px-3 py-2 border border-zinc-200 rounded-md bg-white text-zinc-800"
                />
              </div>

              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80 text-[11px] text-zinc-600 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 font-medium text-zinc-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Automatic Erasure Chunking</span>
                </div>
                <span>Your file will be split into 8 data pieces and 4 mathematical parity pieces before being distributed to peers.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3 py-2 border border-zinc-200 rounded text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex items-center gap-1.5 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded font-medium disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                      <span>Chunking & Encrypting...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload & Distribute</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
