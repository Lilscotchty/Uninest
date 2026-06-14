// src/components/PricingTagSelector.tsx

import React from 'react';
import { useAppContext } from '../context/AppContext';
import {
  PRICING_TAGS_BY_OWNER,
  PRICING_TAG_LABELS,
  type PricingTag,
} from '../types/roles';

interface Props {
  value:     PricingTag;
  onChange:  (tag: PricingTag) => void;
  error?:    string;
}

export function PricingTagSelector({ value, onChange, error }: Props) {
  const { profile } = useAppContext();

  // Only show tags relevant to this owner's type
  const ownerType = profile?.owner_type ?? profile?.role;
  const availableTags =
    ownerType === 'accommodation_owner' || ownerType === 'property_owner'
      ? PRICING_TAGS_BY_OWNER[ownerType]
      : (Object.keys(PRICING_TAG_LABELS) as PricingTag[]);

  return (
    <div>
      <label className="block text-sm font-bold text-text-primary mb-2">
        Pricing period <span className="text-red-500">*</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => onChange(tag)}
            className={`px-4 py-2.5 rounded-xl text-[0.85rem] font-bold border-2 transition-all duration-150 ${
              value === tag
                ? 'border-[var(--color-accent)] bg-slate-900/10 text-[var(--color-accent)]'
                : 'border-[var(--color-border)] text-text-muted hover:border-slate-400'
            } active:scale-95`}
          >
            {PRICING_TAG_LABELS[tag]}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
      {/* Preview */}
      {value && (
        <p className="text-[0.8rem] text-text-muted mt-2 font-medium">
          Listing will show: <span className="font-bold text-[var(--color-accent)]">GHC 1,200{value}</span>
        </p>
      )}
    </div>
  );
}
