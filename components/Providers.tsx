'use client';

import React from 'react';
import { RyveProvider } from '@/lib/store';
import { ToastContainer } from '@/components/ToastContainer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RyveProvider>
      {children}
      <ToastContainer />
    </RyveProvider>
  );
}

