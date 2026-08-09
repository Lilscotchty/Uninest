// src/components/OnboardingModal.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, GraduationCap, Building, Hotel, Home } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import {
  USER_ROLES, ROLE_META,
  type UserRole,
} from '../types/roles';

// Ensure ROLE_META is not dependent on emojis here
const roleIcons: Record<UserRole, React.ReactNode> = {
  student: <GraduationCap size={20} />,
  general_renter: <Home size={20} />,
  accommodation_owner: <Hotel size={20} />,
  property_owner: <Building size={20} />
};

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
    } catch (err: any) {
      toast.error('Failed to save your role. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0f1a]/80 backdrop-blur-md px-4 py-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-md bg-[var(--color-card-bg)] rounded-[24px] border border-[var(--color-border)] shadow-float p-6 sm:p-8 m-auto relative"
      >
        {/* Header */}
        <div className="mb-8 text-center pt-2">
          <h1 className="text-[1.35rem] sm:text-2xl font-bold text-[var(--color-heading)] tracking-tight">
            How will you use SKYCOBE?
          </h1>
          <p className="text-[0.85rem] text-text-muted mt-2">
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
                className={`w-full flex items-center gap-4 p-4 rounded-[18px] text-left transition-all duration-200 border-2 ${
                  selected
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5 shadow-[0_4px_12px_rgba(192,132,60,0.06)]'
                    : 'border-[var(--color-border)] bg-transparent hover:border-[var(--color-border-hover)] hover:bg-slate-50/5'
                }`}
              >
                <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0 transition-colors ${
                  selected ? 'bg-[var(--color-button)]/10 text-[var(--color-accent)]' : 'bg-slate-100/5 text-text-muted border border-[var(--color-border)]'
                }`}>
                  {roleIcons[role]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[0.95rem] font-bold leading-tight mb-0.5 ${
                    selected ? 'text-[var(--color-heading)]' : 'text-text-primary'
                  }`}>
                    {meta.label}
                  </p>
                  <p className={`text-[0.75rem] truncate font-medium ${selected ? 'text-[var(--color-accent)]/80' : 'text-text-muted'}`}>
                    {meta.description}
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  selected ? 'bg-[var(--color-button)] scale-100' : 'border-2 border-[var(--color-border)] scale-90 opacity-40'
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
          className={`w-full h-[54px] rounded-xl font-bold text-[0.95rem] tracking-wide text-white flex items-center justify-center gap-2 transition-all duration-200 ${
            !selectedRole || saving 
              ? 'opacity-50 cursor-not-allowed bg-slate-700 border border-slate-600' 
              : 'bg-[var(--color-button)] hover:opacity-90 active:scale-[0.98] shadow-[0_4px_20px_rgba(192,132,60,0.25)]'
          }`}
        >
          {saving ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Continue
              <ArrowRight size={18} strokeWidth={2.5} />
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
