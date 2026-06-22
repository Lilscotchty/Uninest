// src/components/guards/RoleGuard.tsx
// Wrap any route or component to restrict by role.

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';   
import type { UserRole } from '../../types/roles';

interface RoleGuardProps {
  children:      React.ReactNode;
  allowedRoles:  UserRole[];
  /** Where to redirect if role check fails. Default: '/not-authorised' */
  redirectTo?:   string;
  /** Show this instead of redirecting (inline fallback) */
  fallback?:     React.ReactNode;
}

export function RoleGuard({
  children,
  allowedRoles,
  redirectTo = '/not-authorised',
  fallback,
}: RoleGuardProps) {
  const { user, profile, profileLoading } = useAppContext();
  const location = useLocation();

  // Still loading profile — show nothing (prevents flash)
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated at all
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check
  if (!profile || !allowedRoles.includes(profile.role)) {
    if (fallback) return <>{fallback}</>;
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

// ── Convenience wrappers ──────────────────────────────────────────────────────

/** Only accommodation owners and property owners */
export function OwnerGuard({ children, fallback }: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <RoleGuard
      allowedRoles={['manager', 'accommodation_owner', 'property_owner']}
      redirectTo="/not-authorised"
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}

/** Only accommodation owners (hostels/hotels) */
export function AccommodationOwnerGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard
      allowedRoles={['accommodation_owner']}
      redirectTo="/not-authorised"
    >
      {children}
    </RoleGuard>
  );
}

/** Only students */
export function StudentGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['student', 'manager', 'accommodation_owner', 'property_owner', 'general_renter']} redirectTo="/not-authorised">
      {children}
    </RoleGuard>
  );
}
