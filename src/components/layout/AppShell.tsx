import React from 'react';
import { Navigation } from './Navigation';
import { Header } from '../Header';
import { useAppContext } from '../../context/AppContext';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useAppContext();
  
  return (
    <div className="min-h-screen bg-app-bg text-text-primary flex flex-col font-sans">
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="flex flex-1 md:pt-[72px]">
        <Navigation />
        <main className={`flex-1 w-full pb-24 md:pb-0 transition-all duration-300`}>
          {children}
        </main>
      </div>
    </div>
  );
}
