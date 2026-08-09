import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, Heart, User, Bell, MessageSquare, Settings, HelpCircle, Map, Plus } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import "../../pages/MobileHome.css";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Navigation() {
  const { user, profile, isSidebarOpen, toggleSidebar } = useAppContext();
  const navigate = useNavigate();

  const CustomHomeIcon = ({ isActive, className }: { isActive: boolean, className?: string }) => (
    <svg 
      className={className}
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill={isActive ? 'currentColor' : 'none'}
      stroke={isActive ? 'none' : 'currentColor'}
      strokeWidth={isActive ? '0' : '1.8'}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.5a2.5 2.5 0 00-1.6.58l-6.5 5.3A2.5 2.5 0 003 10.3V18a3 3 0 003 3h12a3 3 0 003-3v-7.7a2.5 2.5 0 00-.9-1.92l-6.5-5.3a2.5 2.5 0 00-1.6-.58z"></path>
      {isActive && (
        <rect x="9.5" y="14" width="5" height="2" rx="1" fill="var(--color-app-bg, #f4f4f4)" className="home-cutout"></rect>
      )}
    </svg>
  );

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
