import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Compass, Heart, User, Bell, MessageSquare, Settings, HelpCircle, Map, Plus } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Navigation() {
  const { user, profile, isSidebarOpen, toggleSidebar } = useAppContext();

  const role = profile?.role || user?.user_metadata?.account_type || "student";
  const isManager =
    role === "manager" ||
    role === "accommodation_owner" ||
    role === "property_owner";

  if (!user) return null;

  const getNavItems = () => [
    {
      path: "/student/dashboard",
      icon: Home,
      label: "Home",
    },
    { path: "/explore", icon: Compass, label: "Explore" },
    { path: "/saved", icon: Heart, label: "Saved" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const currentNavItems = getNavItems();

  return (
    <>
      {/* MOBILE: Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-[max(env(safe-area-inset-bottom),1rem)] left-0 right-0 z-50 flex justify-center items-center gap-4 px-4 pointer-events-none">
        
        {/* Navigation Bar */}
        <nav className="bg-card-bg/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] dark:shadow-black/20 w-[240px] h-[55px] flex items-center justify-center pointer-events-auto shrink-0">
          <div className="bg-app-bg w-[240px] h-[52px] rounded-[50px] flex items-center justify-center gap-1 px-1">
            {currentNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-center rounded-full transition-all duration-200 shrink-0 overflow-hidden",
                    isActive
                      ? "h-[40px] w-[80px] px-3 bg-[var(--color-accent)]/15 text-[var(--color-accent)] gap-1.5"
                      : "h-[44px] w-[44px] text-text-muted hover:bg-border-subtle"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="relative flex items-center justify-center">
                      {item.label === "Profile" ? (
                        <img 
                          src={profile?.avatar_url || "https://i.pravatar.cc/150?img=11"}
                          alt="Profile" 
                          className="w-[18px] h-[18px] rounded-full object-cover shrink-0" 
                        />
                      ) : (
                        <item.icon
                          className="shrink-0 transition-colors duration-200"
                          size={18}
                          strokeWidth={isActive ? 2.5 : 1.8}
                        />
                      )}
                      {/* Badge Example */}
                      {item.label === "Saved" && (
                        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[14px] h-[14px] px-[3px] text-[9px] font-bold text-white rounded-full border-[1.5px] border-app-bg bg-[var(--color-accent)] shadow-sm">
                          3
                        </span>
                      )}
                    </div>
                    
                    {isActive && (
                      <span className="text-[11px] font-semibold tracking-wide whitespace-nowrap block" style={{ display: 'block' }}>
                        {item.label}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Floating Action Button (FAB) */}
        <button className="w-[3.25rem] h-[3.25rem] rounded-full bg-gradient-to-tr from-[var(--color-accent)] to-[var(--color-accent)]/70 shadow-[0_12px_24px_-8px_var(--color-accent)] flex items-center justify-center text-white shrink-0 transition-transform duration-150 hover:scale-105 active:scale-95 pointer-events-auto">
          <Plus size={22} strokeWidth={2} />
        </button>

      </div>

      {/* ALL OVERLAYS */}
      {isSidebarOpen && (
        <div 
          className="hidden md:block fixed inset-0 bg-black/30 backdrop-blur-sm z-[90] transition-opacity" 
          onClick={toggleSidebar}
        />
      )}

      {/* DESKTOP/TABLET: Floating Sidebar */}
      <nav
        className={`hidden md:flex fixed left-4 top-[88px] bottom-6 z-[95] 
                      w-64 flex-col transition-all duration-300 rounded-2xl shadow-2xl
                      bg-card-bg border border-border-subtle py-4 px-3 overflow-y-auto ${
                        !isSidebarOpen ? '-translate-x-[120%] opacity-0' : 'translate-x-0 opacity-100'
                      }`}
      >
        <div className="flex-1 space-y-1">
          <div className="px-3 pb-2 pt-1 text-xs font-bold text-text-muted uppercase tracking-wider">
            Main Menu
          </div>
          {currentNavItems.map((item) => (
            <NavLink
              onClick={toggleSidebar}
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium",
                  isActive
                    ? "bg-[var(--color-accent-muted)] text-[var(--color-accent)]"
                    : "text-text-primary hover:bg-border-subtle",
                )
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}

          <div className="px-3 pt-6 pb-2 text-xs font-bold text-text-muted uppercase tracking-wider">
            Shortcuts
          </div>
          {[
             { path: '/notifications', icon: Bell, label: 'Notifications' },
             { path: '/messages', icon: MessageSquare, label: 'Messages' },
             { path: '/settings', icon: Settings, label: 'Settings' },
             { path: '/support', icon: HelpCircle, label: 'Help & Support' },
             { path: '/campus-guide', icon: Map, label: 'Campus Guide' }
          ].map((item) => (
            <NavLink
              onClick={toggleSidebar}
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm font-medium text-text-primary hover:bg-border-subtle"
                )
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0 opacity-70" />
              {item.label}
            </NavLink>
          ))}
        </div>
        
        <div className="border-t border-border-subtle pt-4 px-1 mt-4">
          <NavLink
            onClick={toggleSidebar}
            to="/profile"
            className="flex items-center gap-3 px-2 py-2 hover:bg-border-subtle rounded-xl transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-border-subtle flex items-center justify-center text-text-muted overflow-hidden flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-text-primary truncate">
                {user?.user_metadata?.first_name || "Student"}
              </span>
              <span className="text-xs text-text-muted truncate">
                View Profile
              </span>
            </div>
          </NavLink>
        </div>
      </nav>
    </>
  );
}
