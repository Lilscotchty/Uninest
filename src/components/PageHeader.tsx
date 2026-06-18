import React from 'react';
import { useAppContext } from '../context/AppContext';

interface PageHeaderProps {
  title?: string;
  rightAction?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, rightAction }) => {
  return (
    <header className="w-full h-[72px] flex justify-between items-center px-6 relative overflow-hidden shrink-0" 
      style={{
        background: `
          linear-gradient(115deg, transparent 55%, rgba(65, 45, 110, 0.4) 55%, rgba(65, 45, 110, 0.4) 68%, transparent 68%),
          linear-gradient(35deg, transparent 40%, rgba(40, 55, 110, 0.3) 40%, rgba(40, 55, 110, 0.3) 75%, transparent 75%),
          linear-gradient(160deg, transparent 20%, rgba(80, 50, 130, 0.2) 20%, rgba(80, 50, 130, 0.2) 40%, transparent 40%),
          linear-gradient(to right, #0b1021 0%, #1c2042 50%, #151a30 100%)
        `
      }}
    >
      <div className="flex items-center gap-2.5 z-10">
        <span className="text-white text-[20px] font-bold tracking-tight">
          {title || "Property Portal"}
        </span>
      </div>

      <div className="flex items-center gap-5 z-10">
        {rightAction}
      </div>
    </header>
  );
};
