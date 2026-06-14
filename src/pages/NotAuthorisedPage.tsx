// src/pages/NotAuthorisedPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ROLE_META } from '../types/roles';

export function NotAuthorisedPage() {
  const navigate       = useNavigate();
  const { profile }    = useAppContext();
  const roleName       = profile?.role ? ROLE_META[profile.role].label : 'your account type';

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-6 text-center">
      <div className="max-w-sm w-full bg-[var(--color-card-bg)] p-8 rounded-[24px] border border-[var(--color-border)] shadow-float text-center m-auto">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-red-500/10 border border-red-500/20">
          <ShieldOff size={30} className="text-red-500" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-heading)] mb-2">
          Access restricted
        </h1>
        <p className="text-[0.9rem] font-medium text-text-primary mb-3">
          This page is not available for <strong>{roleName}</strong> accounts.
        </p>
        <p className="text-[0.8rem] text-text-muted mb-8 leading-relaxed">
          If you are a property owner and see this by mistake,
          go to Settings and update your account type.
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 h-[50px] rounded-[14px] border-2 border-[var(--color-border)] text-[0.9rem] font-bold text-text-primary hover:bg-slate-50/5 transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={2.5} /> Go back
          </button>
          {/* We'll just link to profile for now */}
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="h-[50px] rounded-[14px] bg-slate-900 text-white text-[0.9rem] font-bold hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Update account type
          </button>
        </div>
      </div>
    </div>
  );
}
