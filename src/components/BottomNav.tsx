import { useNavigate, useLocation } from "react-router-dom";
import React from 'react';
import { HiHome, HiSearch, HiBookmark, HiUser } from 'react-icons/hi';
import { useAppContext } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', path: '/student/dashboard', icon: HiHome, label: 'Home' },
    { id: 'explore', path: '/explore', icon: HiSearch, label: 'Explore' },
    { id: 'saved', path: '/saved', icon: HiBookmark, label: 'Saved' },
    { id: 'profile', path: '/profile', icon: HiUser, label: 'Profile' }
  ];

  return (
    <div className="absolute bottom-0 w-full bg-card-bg flex justify-around items-center border-t border-transparent z-[9999] h-[52px] px-2 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]">
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = location.pathname.startsWith(item.path);
        
        return (
          <button 
            key={item.id}
            onClick={() => navigate(item.path)}
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
                size={22} 
                // @ts-ignore
                className={isActive ? "text-text-primary" : "text-text-muted"} 
              />
              <span className={`text-[13px] mt-0.5 ${isActive ? 'font-semibold text-text-primary' : 'font-medium text-text-muted'}`}>
                {item.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
