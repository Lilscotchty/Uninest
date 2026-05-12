import React from 'react';
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

const AppContent: React.FC = () => {
  const { currentView } = useAppContext();

  return (
    <div className="w-full max-w-[400px] bg-app-bg h-[100dvh] overflow-hidden relative shadow-[0_0_60px_rgba(30,27,75,0.25)] flex flex-col font-sans">
      <Toast />
      
      {currentView === 'home' && (
        <>
          <Home />
          <BottomNav />
        </>
      )}
      {currentView === 'explore' && <Explore />}
      {currentView === 'details' && <Details />}
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
