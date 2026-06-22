import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Compass, Heart, User, Bell, MessageSquare, Settings, HelpCircle, Map } from "lucide-react";
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
      path: isManager ? "/manager/dashboard" : "/student/dashboard",
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
      {/* MOBILE: Bottom Tab Bar (iPhone Capsule Style) */}
      <nav
        className="md:hidden fixed bottom-[max(env(safe-area-inset-bottom,16px),16px)] left-1/2 -translate-x-1/2 z-[100] 
                   w-[calc(100%-32px)] max-w-[360px] h-[68px] px-2
                   bg-[var(--color-surface)]/85 backdrop-blur-xl border border-[var(--color-border)]/60
                   rounded-[34px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-between"
      >
        {currentNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "relative flex flex-col items-center justify-center flex-1 h-full rounded-full transition-all duration-300 group",
                isActive 
                  ? "text-[var(--color-accent)]" 
                  : "text-text-muted hover:text-text-primary",
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "absolute inset-0 m-auto w-12 h-12 rounded-full transition-all duration-300 ease-out -z-10",
                  isActive ? "bg-[var(--color-accent)]/15 scale-100" : "scale-50 opacity-0 bg-transparent group-hover:bg-[var(--color-border)]/50 group-hover:scale-100 group-hover:opacity-100"
                )} />
                <item.icon 
                  className={cn("w-6 h-6 transition-all duration-300 ease-out", isActive ? "-translate-y-2" : "translate-y-0")} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                <span 
                  className={cn(
                    "absolute bottom-2.5 text-[10px] font-bold transition-all duration-300 ease-out tracking-wide", 
                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  )}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

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
