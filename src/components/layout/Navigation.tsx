import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, User } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

const NAV_ITEMS = [
  { path: '/student/dashboard', icon: Home, label: 'Home' },
  { path: '/explore', icon: Compass, label: 'Explore' },
  { path: '/saved', icon: Heart, label: 'Saved' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export function Navigation() {
  const { user } = useAppContext();
  
  if (!user || user.user_metadata?.account_type === 'manager') {
    return null;
  }

  return (
    <>
      {/* MOBILE: Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 
                      bg-card-bg border-t border-border-subtle 
                      pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        <div className="flex items-center justify-around h-16">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors",
                isActive ? "text-[var(--color-accent)]" : "text-text-muted"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* TABLET: Collapsed Sidebar (icon only) */}
      <nav className="hidden md:flex lg:hidden fixed left-0 top-0 bottom-0 z-40 
                      w-18 flex-col items-center 
                      bg-card-bg border-r border-border-subtle py-4 gap-1">
        <div className="mb-6 font-bold text-xl text-[var(--color-accent)] flex items-center justify-center w-full h-12">
          U
        </div>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            title={item.label}
            className={({ isActive }) => cn(
              "w-12 h-12 flex items-center justify-center rounded-xl transition-colors",
              isActive ? "bg-[var(--color-accent-muted)] text-[var(--color-accent)]" : "text-text-muted hover:bg-border-subtle"
            )}
          >
            <item.icon className="w-6 h-6" />
          </NavLink>
        ))}
        <div className="mt-auto mb-4">
          <div className="w-10 h-10 rounded-full bg-border-subtle flex items-center justify-center text-text-primary overflow-hidden">
            <User className="w-5 h-5"/>
          </div>
        </div>
      </nav>

      {/* DESKTOP: Full Sidebar with labels */}
      <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 z-40 
                      w-60 flex-col 
                      bg-card-bg border-r border-border-subtle py-4 px-3">
        <div className="mb-8 px-3 font-bold text-2xl text-[var(--color-accent)] flex items-center text-left w-full h-12">
          <span className="font-bold tracking-widest">SKY<span style={{ color: '#e8b96a' }}>COBE</span></span>
        </div>
        <div className="flex-1 space-y-1">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium",
                isActive 
                  ? "bg-[var(--color-accent-muted)] text-[var(--color-accent)]" 
                  : "text-text-primary hover:bg-border-subtle"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="border-t border-border-subtle pt-4 px-1 pb-4">
          <NavLink to="/profile" className="flex items-center gap-3 px-2 py-2 hover:bg-border-subtle rounded-xl transition-colors">
            <div className="w-10 h-10 rounded-full bg-border-subtle flex items-center justify-center text-text-muted overflow-hidden flex-shrink-0">
               <User className="w-5 h-5"/>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-text-primary truncate">{user.user_metadata?.first_name || 'Student'}</span>
              <span className="text-xs text-text-muted truncate">View Profile</span>
            </div>
          </NavLink>
        </div>
      </nav>
    </>
  );
}
