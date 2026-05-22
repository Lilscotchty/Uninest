import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
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
import { ManagerDashboard } from './pages/ManagerDashboard';

const AppContent: React.FC = () => {
  const { theme, user } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Middleware simulation for protecting routes
  useEffect(() => {
    if (user === undefined) return; // Wait for auth check

    // If not user and trying to access protected UI (everything EXCEPT login/signup)
    const publicPaths = ['/login', '/signup', '/'];
    if (user === null) {
      if (!publicPaths.includes(location.pathname)) {
        navigate('/login', { replace: true });
      }
    } else if (user) {
      // If user is logged in, restrict access to login/signup
      if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/') {
        // Find user role
        let role = user.user_metadata?.account_type;
        const storedRole = localStorage.getItem('signupRole');
        
        if (storedRole && (!role || role !== storedRole)) {
            role = storedRole;
            // Best effort update
            import('./lib/supabase').then(({ supabase }) => {
                supabase.auth.updateUser({ data: { account_type: role } });
                supabase.from('profiles').update({ account_type: role }).eq('id', user.id).then();
            });
            localStorage.removeItem('signupRole');
        }

        role = role || 'student';
        navigate(role === 'manager' ? '/manager/dashboard' : '/student/dashboard', { replace: true });
      }
    }
  }, [user, location.pathname, navigate]);

  return (
    <div className={`w-full flex-shrink-0 self-center max-w-[400px] bg-app-bg h-[100dvh] overflow-hidden relative shadow-[0_0_60px_rgba(30,27,75,0.25)] flex flex-col font-sans ${theme === "dark" ? "dark" : ""}`}>
      <Toast />
      
      <Routes>
        <Route path="/login" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Student Routes */}
        <Route path="/student/dashboard" element={<><div className="flex-1 overflow-hidden"><Home /></div><BottomNav /></>} />
        <Route path="/explore" element={<><div className="flex-1 overflow-hidden"><Explore /></div><BottomNav /></>} />
        <Route path="/details" element={<div className="flex-1 overflow-hidden"><Details /></div>} />
        <Route path="/virtual-tour" element={<div className="flex-1 overflow-hidden"><VirtualTour /></div>} />
        <Route path="/price-alerts" element={<div className="flex-1 overflow-hidden"><PriceAlerts /></div>} />
        <Route path="/saved" element={<><div className="flex-1 overflow-hidden"><Saved /></div><BottomNav /></>} />
        <Route path="/profile" element={<><div className="flex-1 overflow-hidden"><Profile /></div><BottomNav /></>} />
        
        {/* Manager Routes */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />

        {/* Fallback */}
        <Route path="*" element={
          user === undefined ? (
            <div className="flex-1 flex items-center justify-center min-h-[100dvh]">
              <div className="w-8 h-8 border-4 border-indigo/30 border-t-indigo rounded-full animate-spin" />
            </div>
          ) : user ? (
            <Navigate to={user.user_metadata?.account_type === 'manager' ? '/manager/dashboard' : '/student/dashboard'} replace /> 
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </AppProvider>
    </BrowserRouter>
  );
}

