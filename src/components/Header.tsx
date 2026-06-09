import React from 'react';
import { Bell, Maximize, Minimize, ArrowRightLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Header: React.FC = () => {
  const { showToast, isFullscreen, toggleFullscreen } = useAppContext();
  const [notifications, setNotifications] = React.useState(3);

  return (
    <div 
      className="w-full h-[72px] flex justify-between items-center px-4 sm:px-6 sticky top-0 z-[100] bg-[#0b1021] shadow-sm"
    >
      <div className="flex items-center gap-2 z-[2]">
        <span className="text-white text-[24px] font-bold tracking-[-0.5px]">SKY<span style={{ color: '#e8b96a' }}>COBE</span></span>
      </div>
        
      <div className="flex items-center gap-2.5 sm:gap-3 z-[2]">
        <button 
          onClick={toggleFullscreen}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-white cursor-pointer border border-white/25 shadow-[inset_0_0_12px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.2)] backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(120, 130, 200, 0.4) 0%, rgba(135, 100, 170, 0.3) 40%, rgba(130, 140, 90, 0.2) 100%)'
          }}
        >
          {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
        </button>
      </div>
    </div>
  );
};

