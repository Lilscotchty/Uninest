import { useState, useEffect } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

function getBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'xs';
  const w = window.innerWidth;
  if (w < 640) return 'xs';
  if (w < 768) return 'sm';
  if (w < 1024) return 'md';
  if (w < 1280) return 'lg';
  if (w < 1536) return 'xl';
  return '2xl';
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(getBreakpoint());

  useEffect(() => {
    const handler = () => {
      setBreakpoint(getBreakpoint());
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return breakpoint;
}
