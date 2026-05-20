import React from 'react';
import { Home, Search, Bookmark, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView } = useAppContext();

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'explore', icon: Search, label: 'Explore' },
    { id: 'saved', icon: Bookmark, label: 'Saved' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="absolute bottom-0 w-full bg-card-bg flex justify-around items-center border-t border-border-subtle z-[9999] h-[52px] px-2 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = currentView === item.id;
        
        return (
          <button 
            key={item.id}
            onClick={() => setCurrentView(item.id as any)}
            className="relative flex flex-col items-center justify-center w-[72px] h-full outline-none group"
          >
            {/* Active Top Bar Indicator */}
            {isActive && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[2.5px] bg-text-primary rounded-b-[2px]" />
            )}
            
            <div className={`flex flex-col items-center justify-center pt-[2px] transition-colors ${
              isActive 
                ? 'text-text-primary' 
                : 'text-text-muted hover:text-text-primary/70'
            }`}>
              <IconComponent 
                size={20} 
                strokeWidth={isActive ? 2.5 : 2} 
                className={isActive ? "fill-text-primary" : "fill-text-muted"} 
              />
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-semibold text-text-primary' : 'font-medium text-text-muted'}`}>
                {item.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
