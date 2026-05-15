import React, { useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Details } from './pages/Details';
import { Saved } from './pages/Saved';
import { Profile } from './pages/Profile';
import { SignUp } from './pages/SignUp';
import { Toast } from './components/Toast';
import { ErrorBoundary } from './ErrorBoundary';
import { VirtualTour } from './pages/VirtualTour';
import { PriceAlerts } from './pages/PriceAlerts';
import { Compare } from './pages/Compare';
import { Roommate } from './pages/Roommate';

const AppContent: React.FC = () => {
  const { currentView, theme } = useAppContext();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`w-full flex-shrink-0 self-center max-w-[400px] bg-app-bg h-[100dvh] overflow-hidden relative shadow-[0_0_60px_rgba(30,27,75,0.25)] flex flex-col font-sans ${theme === "dark" ? "dark" : ""}`}>
      <Toast />
      
      {currentView === 'home' && (
        <>
          <Home />
          <BottomNav />
        </>
      )}
      {currentView === 'explore' && <Explore />}
      {currentView === 'details' && <Details />}
      {currentView === 'virtual-tour' && <VirtualTour />}
      {currentView === 'price-alerts' && <PriceAlerts />}
      {currentView === 'compare' && <Compare />}
      {currentView === 'roommate' && <Roommate />}
      {currentView === 'saved' && (
        <>
          <Saved />
          <BottomNav />
        </>
      )}
      {currentView === 'profile' && (
        <>
          <Profile />
          <BottomNav />
        </>
      )}
      {currentView === 'signup' && <SignUp />}
    </div>
  );
};


export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AppProvider>
  );
}
