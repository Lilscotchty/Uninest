// src/components/OnboardingModal.tsx
// Seamless role onboarding & switcher modal separating Students from Hostel Owners / Managers

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, GraduationCap, Building, Hotel, Home, X, Sparkles, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import {
  USER_ROLES,
  type UserRole,
} from '../types/roles';

interface RoleOption {
  role: UserRole;
  title: string;
  badge?: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const ROLES_DISPLAY: RoleOption[] = [
  {
    role: 'student',
    title: 'Student',
    badge: 'Campus Life',
    description: 'Looking for verified student hostels, campus rooms, and roommates near my university.',
    icon: <GraduationCap size={22} />,
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    iconColor: 'text-emerald-500',
  },
  {
    role: 'accommodation_owner',
    title: 'Hostel Owner / Manager',
    badge: 'Hostel Portal',
    description: 'I own or manage a student hostel, hall, or guesthouse. List rooms, set pricing, and accept bookings.',
    icon: <Hotel size={22} />,
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    iconColor: 'text-amber-500',
  },
  {
    role: 'property_owner',
    title: 'Property Owner / Landlord',
    badge: 'Properties',
    description: 'I rent out private residential apartments, single homes, or short-let spaces.',
    icon: <Building size={22} />,
    iconBg: 'bg-blue-500/10 border-blue-500/20',
    iconColor: 'text-blue-500',
  },
  {
    role: 'general_renter',
    title: 'General Renter',
    badge: 'Renting',
    description: 'Browsing residential apartments and houses across Ghana for personal or family stay.',
    icon: <Home size={22} />,
    iconBg: 'bg-purple-500/10 border-purple-500/20',
    iconColor: 'text-purple-500',
  },
];

export function OnboardingModal() {
  const navigate = useNavigate();
  const { user, profile, updateRole, profileLoading, isRoleModalOpen, setIsRoleModalOpen } = useAppContext();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [saving, setSaving] = useState(false);
  const [show, setShow] = useState(false);

  // Check whether onboarding should appear
  useEffect(() => {
    if (profileLoading) return;

    if (!user) {
      setShow(false);
      return;
    }

    // Explicit manual open from Profile / Settings
    if (isRoleModalOpen) {
      setShow(true);
      if (profile?.role) {
        setSelectedRole(profile.role);
      }
      return;
    }

    // Automatic onboarding check for newly registered users
    const seen = localStorage.getItem(`skycobe_onboarding_${user.id}`);
    const alreadyDone = seen === 'done' || profile?.onboarding_completed;

    if (!alreadyDone) {
      setShow(true);
      if (profile?.role) {
        setSelectedRole(profile.role);
      }
    } else {
      setShow(false);
    }
  }, [user, profile, profileLoading, isRoleModalOpen]);

  if (!show) return null;

  const isOwnerRole = (role: UserRole | null) => 
    role === 'accommodation_owner' || role === 'property_owner' || role === 'manager';

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleClose = () => {
    setShow(false);
    setIsRoleModalOpen(false);
  };

  const handleContinue = async () => {
    if (!selectedRole || !user) return;
    setSaving(true);
    try {
      const isHost = isOwnerRole(selectedRole);
      const ownerType = isHost
        ? (selectedRole === 'manager' ? 'accommodation_owner' : selectedRole)
        : undefined;

      await updateRole(selectedRole, ownerType);

      localStorage.setItem(`skycobe_onboarding_${user.id}`, 'done');
      localStorage.setItem(`skycobe_role_${user.id}`, selectedRole);

      setShow(false);
      setIsRoleModalOpen(false);

      toast.success(
        isHost
          ? 'Welcome, Manager! Navigating to your property management dashboard.'
          : 'Welcome to SKYCOBE! Enjoy exploring your student accommodations.'
      );

      const targetPath = isHost ? '/manager/dashboard' : '/student/dashboard';
      navigate(targetPath, { replace: true });

      // Fallback navigation ensure
      setTimeout(() => {
        if (window.location.pathname !== targetPath) {
          window.location.assign(targetPath);
        }
      }, 150);
    } catch (err: any) {
      toast.error('Failed to save your role. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const isManualOpen = Boolean(isRoleModalOpen);
  const currentRole = profile?.role || 'student';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md px-4 py-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-lg bg-[var(--color-card-bg)] text-[var(--color-text-primary)] rounded-[28px] border border-[var(--color-border)] shadow-2xl p-6 sm:p-8 m-auto relative max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Close Button - available if user already onboarded or opened manually */}
        {(isManualOpen || localStorage.getItem(`skycobe_onboarding_${user?.id}`) === 'done') && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors z-20 cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        )}

        {/* Modal Header */}
        <div className="text-center pt-2 pb-4 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-semibold uppercase tracking-wider mb-3 border border-[var(--color-accent)]/20">
            <Sparkles size={13} />
            <span>Account Personalization</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-heading)]">
            How will you use SKYCOBE?
          </h2>
          <p className="text-[0.88rem] text-[var(--color-text-secondary)] mt-1.5 max-w-sm mx-auto">
            Choose whether you are looking for hostels as a student or managing properties as a hostel owner.
          </p>
        </div>

        {/* Role Cards List */}
        <div className="space-y-3 overflow-y-auto pr-1 py-1 flex-1 custom-scrollbar">
          {ROLES_DISPLAY.map((opt) => {
            const isSelected = selectedRole === opt.role;
            const isCurrent = currentRole === opt.role;

            return (
              <motion.button
                key={opt.role}
                type="button"
                onClick={() => handleRoleSelect(opt.role)}
                whileTap={{ scale: 0.985 }}
                className={`w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all duration-200 border-2 cursor-pointer ${
                  isSelected
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 shadow-[0_4px_16px_rgba(192,132,60,0.12)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)]/60 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface)]'
                }`}
              >
                {/* Role Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all mt-0.5 ${opt.iconBg} ${opt.iconColor}`}>
                  {opt.icon}
                </div>

                {/* Role Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[1rem] font-bold text-[var(--color-heading)] leading-snug">
                      {opt.title}
                    </span>
                    {opt.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]">
                        {opt.badge}
                      </span>
                    )}
                    {isCurrent && isManualOpen && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-500">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[0.82rem] font-normal leading-relaxed text-[var(--color-text-secondary)]">
                    {opt.description}
                  </p>
                </div>

                {/* Radio selection check */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all mt-1 ${
                  isSelected 
                    ? 'bg-[var(--color-accent)] text-white scale-100 shadow-sm' 
                    : 'border-2 border-[var(--color-border)] opacity-40 scale-90'
                }`}>
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-5 mt-2 border-t border-[var(--color-border)] shrink-0 space-y-2.5">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedRole || saving}
            className={`w-full h-[52px] rounded-xl font-bold text-[0.95rem] tracking-wide text-white flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
              !selectedRole || saving 
                ? 'opacity-50 cursor-not-allowed bg-slate-700 border border-slate-600' 
                : 'bg-[var(--color-button)] hover:opacity-95 active:scale-[0.98] shadow-md'
            }`}
          >
            {saving ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {selectedRole === 'accommodation_owner' || selectedRole === 'property_owner' || selectedRole === 'manager'
                  ? 'Continue to Manager Dashboard'
                  : 'Continue to Student Experience'}
                <ArrowRight size={18} strokeWidth={2.5} />
              </>
            )}
          </button>

          {/* Quick Skip for initial onboarding */}
          {!isManualOpen && (
            <button
              type="button"
              onClick={async () => {
                if (!user) return;
                setSaving(true);
                try {
                  await updateRole('student');
                  localStorage.setItem(`skycobe_onboarding_${user.id}`, 'done');
                  localStorage.setItem(`skycobe_role_${user.id}`, 'student');
                  setShow(false);
                  setIsRoleModalOpen(false);
                  navigate('/student/dashboard', { replace: true });
                } finally {
                  setSaving(false);
                }
              }}
              disabled={saving}
              className="w-full text-center text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] py-1 font-medium transition-colors"
            >
              Skip for now (Continue as Student)
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
