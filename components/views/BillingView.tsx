'use client';

import React, { useState } from 'react';
import { useRyve } from '@/lib/store';
import { 
  CreditCard, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  HardDrive, 
  ShieldCheck, 
  FileText,
  X
} from 'lucide-react';
import { formatBytes } from '@/lib/format';
import { Invoice } from '@/types/ryve';

export function BillingView() {
  const { stats, invoices, openAddNodeModal, addToast } = useRyve();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const monthlyCost = stats.monthlySpendUsd;
  const ryveTb = (stats.ryveProvidedBytes / 1000000000000).toFixed(1);

  const handleDownloadInvoice = (inv: Invoice) => {
    addToast({
      type: 'success',
      title: 'Invoice downloaded',
      description: `${inv.invoice_number} saved as PDF ($${inv.amount_usd.toFixed(2)})`,
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-1 border-b border-zinc-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
            <span>Billing & Usage Meter</span>
            <span className="text-xs font-mono font-normal bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded border border-zinc-200">
              ${monthlyCost}.00 / month
            </span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Transparent usage-based metering. Customer-hosted devices are $0. Ryve dedicated nodes are $4.00/TB/month.
          </p>
        </div>

        <button
          onClick={() => openAddNodeModal('ryve')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Adjust Capacity</span>
        </button>
      </div>

      {/* Plan Summary & Monthly Total Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Current Active Plan */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-xl shadow-xs flex flex-col justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold block">
              Active Subscription
            </span>
            <h3 className="text-lg font-bold text-zinc-950 mt-1">Ryve Hybrid Enterprise</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Unlimited customer devices + on-demand managed datacenter pods.
            </p>
          </div>

          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 flex flex-col gap-1 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-500">Customer Hardware Storage</span>
              <span className="font-semibold text-zinc-900">Always Free ($0)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Ryve Datacenter Rate</span>
              <span className="font-semibold text-emerald-700 font-mono">$4.00 / TB / mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Egress Bandwidth</span>
              <span className="font-semibold text-emerald-700 font-mono">$0.00 / GB</span>
            </div>
          </div>
        </div>

        {/* Current Usage Meter */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-xl shadow-xs flex flex-col justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold block">
              Current Billing Cycle Meter
            </span>
            <div className="text-2xl font-bold font-mono text-zinc-950 mt-1">
              ${monthlyCost}.00 <span className="text-xs font-normal text-zinc-500">/ mo</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Next invoice scheduled for April 1, 2026.
            </p>
          </div>

          <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 flex flex-col gap-1 text-xs">
            <div className="flex justify-between text-zinc-700">
              <span>Billed Dedicated Pods</span>
              <span className="font-mono font-semibold">{ryveTb} TB</span>
            </div>
            <div className="flex justify-between text-zinc-700">
              <span>Customer Self-Hosted Pods</span>
              <span className="font-mono font-semibold">{(stats.customerOwnedBytes / 1000000000000).toFixed(1)} TB (Free)</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-xl shadow-xs flex flex-col justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold block">
              Payment Method
            </span>
            <div className="flex items-center gap-3 mt-2">
              <div className="p-2.5 bg-zinc-900 text-white rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-xs text-zinc-900 block">Corporate Visa ending in 4092</span>
                <span className="text-[10px] text-zinc-400 font-mono">Expires 08/29 • Default</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => addToast({ type: 'info', title: 'Payment method update requested' })}
            className="w-full py-1.5 px-3 border border-zinc-200 rounded text-xs text-zinc-700 hover:bg-zinc-50 font-medium transition-colors"
          >
            Update Payment Method
          </button>
        </div>
      </div>

      {/* Invoices History Table */}
      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-200/80 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-zinc-950 flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-500" />
            <span>Billing Invoices & Receipts</span>
          </h3>
          <span className="text-xs text-zinc-500 font-mono">Automatic monthly billing</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider font-mono text-[10px]">
              <tr>
                <th className="py-3 px-4">Invoice Number</th>
                <th className="py-3 px-4">Billing Period</th>
                <th className="py-3 px-4">Billed Storage</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400">
                    No past invoices. Invoices generate automatically on your monthly billing cycle.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-zinc-900">
                      {inv.invoice_number}
                    </td>
                    <td className="py-3 px-4 text-zinc-600 font-mono text-[11px]">
                      {inv.period_start} → {inv.period_end}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-700">
                      {inv.storage_tb_billed} TB Managed
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-zinc-950">
                      ${inv.amount_usd.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        Paid
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-2 py-1 text-zinc-600 hover:text-zinc-900 rounded hover:bg-zinc-100 text-xs font-medium cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(inv)}
                          className="p-1 text-zinc-500 hover:text-zinc-900 rounded hover:bg-zinc-100 cursor-pointer"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
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

      {/* Invoice Viewer Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-xl shadow-2xl p-6 flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <div>
                <h3 className="font-semibold text-base text-zinc-950">Invoice Details</h3>
                <span className="font-mono text-xs text-zinc-500">{selectedInvoice.invoice_number}</span>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="text-zinc-500">Service:</span>
                <span className="font-semibold text-zinc-900">Ryve Dedicated Cloud Storage Pods</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Storage Billed:</span>
                <span className="font-mono font-semibold text-zinc-900">{selectedInvoice.storage_tb_billed} TB @ $4.00/TB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Egress Fees:</span>
                <span className="font-mono text-emerald-700 font-semibold">$0.00 (Zero Egress Policy)</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-200 text-sm">
                <span className="font-bold text-zinc-900">Total Paid:</span>
                <span className="font-mono font-bold text-zinc-950">${selectedInvoice.amount_usd.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-3 py-1.5 border border-zinc-200 rounded text-zinc-700 hover:bg-zinc-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownloadInvoice(selectedInvoice);
                  setSelectedInvoice(null);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
