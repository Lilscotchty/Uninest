import {
  createContext, useContext, useEffect, useState, useCallback,
  type ReactNode,
} from 'react';

// ── Types ────────────────────────────────────────────────────────────────────

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  /** What the user explicitly chose: light | dark | system */
  mode: ThemeMode;
  /** What is actually applied right now: light | dark */
  resolved: ResolvedTheme;
  /** Call this to change the mode */
  setMode: (mode: ThemeMode) => void;
  /** Convenience toggle between light and dark (skips system) */
  toggle: () => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'skycobe_theme_mode';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === 'system') return getSystemTheme();
  return mode;
}

function applyTheme(resolved: ResolvedTheme) {
  const html = document.documentElement;
  if (resolved === 'dark') {
    html.setAttribute('data-theme', 'dark');
    html.classList.add('dark');
  } else {
    html.setAttribute('data-theme', 'light');
    html.classList.remove('dark');
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    // Read from localStorage on first render
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored && ['light', 'dark', 'system'].includes(stored)) return stored;
    return 'system'; // default to system preference
  });

  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    resolveTheme(mode)
  );

  // Apply theme to DOM whenever resolved changes
  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  // Listen to OS preference changes (only matters when mode === 'system')
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (mode === 'system') {
        const next = getSystemTheme();
        setResolved(next);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
    setResolved(resolveTheme(newMode));
  }, []);

  const toggle = useCallback(() => {
    const next = resolved === 'dark' ? 'light' : 'dark';
    setMode(next);
  }, [resolved, setMode]);

  return (
    <ThemeContext.Provider value={{ mode, resolved, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
