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
    if (user === undefined || profileLoading) return; // Wait for auth check

    const publicPaths = ["/", "/login", "/signup"];

    // If not user and trying to access protected UI (everything EXCEPT landing/login/signup)
    if (user === null) {
      if (!publicPaths.includes(location.pathname)) {
        navigate("/login", { replace: true });
      }
    } else if (user) {
      // If user is logged in, restrict access to landing/login/signup
      if (publicPaths.includes(location.pathname)) {
        // Fallback for new role system + legacy
        const role =
          profile?.role || user.user_metadata?.account_type || "student";
        const isManager =
          role === "manager" ||
          role === "accommodation_owner" ||
          role === "property_owner";

        navigate(isManager ? "/manager/dashboard" : "/student/dashboard", {
          replace: true,
        });
      }
    }
  }, [user, profile, profileLoading, location.pathname, navigate]);

  return (
    <div
      className={`w-full min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] flex flex-col font-sans`}
    >
      <Toast />
      <OnboardingModal />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />

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
                  profile?.role === "accommodation_owner" ||
                  profile?.role === "property_owner" ||
                  user.user_metadata?.account_type === "manager"
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
