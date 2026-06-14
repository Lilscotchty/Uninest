import React from 'react';
import { Bell, Maximize, Minimize, ArrowRightLeft, Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Header: React.FC = () => {
  const { showToast, isFullscreen, toggleFullscreen } = useAppContext();
  const [notifications, setNotifications] = React.useState(3);

  return (
    <header className="sticky top-0 z-[100] w-full bg-card-bg/90 backdrop-blur-md border-b border-border-subtle transition-colors duration-300">
      {/* max-w-screen-2xl keeps it from stretching infinitely on massive monitors */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        
        {/* LEFT: Logo */}
        <div className="flex-shrink-0 flex items-center cursor-pointer hover:opacity-80 transition-opacity">
          <span className="text-text-primary text-[22px] font-extrabold tracking-tight">
            SKY<span className="text-[var(--color-accent)]">COBE</span>
          </span>
        </div>

        {/* MIDDLE: Search Pill (Desktop Only - Airbnb Style) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div 
            onClick={() => showToast('Search opened')}
            className="w-full flex items-center bg-app-bg border border-border-subtle rounded-full pl-5 pr-2 py-2 shadow-sm hover:shadow-md hover:border-[var(--color-border-strong)] transition-all cursor-pointer group"
          >
            <span className="text-sm font-semibold text-text-primary flex-1 truncate">Anywhere</span>
            <div className="w-[1px] h-5 bg-border-subtle mx-3" />
            <span className="text-sm font-semibold text-text-primary flex-1 truncate">Any duration</span>
            <div className="w-[1px] h-5 bg-border-subtle mx-3" />
            <span className="text-sm text-text-muted flex-1 truncate">Add filters</span>
            <div className="w-8 h-8 rounded-full bg-[var(--color-button)] flex items-center justify-center ml-2 text-white group-hover:scale-105 transition-transform shadow-sm">
              <Search size={14} strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button 
            onClick={() => showToast('Compare mode activated')}
            className="hidden sm:flex items-center h-10 px-4 rounded-full text-text-primary font-semibold text-sm hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            <ArrowRightLeft size={16} className="mr-2 text-text-muted" /> Compare
          </button>

          <button 
            onClick={toggleFullscreen}
            className="w-10 h-10 rounded-full flex items-center justify-center text-text-primary hover:bg-[var(--color-surface-hover)] transition-colors"
            aria-label="Toggle fullscreen"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
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
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-text-primary hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            <Bell size={20} strokeWidth={2.2} />
            {notifications > 0 && (
              <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-[var(--color-error)] rounded-full border-2 border-card-bg"></span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};