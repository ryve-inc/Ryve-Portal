'use client';

import React from 'react';
import { useRyve } from '@/lib/store';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useRyve();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icon =
          toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          ) : toast.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          ) : toast.type === 'error' ? (
            <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
          );

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-lg shadow-xl shadow-black/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
          >
            {icon}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold tracking-tight text-white">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-zinc-400 mt-0.5 break-words font-mono">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-500 hover:text-zinc-300 p-1 -mr-1 -mt-1 rounded hover:bg-zinc-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
