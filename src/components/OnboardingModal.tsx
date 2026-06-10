// src/components/OnboardingModal.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import {
  USER_ROLES, ROLE_META,
  type UserRole,
} from '../types/roles';

export function OnboardingModal() {
  const navigate = useNavigate();
  const { user, profile, updateRole, profileLoading } = useAppContext();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [saving, setSaving] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (profileLoading) return;

    if (user && profile && profile.role === 'general_renter') {
      const seen = localStorage.getItem(`skycobe_onboarding_${user.id}`);
      if (!seen) {
        setShow(true);
      }
    } else {
      setShow(false);
    }
  }, [user, profile, profileLoading]);

  if (!show) return null;

  const isOwnerRole = selectedRole === 'accommodation_owner' ||
                      selectedRole === 'property_owner';

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole || !user) return;
    setSaving(true);
    try {
      await updateRole(
        selectedRole,
        isOwnerRole ? selectedRole : undefined
      );
      localStorage.setItem(`skycobe_onboarding_${user.id}`, 'done');
      toast.success('Welcome to SKYCOBE!');
      setShow(false);
    } catch {
      toast.error('Failed to save your role. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0f1a]/80 backdrop-blur-md px-4 py-10 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-[var(--color-card-bg)] rounded-[24px] border border-[var(--color-border)] shadow-float p-6 sm:p-8 m-auto relative"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto mb-5 shadow-sm border border-[var(--color-accent-muted)]">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-heading)] tracking-tight">
            How will you use SKYCOBE?
          </h1>
          <p className="text-[0.9rem] text-text-muted mt-2">
            Select your account type to personalize your experience.
          </p>
        </div>

        {/* Role cards */}
        <div className="space-y-3 mb-8">
          {USER_ROLES.map((role) => {
            const meta = ROLE_META[role];
            const selected = selectedRole === role;
            return (
              <motion.button
                key={role}
                type="button"
                onClick={() => handleRoleSelect(role)}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-4 p-4 rounded-[18px] text-left border-2 transition-all duration-200 ${
                  selected
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5 shadow-[0_4px_20px_rgba(192,132,60,0.1)]'
                    : 'border-[var(--color-border)] bg-transparent hover:border-[var(--color-border-hover)] hover:bg-slate-50/5'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-colors ${selected ? 'bg-[var(--color-accent)]/10' : 'bg-slate-100/10'}`}>
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[0.95rem] font-bold leading-tight ${
                    selected ? 'text-[var(--color-heading)]' : 'text-text-primary'
                  }`}>
                    {meta.label}
                  </p>
                  <p className="text-[0.8rem] text-text-muted truncate mt-0.5 font-medium">
                    {meta.description}
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  selected ? 'bg-[var(--color-accent)] scale-100' : 'border-2 border-[var(--color-border)] scale-90 opacity-50'
                }`}>
                  {selected && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Continue button */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedRole || saving}
          className={`w-full h-[52px] rounded-xl font-bold text-[15px] tracking-wide text-white flex items-center justify-center gap-2 transition-all duration-200 ${
            !selectedRole || saving 
              ? 'opacity-50 cursor-not-allowed bg-slate-700' 
              : 'bg-[var(--color-accent)] hover:opacity-90 active:scale-[0.98] shadow-[0_4px_20px_rgba(192,132,60,0.3)]'
          }`}
        >
          {saving ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Get Started
              <ArrowRight size={18} strokeWidth={2.5} />
            </>
          )}
        </button>

        <p className="text-center text-[0.7rem] font-medium text-text-muted mt-4 uppercase tracking-wider">
          You can change this anytime in settings
        </p>
      </motion.div>
    </div>
  );
}
