'use client';

import React from 'react';
import { useRyve } from '@/context/store';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useRyve();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icon =
          toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#FF6B50] shrink-0 mt-0.5" />
          ) : toast.type === 'warning' ? (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : toast.type === 'error' ? (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-white shrink-0 mt-0.5" />
          );

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 bg-[#111111] border border-[#2a2a2a] text-[#ebebeb] rounded-2xl shadow-2xl shadow-black/90 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 backdrop-blur-md"
          >
            {icon}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black tracking-tight text-white">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-[#888888] mt-1 wrap-break-word font-mono leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#666666] hover:text-white p-1 -mr-1 -mt-1 rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
