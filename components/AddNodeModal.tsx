'use client';

import React, { useState } from 'react';
import { useRyve } from '@/lib/store';
import { 
  X, 
  Server, 
  HardDrive, 
  Copy, 
  Check, 
  Terminal, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Layers, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { copyToClipboard } from '@/lib/format';

export function AddNodeModal() {
  const { 
    isAddNodeModalOpen, 
    closeAddNodeModal, 
    addNodeModalTab, 
    setAddNodeModalTab,
    networks,
    selectedNetworkId,
    registerCustomerNode,
    requestRyveStorageNode,
    addToast
  } = useRyve();

  // Tab 1 state: Customer Node
  const [customerNetId, setCustomerNetId] = useState<string>(
    selectedNetworkId !== 'all' ? selectedNetworkId : networks[0]?.id || ''
  );
  const [nodeName, setNodeName] = useState('Research Lab Server 02');
  const [nodeCapacityTb, setNodeCapacityTb] = useState(2);
  const [nodeOs, setNodeOs] = useState('Ubuntu Server 24.04 (x86_64)');
  const [enrollmentCode, setEnrollmentCode] = useState('RYV-ENR-7842-WK9');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [isJoiningCustomer, setIsJoiningCustomer] = useState(false);

  // Tab 2 state: Ryve Provided Node
  const [ryveNetId, setRyveNetId] = useState<string>(
    selectedNetworkId !== 'all' ? selectedNetworkId : networks[0]?.id || ''
  );
  const [ryveCapacityTb, setRyveCapacityTb] = useState(2);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionSuccess, setProvisionSuccess] = useState(false);

  if (!isAddNodeModalOpen) return null;

  const targetNetForCustomer = networks.find((n) => n.id === customerNetId) || networks[0];
  const targetNetForRyve = networks.find((n) => n.id === ryveNetId) || networks[0];

  const curlCommand = `curl -sSL https://ryve.io/install.sh | bash && ryve-daemon join --enroll ${enrollmentCode}`;

  const handleCopyCode = () => {
    copyToClipboard(enrollmentCode);
    setCopiedCode(true);
    addToast({ type: 'success', title: 'Enrollment code copied', description: enrollmentCode });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyCurl = () => {
    copyToClipboard(curlCommand);
    setCopiedCurl(true);
    addToast({ type: 'success', title: 'CLI command copied to clipboard' });
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleSimulateCustomerJoin = () => {
    setIsJoiningCustomer(true);
    setTimeout(() => {
      registerCustomerNode(customerNetId, nodeName, nodeCapacityTb, nodeOs);
      setIsJoiningCustomer(false);
      closeAddNodeModal();
    }, 800);
  };

  const handleProvisionRyveNode = async () => {
    setIsProvisioning(true);
    setTimeout(async () => {
      await requestRyveStorageNode(ryveNetId, ryveCapacityTb, billingCycle);
      setIsProvisioning(false);
      setProvisionSuccess(true);
      setTimeout(() => {
        setProvisionSuccess(false);
        closeAddNodeModal();
      }, 1200);
    }, 900);
  };

  const pricePerTb = billingCycle === 'annual' ? 3.40 : 4.00;
  const totalPrice = (ryveCapacityTb * pricePerTb).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border border-zinc-200 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50/50">
          <div>
            <h2 className="text-base font-semibold text-zinc-950">Add Storage Node to Mesh</h2>
            <p className="text-xs text-zinc-500">
              Register customer-hosted hardware for free or provision managed Ryve cloud storage nodes.
            </p>
          </div>
          <button
            onClick={closeAddNodeModal}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-200 bg-zinc-100/50 px-6 pt-2">
          <button
            onClick={() => setAddNodeModalTab('customer')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-medium border-b-2 transition-all cursor-pointer ${
              addNodeModalTab === 'customer'
                ? 'border-emerald-600 text-emerald-800 font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Customer-Owned Node (Free)</span>
          </button>
          <button
            onClick={() => setAddNodeModalTab('ryve')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-medium border-b-2 transition-all cursor-pointer ${
              addNodeModalTab === 'ryve'
                ? 'border-emerald-600 text-emerald-800 font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Ryve-Provided Storage (Managed)</span>
          </button>
        </div>

        {/* Tab 1: Customer-Owned Node Flow */}
        {addNodeModalTab === 'customer' && (
          <div className="p-6 flex flex-col gap-4 text-xs">
            {/* Step 1: Network Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="font-medium text-zinc-800">Target Network</label>
              <select
                value={customerNetId}
                onChange={(e) => setCustomerNetId(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md bg-white text-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                {networks.map((net) => (
                  <option key={net.id} value={net.id}>
                    {net.name} ({net.network_id_code}) - {net.redundancy_policy}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Node Metadata */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-zinc-800">Device / Node Name</label>
                <input
                  type="text"
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  placeholder="e.g. Rack Server 02"
                  className="px-3 py-2 border border-zinc-200 rounded-md bg-white text-zinc-800"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-zinc-800">Storage to Allocate (TB)</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  max="100"
                  value={nodeCapacityTb}
                  onChange={(e) => setNodeCapacityTb(parseFloat(e.target.value) || 1)}
                  className="px-3 py-2 border border-zinc-200 rounded-md bg-white text-zinc-800"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-medium text-zinc-800">Device Platform / OS</label>
              <select
                value={nodeOs}
                onChange={(e) => setNodeOs(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md bg-white text-zinc-800"
              >
                <option value="Ubuntu Server 24.04 (x86_64)">Ubuntu Server 24.04 LTS (x86_64)</option>
                <option value="Debian 12 Bookworm (x86_64)">Debian 12 Bookworm (x86_64)</option>
                <option value="macOS Sequoia 15.2 (arm64)">macOS (Apple Silicon arm64)</option>
                <option value="Raspberry Pi OS (aarch64)">Raspberry Pi 5 / ARM64</option>
                <option value="Synology DSM / TrueNAS (BSD/Linux)">Synology DSM / TrueNAS Core</option>
                <option value="Windows Server 2025">Windows Server 2022/2025</option>
              </select>
            </div>

            {/* Enrollment Code Display */}
            <div className="p-3.5 bg-zinc-900 text-zinc-100 rounded-lg border border-zinc-800 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-400">ENROLLMENT CODE</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Valid for 7 days
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 bg-zinc-950 p-2.5 rounded border border-zinc-800">
                <span className="font-mono text-sm tracking-widest text-emerald-400 font-bold">
                  {enrollmentCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white px-2 py-1 bg-zinc-800 rounded transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* 1-Line CLI Command */}
              <div className="flex items-center justify-between gap-2 mt-1 bg-zinc-950/80 p-2 rounded text-[11px] font-mono text-zinc-300">
                <div className="flex items-center gap-1.5 truncate">
                  <Terminal className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">{curlCommand}</span>
                </div>
                <button
                  onClick={handleCopyCurl}
                  className="text-zinc-400 hover:text-white p-1 rounded shrink-0 cursor-pointer"
                  title="Copy curl command"
                >
                  {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-zinc-500">
                Customer hardware is <strong className="text-zinc-700">100% free</strong> forever.
              </div>
              <button
                onClick={handleSimulateCustomerJoin}
                disabled={isJoiningCustomer}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white rounded-md font-medium transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isJoiningCustomer ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    <span>Handshaking Daemon...</span>
                  </>
                ) : (
                  <>
                    <span>Simulate Node Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Ryve-Provided Paid Storage Flow */}
        {addNodeModalTab === 'ryve' && (
          <div className="p-6 flex flex-col gap-4 text-xs">
            {/* Target Network */}
            <div className="flex flex-col gap-1.5">
              <label className="font-medium text-zinc-800">Target Network to Expand</label>
              <select
                value={ryveNetId}
                onChange={(e) => setRyveNetId(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md bg-white text-zinc-800"
              >
                {networks.map((net) => (
                  <option key={net.id} value={net.id}>
                    {net.name} ({net.network_id_code})
                  </option>
                ))}
              </select>
            </div>

            {/* Capacity Presets */}
            <div className="flex flex-col gap-1.5">
              <label className="font-medium text-zinc-800">Select Additional Capacity</label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 5, 10, 25].map((tb) => (
                  <button
                    key={tb}
                    type="button"
                    onClick={() => setRyveCapacityTb(tb)}
                    className={`py-2 px-1 rounded-md border text-center transition-all cursor-pointer ${
                      ryveCapacityTb === tb
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-white'
                    }`}
                  >
                    <div className="text-sm font-bold">{tb} TB</div>
                    <div className="text-[10px] text-zinc-500 font-mono">${tb * 4}/mo</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Billing Cycle */}
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 bg-zinc-50">
              <span className="font-medium text-zinc-700">Billing Cycle</span>
              <div className="flex items-center gap-1 p-0.5 bg-zinc-200/60 rounded-md">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                    billingCycle === 'monthly' ? 'bg-white font-semibold text-zinc-900 shadow-xs' : 'text-zinc-600'
                  }`}
                >
                  Monthly ($4/TB)
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                    billingCycle === 'annual' ? 'bg-white font-semibold text-zinc-900 shadow-xs' : 'text-zinc-600'
                  }`}
                >
                  Annual (Save 15%)
                </button>
              </div>
            </div>

            {/* SLA & Feature Highlights */}
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-zinc-800 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Ryve Enterprise Managed Node Guarantee</span>
              </div>
              <ul className="grid grid-cols-2 gap-1.5 text-[11px] text-zinc-600">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-600" /> Zero Egress Fees ($0/GB)
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-600" /> NVMe High-IOPS Datacenter
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-600" /> Reed-Solomon 8+4 Auto-healing
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-600" /> 99.99% Uptime SLA
                </li>
              </ul>
            </div>

            {/* Price Total & Submit */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Total Investment</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-zinc-950">${totalPrice}</span>
                  <span className="text-xs text-zinc-500">/ month</span>
                </div>
              </div>

              <button
                onClick={handleProvisionRyveNode}
                disabled={isProvisioning || provisionSuccess}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isProvisioning ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    <span>Provisioning Node...</span>
                  </>
                ) : provisionSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Node Active!</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Authorize & Provision</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
