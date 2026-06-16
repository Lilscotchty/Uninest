import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Compass, Heart, User } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Navigation() {
  const { user, profile, isSidebarOpen } = useAppContext();

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
      {/* MOBILE: Bottom Tab Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 
                      bg-card-bg border-t border-border-subtle 
                      pt-2 pb-[max(env(safe-area-inset-bottom),1rem)]"
      >
        <div className="flex items-center justify-around h-16">
          {currentNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors",
                  isActive ? "text-[var(--color-accent)]" : "text-text-muted",
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* TABLET: Collapsed Sidebar (icon only) */}
      <nav
        className={`hidden md:flex lg:hidden fixed left-0 top-[72px] bottom-0 z-40 
                      w-[72px] flex-col items-center transition-transform duration-300
                      bg-card-bg border-r border-border-subtle py-4 gap-1 ${
                        !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'
                      }`}
      >
        {currentNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={item.label}
            className={({ isActive }) =>
              cn(
                "w-12 h-12 flex items-center justify-center rounded-xl transition-colors",
                isActive
                  ? "bg-[var(--color-accent-muted)] text-[var(--color-accent)]"
                  : "text-text-muted hover:bg-border-subtle",
              )
            }
          >
            <item.icon className="w-6 h-6" />
          </NavLink>
        ))}
        <div className="mt-auto mb-4">
          <NavLink
            to="/profile"
            className="w-10 h-10 rounded-full bg-border-subtle flex items-center justify-center text-text-primary overflow-hidden"
          >
            <User className="w-5 h-5" />
          </NavLink>
        </div>
      </nav>

      {/* DESKTOP: Full Sidebar with labels */}
      <nav
        className={`hidden lg:flex fixed left-0 top-[72px] bottom-0 z-40 
                      w-60 flex-col transition-transform duration-300
                      bg-card-bg border-r border-border-subtle py-4 px-3 ${
                        !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'
                      }`}
      >
        <div className="flex-1 space-y-1">
          {currentNavItems.map((item) => (
            <NavLink
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
        </div>
        <div className="border-t border-border-subtle pt-4 px-1 pb-4">
          <NavLink
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
