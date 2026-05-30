import React from 'react';

export function PageContainer({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`
      px-4 sm:px-6 lg:px-8      /* horizontal padding */
      pt-4                      /* vertical padding */
      max-w-screen-2xl mx-auto  /* cap max width */
      w-full
      ${className}
    `}>
      {children}
    </div>
  );
}
