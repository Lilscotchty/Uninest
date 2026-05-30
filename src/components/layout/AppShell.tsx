import React from 'react';
import { Navigation } from './Navigation';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col font-sans">
      <Navigation />
      <main className="
        flex-1
        w-full
        /* Mobile: no left offset, padding bottom for nav */
        pb-20
        /* Tablet: offset for 72px sidebar */
        md:pb-0 md:pl-[72px]
        /* Desktop: offset for 240px sidebar */
        lg:pl-60
      ">
        {children}
      </main>
    </div>
  );
}
