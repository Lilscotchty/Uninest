// src/types/roles.ts
// Single source of truth for all role and pricing constants.

// ─── User roles ───────────────────────────────────────────────────────────────

export const USER_ROLES = [
  'student',
  'general_renter',
  'accommodation_owner',
  'property_owner',
  'manager',
] as const;

export type UserRole = typeof USER_ROLES[number];

export const OWNER_ROLES: UserRole[] = [
  'accommodation_owner',
  'property_owner',
];

export function isOwner(role: UserRole | null | undefined): boolean {
  return role === 'accommodation_owner' || role === 'property_owner';
}

export function isStudent(role: UserRole | null | undefined): boolean {
  return role === 'student';
}

// ─── Role display metadata ────────────────────────────────────────────────────

export const ROLE_META: Record<UserRole, {
  label:       string;
  description: string;
  icon:        string; 
}> = {
  manager: {
    label:       'Manager',
    description: 'System Manager',
    icon:        '🛡️',
  },
  student: {
    label:       'Student',
    description: 'Looking for accommodation near my university',
    icon:        '🎓',
  },
  general_renter: {
    label:       'Looking for a place',
    description: 'Browsing homes, apartments, and short-lets',
    icon:        '🏠',
  },
  accommodation_owner: {
    label:       'Hostel / Hotel Owner',
    description: 'I manage a hostel, hotel, or boarding house',
    icon:        '🏨',
  },
  property_owner: {
    label:       'Property Owner',
    description: 'I rent out homes, apartments, or short-lets',
    icon:        '🏢',
  },
};

// ─── Pricing tags ─────────────────────────────────────────────────────────────

export const PRICING_TAGS = [
  '/sem',
  '/year',
  '/month',
  '/week',
  '/night',
  '/day',
  '/stay',
] as const;

export type PricingTag = typeof PRICING_TAGS[number];

// Which pricing tags are available per owner type
export const PRICING_TAGS_BY_OWNER: Record<
  'accommodation_owner' | 'property_owner',
  PricingTag[]
> = {
  accommodation_owner: ['/sem', '/year', '/month', '/week', '/night'],
  property_owner:      ['/month', '/year', '/week', '/night', '/day', '/stay'],
};

export const PRICING_TAG_LABELS: Record<PricingTag, string> = {
  '/sem':   'Per Semester',
  '/year':  'Per Year',
  '/month': 'Per Month',
  '/week':  'Per Week',
  '/night': 'Per Night',
  '/day':   'Per Day',
  '/stay':  'Per Stay',
};

// ─── Property categories ──────────────────────────────────────────────────────

export const PROPERTY_CATEGORIES_BY_OWNER = {
  accommodation_owner: [
    { value: 'hostel',        label: 'Hostel'         },
    { value: 'hotel',         label: 'Hotel'          },
    { value: 'boarding_house',label: 'Boarding House' },
  ],
  property_owner: [
    { value: 'apartment',     label: 'Apartment'      },
    { value: 'house',         label: 'House'          },
    { value: 'studio',        label: 'Studio'         },
    { value: 'short_let',     label: 'Short-let'      },
    { value: 'office',        label: 'Office Space'   },
    { value: 'other',         label: 'Other'          },
  ],
} as const;

// ─── Profile type ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id:          string;
  full_name:   string | null;
  avatar_url:  string | null;
  role:        UserRole;
  owner_type:  'accommodation_owner' | 'property_owner' | null;
  university:  string | null;
  student_id:  string | null;
  phone:       string | null;
  bio:         string | null;
  verified:    boolean;
  created_at:  string;
  updated_at:  string;
}
