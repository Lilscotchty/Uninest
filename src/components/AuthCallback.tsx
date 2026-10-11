import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAppContext } from "../context/AppContext";
import { toast } from "sonner";

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, profileLoading } = useAppContext();
  const [statusMessage, setStatusMessage] = useState("Completing sign in...");

  const getTargetDashboard = () => {
    const signupRole = typeof window !== 'undefined' ? localStorage.getItem('signupRole') : null;
    const isHost =
      profile?.role === 'manager' ||
      profile?.role === 'accommodation_owner' ||
      profile?.role === 'property_owner' ||
      signupRole === 'manager';

    return isHost ? '/manager/dashboard' : '/student/dashboard';
  };

  useEffect(() => {
    // If user is already resolved and loaded in context, proceed to dashboard
    if (user && !profileLoading) {
      navigate(getTargetDashboard(), { replace: true });
      return;
    }

    let isMounted = true;

    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      const errorMsg = params.get("error_description") || params.get("error") || hashParams.get("error_description");
      if (errorMsg) {
        if (isMounted) setStatusMessage("Authentication failed. Redirecting...");
        toast.error(`Authentication error: ${errorMsg}`);
        setTimeout(() => {
          if (isMounted) navigate("/login", { replace: true });
        }, 1500);
        return;
      }

      const code = params.get("code");
      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error && data?.session) {
            if (isMounted) {
              navigate(getTargetDashboard(), { replace: true });
            }
            return;
          }
        } catch (err) {
          console.warn("AuthCallback exchange attempt:", err);
        }
      }

      // Check current active session
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && isMounted) {
          navigate(getTargetDashboard(), { replace: true });
          return;
        }
      } catch (err) {
        console.warn("AuthCallback getSession error:", err);
      }

      // Wait up to 3.5 seconds for onAuthStateChange to deliver session
      const timeout = setTimeout(async () => {
        if (!isMounted) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate(getTargetDashboard(), { replace: true });
        } else {
          toast.error("Could not verify your session. Please sign in again.");
          navigate("/login", { replace: true });
        }
      }, 3500);

      return () => clearTimeout(timeout);
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [user, profileLoading, navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[100dvh] bg-[var(--color-bg)]">
      <div className="w-10 h-10 border-4 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin mb-4" />
      <p className="text-[var(--color-text-secondary)] text-sm font-medium">
        {statusMessage}
      </p>
    </div>
  );
};
