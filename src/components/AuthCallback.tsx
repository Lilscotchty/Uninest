import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAppContext } from "../context/AppContext";

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, profileLoading } = useAppContext();

  useEffect(() => {
    if (user && !profileLoading) {
      navigate("/student/dashboard", { replace: true });
      return;
    }

    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        try {
          await supabase.auth.exchangeCodeForSession(code);
        } catch (err) {
          console.warn("AuthCallback exchangeCodeForSession:", err);
        }
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/student/dashboard", { replace: true });
      } else {
        const timeout = setTimeout(() => {
          navigate("/student/dashboard", { replace: true });
        }, 1500);
        return () => clearTimeout(timeout);
      }
    };

    handleCallback();
  }, [user, profileLoading, navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[100dvh] bg-[var(--color-bg)]">
      <div className="w-10 h-10 border-4 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin mb-4" />
      <p className="text-[var(--color-text-secondary)] text-sm font-medium">
        Completing sign in...
      </p>
    </div>
  );
};
