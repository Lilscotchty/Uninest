import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Details } from './pages/Details';
import { Saved } from './pages/Saved';
import { Profile } from './pages/Profile';
import { SignUp } from './pages/SignUp';
import { Landing } from './pages/Landing';
import { EditProfile } from './pages/EditProfile';
import { Toast } from './components/Toast';
import { ErrorBoundary } from './ErrorBoundary';
import { VirtualTour } from './pages/VirtualTour';
import { PriceAlerts } from './pages/PriceAlerts';
import { ManagerDashboard } from './pages/ManagerDashboard';
import RecentlyViewedPage from "./pages/RecentlyViewedPage";

const AppContent: React.FC = () => {
  const { user } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  // Middleware simulation for protecting routes
  useEffect(() => {
    if (user === undefined) return; // Wait for auth check

    const publicPaths = ['/', '/login', '/signup'];
    
    // If not user and trying to access protected UI (everything EXCEPT landing/login/signup)
    if (user === null) {
      if (!publicPaths.includes(location.pathname)) {
        navigate('/login', { replace: true });
      }
    } else if (user) {
      // If user is logged in, restrict access to landing/login/signup
      if (publicPaths.includes(location.pathname)) {
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

        // Check if required profile information is missing
        const isMissingInfo = !user.user_metadata?.phone || (role === 'student' && (!user.user_metadata?.university || !user.user_metadata?.level));

        if (isMissingInfo) {
           navigate('/edit-profile?complete=true', { replace: true });
        } else {
           navigate(role === 'manager' ? '/manager/dashboard' : '/student/dashboard', { replace: true });
        }
      }
    }
  }, [user, location.pathname, navigate]);

  return (
    <div className={`w-full min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] flex flex-col font-sans`}>
      <Toast />
      
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Student Routes */}
        <Route path="/student/dashboard" element={<AppShell><Home /></AppShell>} />
        <Route path="/explore" element={<AppShell><Explore /></AppShell>} />
        <Route path="/details" element={<Details />} />
        <Route path="/virtual-tour" element={<VirtualTour />} />
        <Route path="/price-alerts" element={<PriceAlerts />} />
        <Route path="/saved" element={<AppShell><Saved /></AppShell>} />
        <Route path="/profile" element={<AppShell><Profile /></AppShell>} />
        
        {/* Manager Routes */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />

        <Route path="/edit-profile" element={<EditProfile />} />
        
        <Route path="/recently-viewed" element={<RecentlyViewedPage />} />

        {/* Fallback */}
        <Route path="*" element={
          user === undefined ? (
            <div className="flex-1 flex items-center justify-center min-h-[100dvh]">
              <div className="w-8 h-8 border-4 border-[var(--color-accent)]/30 border-t-indigo rounded-full animate-spin" />
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

