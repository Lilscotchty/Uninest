import React from 'react';
import type { CompanySector } from '../../types/opportunities';

const SECTORS: { id: CompanySector | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Sectors', icon: '🌍' },
  { id: 'technology', label: 'Tech', icon: '💻' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'healthcare', label: 'Health', icon: '⚕️' },
  { id: 'legal', label: 'Law', icon: '⚖️' },
  { id: 'construction', label: 'Construction', icon: '🏗️' },
  { id: 'electrical', label: 'Electrical', icon: '⚡' },
  { id: 'public_relations', label: 'PR', icon: '📣' },
  { id: 'tourism', label: 'Tourism', icon: '✈️' },
];

interface SectorFilterBarProps {
  selectedSector: CompanySector | 'all';
  onSelect: (sector: CompanySector | 'all') => void;
}

export const SectorFilterBar: React.FC<SectorFilterBarProps> = ({ selectedSector, onSelect }) => {
  return (
    <div className="w-full overflow-x-auto hide-scrollbar border-b border-border-subtle bg-card-bg/80 backdrop-blur-sm z-10 relative px-4 py-3">
      <div className="flex items-center gap-2 w-max pb-1">
        {SECTORS.map((sector) => {
          const isSelected = selectedSector === sector.id;
          return (
            <button
              key={sector.id}
              onClick={() => onSelect(sector.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.85rem] font-bold transition-all whitespace-nowrap ${
                isSelected 
                  ? 'bg-[var(--color-button)] text-white shadow-sm' 
                  : 'bg-app-bg text-text-muted hover:bg-slate-200'
              }`}
            >
              <span>{sector.icon}</span>
              <span>{sector.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
