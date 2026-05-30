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
        
        <button 
          onClick={() => showToast('Compare mode activated')}
          className="h-8 sm:h-9 px-3 rounded-xl flex items-center justify-center text-white font-semibold text-[11px] sm:text-xs cursor-pointer border border-white/25 shadow-[inset_0_0_12px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.2)] backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(120, 130, 200, 0.6) 0%, rgba(135, 100, 170, 0.5) 40%, rgba(130, 140, 90, 0.4) 100%)'
          }}
        >
          <ArrowRightLeft size={13} className="mr-1.5" /> Compare
        </button>
        
        <button 
          onClick={() => {
            if (notifications > 0) {
              showToast(`You have ${notifications} new notifications`);
              setNotifications(0);
            } else {
              showToast('No new notifications');
            }
          }}
          className="relative flex items-center justify-center p-1.5 cursor-pointer transition-transform hover:scale-110 active:scale-95"
        >
          <Bell size={20} className="text-white" strokeWidth={2.5} />
          {notifications > 0 && (
            <span className="absolute top-[2px] right-[2px] w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1c2042]"></span>
          )}
        </button>
      </div>
    </div>
  );
};

