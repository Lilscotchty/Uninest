import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";
import { AppShell } from "./components/layout/AppShell";
import { Home } from "./pages/Home";
import { Explore } from "./pages/Explore";
import { Details } from "./pages/Details";
import { SeeAll } from "./pages/SeeAll";
import { Saved } from "./pages/Saved";
import { Profile } from "./pages/Profile";
import { SignUp } from "./pages/SignUp";
import { Landing } from "./pages/Landing";
import { EditProfile } from "./pages/EditProfile";
import { Toast } from "./components/Toast";
import { Toaster } from "sonner";
import { ErrorBoundary } from "./ErrorBoundary";
import { VirtualTour } from "./pages/VirtualTour";
import { Referrals } from "./pages/Referrals";
import { PriceAlerts } from "./pages/PriceAlerts";
import { ManagerDashboard } from "./pages/ManagerDashboard";
import { PropertyReviews } from "./pages/PropertyReviews";
import { Opportunities } from "./pages/Opportunities";
import RecentlyViewedPage from "./pages/RecentlyViewedPage";
import { OwnerGuard } from "./components/guards/RoleGuard";
import { NotAuthorisedPage } from "./pages/NotAuthorisedPage";
import { OnboardingModal } from "./components/OnboardingModal";
import { Notifications } from "./pages/Notifications";
import { Messages } from "./pages/Messages";
import { Settings } from "./pages/Settings";
import { Support } from "./pages/Support";
import { CampusGuide } from "./pages/CampusGuide";

import { AuthCallback } from "./components/AuthCallback";

const AppContent: React.FC = () => {
  const { user, profile, profileLoading } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  // Middleware simulation for protecting routes
  useEffect(() => {
    // Attempt auto-fullscreen on first user interaction (browser security requires a gesture)
    const handleFirstInteraction = () => {
      if (
        !document.fullscreenElement &&
        document.documentElement.requestFullscreen
      ) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
    };

    document.addEventListener("click", handleFirstInteraction, { once: true });
    document.addEventListener("touchstart", handleFirstInteraction, {
      once: true,
    });

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    // If OAuth code or hash tokens are currently present in URL, wait for auth exchange to finish
    const isAuthInFlight =
      location.search.includes('code=') ||
      location.hash.includes('access_token=');
    if (isAuthInFlight && !user) return;

    if (user === undefined || profileLoading) return; // Wait for auth check

    const publicPaths = ["/", "/login", "/signup", "/auth/callback"];

    // If not user and trying to access protected UI (everything EXCEPT landing/login/signup/callback)
    if (user === null) {
      if (!publicPaths.includes(location.pathname)) {
        navigate("/login", { replace: true });
      }
    } else if (user) {
      // If user is logged in, restrict access to landing/login/signup and route to correct dashboard
      if (publicPaths.includes(location.pathname)) {
        const isHost =
          profile?.role === "manager" ||
          profile?.role === "accommodation_owner" ||
          profile?.role === "property_owner" ||
          user?.user_metadata?.account_type === "manager" ||
          user?.user_metadata?.role === "manager" ||
          user?.user_metadata?.role === "accommodation_owner" ||
          user?.user_metadata?.role === "property_owner" ||
          (user?.id ? ['manager', 'accommodation_owner', 'property_owner'].includes(localStorage.getItem(`skycobe_role_${user.id}`) || '') : false);

        navigate(isHost ? "/manager/dashboard" : "/student/dashboard", {
          replace: true,
        });
      }
    }
  }, [user, profile, profileLoading, location.pathname, location.search, location.hash, navigate]);

  const publicPaths = ["/", "/login", "/signup", "/auth/callback"];
  const isAuthInFlight =
    location.search.includes('code=') ||
    location.hash.includes('access_token=');

  // Prevent flashing protected dashboard or accepting premature button clicks before auth exchange completes
  if ((profileLoading || isAuthInFlight) && !publicPaths.includes(location.pathname) && !user) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[100dvh] bg-[var(--color-bg)] text-[var(--color-text-primary)]">
        <div className="w-10 h-10 border-4 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin mb-4" />
        <p className="text-[var(--color-text-secondary)] text-sm font-medium">
          Verifying your session...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] flex flex-col font-sans`}
    >
      <Toaster position="top-center" theme="light" toastOptions={{ style: { background: 'var(--color-surface)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-subtle)' } }} />
      <Toast />
      <OnboardingModal />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* General Routes */}
        <Route
          path="/student/dashboard"
          element={
            <AppShell>
              <Home />
            </AppShell>
          }
        />
        <Route
          path="/explore"
          element={
            <AppShell>
              <Explore />
            </AppShell>
          }
        />
        <Route
          path="/see-all/:type"
          element={
            <AppShell>
              <SeeAll />
            </AppShell>
          }
        />
        <Route path="/details" element={<Details />} />
        <Route
          path="/opportunities"
          element={
            <AppShell>
              <Opportunities />
            </AppShell>
          }
        />
        <Route
          path="/property/:propertyId/reviews"
          element={<PropertyReviews />}
        />
        <Route
          path="/virtual-tour"
          element={
            <AppShell>
              <VirtualTour />
            </AppShell>
          }
        />
        <Route
          path="/price-alerts"
          element={
            <AppShell>
              <PriceAlerts />
            </AppShell>
          }
        />
        <Route
          path="/saved"
          element={
            <AppShell>
              <Saved />
            </AppShell>
          }
        />
        <Route
          path="/profile"
          element={
            <AppShell>
              <Profile />
            </AppShell>
          }
        />
        <Route
          path="/notifications"
          element={
            <AppShell>
              <Notifications />
            </AppShell>
          }
        />
        <Route
          path="/messages"
          element={
            <AppShell>
              <Messages />
            </AppShell>
          }
        />
        <Route
          path="/settings"
          element={
            <AppShell>
              <Settings />
            </AppShell>
          }
        />
        <Route
          path="/support"
          element={
            <AppShell>
              <Support />
            </AppShell>
          }
        />
        <Route
          path="/campus-guide"
          element={
            <AppShell>
              <CampusGuide />
            </AppShell>
          }
        />

        {/* Manager Routes */}
        <Route
          path="/manager/dashboard"
          element={
            <OwnerGuard>
              <ManagerDashboard />
            </OwnerGuard>
          }
        />

        <Route path="/edit-profile" element={<EditProfile />} />
        <Route
          path="/referrals"
          element={
            <AppShell>
              <Referrals />
            </AppShell>
          }
        />
        <Route
          path="/recently-viewed"
          element={
            <AppShell>
              <RecentlyViewedPage />
            </AppShell>
          }
        />
        <Route path="/not-authorised" element={<NotAuthorisedPage />} />

        {/* Fallback */}
        <Route
          path="*"
          element={
            user === undefined || profileLoading ? (
              <div className="flex-1 flex items-center justify-center min-h-[100dvh]">
                <div className="w-8 h-8 border-4 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin" />
              </div>
            ) : user ? (
              <Navigate
                to={
                  profile?.role === "manager" ||
                  profile?.role === "accommodation_owner" ||
                  profile?.role === "property_owner" ||
                  user?.user_metadata?.account_type === "manager" ||
                  user?.user_metadata?.role === "manager" ||
                  user?.user_metadata?.role === "accommodation_owner" ||
                  user?.user_metadata?.role === "property_owner" ||
                  (user?.id ? ['manager', 'accommodation_owner', 'property_owner'].includes(localStorage.getItem(`skycobe_role_${user.id}`) || '') : false)
                    ? "/manager/dashboard"
                    : "/student/dashboard"
                }
                replace
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
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
