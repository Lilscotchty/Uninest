import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type ThemeMode } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import React from 'react';

const OPTIONS: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
  { mode: 'light',  label: 'Light',  icon: <Sun  size={16} /> },
  { mode: 'dark',   label: 'Dark',   icon: <Moon size={16} /> },
  { mode: 'system', label: 'System', icon: <Monitor size={16} /> },
];

export function ThemeSelector() {
  const { mode, setMode } = useTheme();

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-widest"
         style={{ color: 'var(--color-text-secondary)' }}>
        Appearance
      </p>

      {/* Segmented control pill */}
      <div
        className="flex rounded-xl p-1 gap-1"
        style={{ backgroundColor: 'var(--color-input-bg)', border: '1px solid var(--color-border)' }}
        role="radiogroup"
        aria-label="Choose app appearance"
      >
        {OPTIONS.map((opt) => {
          const isActive = mode === opt.mode;
          return (
            <button
              key={opt.mode}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setMode(opt.mode)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2',
                'h-9 rounded-lg text-sm font-medium',
                'transition-all duration-200 active:scale-95',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              )}
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--color-elevated)',
                      color: 'var(--color-accent)',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                    }
                  : {
                      backgroundColor: 'transparent',
                      color: 'var(--color-text-secondary)',
                    }
              }
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Helper text — explains system mode */}
      {mode === 'system' && (
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          Follows your device's display settings automatically.
        </p>
      )}
    </div>
  );
}
