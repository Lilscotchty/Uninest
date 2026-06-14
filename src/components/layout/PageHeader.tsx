import React, { useRef, useState, useEffect } from "react";
import { cn } from "../../lib/utils"; 
import { ChevronLeft } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeaderTab {
  id: string;
  label: string;
}

export interface HeaderAction {
  /** lucide-react or any ReactNode icon */
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export interface PageHeaderProps {
  /**
   * The bold left-aligned page title.
   * Omit entirely for Pattern B (icon-only header).
   */
  title?: string;
  
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;

  /**
   * Right-side icon action buttons (Pattern A & B).
   * Max 3 recommended.
   */
  actions?: HeaderAction[];

  /**
   * Horizontal scrollable tab bar below the title row (Pattern A).
   * Omit for Pattern B & C.
   */
  tabs?: HeaderTab[];

  /** Currently active tab id — required if tabs are provided */
  activeTab?: string;

  /** Called when a tab is tapped */
  onTabChange?: (tabId: string) => void;

  /**
   * Social icon links (Pattern C).
   * Rendered as filled icon buttons on the right.
   * Omit for Pattern A & B.
   */
  socialLinks?: {
    icon: React.ReactNode;
    href: string;
    label: string;
  }[];

  /** Adds a sticky border-bottom when the page is scrolled */
  sticky?: boolean;

  className?: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Single icon action button — top-right area */
const ActionButton: React.FC<{ action: HeaderAction }> = ({ action }) => {
  return (
    <button
      type="button"
      aria-label={action.label}
      onClick={action.onClick}
      style={{ color: 'var(--color-text-secondary)' }}
      className={cn(
        "w-9 h-9 flex items-center justify-center rounded-xl",
        "active:scale-95 transition-all duration-150",
        "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2",
      )}
    >
      {/* Icons should be 22–24px, stroke-based */}
      <span className="w-[22px] h-[22px] flex items-center justify-center">
        {action.icon}
      </span>
    </button>
  );
}

/** Filled social icon button — Pattern C */
const SocialButton: React.FC<{
  social: { icon: React.ReactNode; href: string; label: string };
}> = ({ social }) => {
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      style={{ backgroundColor: 'var(--color-text-primary)', color: 'var(--color-bg)' }}
      className={cn(
        "w-9 h-9 flex items-center justify-center rounded-xl",
        "hover:opacity-80 active:scale-95 transition-all duration-150",
        "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2"
      )}
    >
      <span className="w-[18px] h-[18px] flex items-center justify-center text-[18px]">
        {social.icon}
      </span>
    </a>
  );
}

/** Scrollable tab bar — Pattern A */
function TabBar({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: HeaderTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll active tab into view on mount and on tab change
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeTab]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex gap-0 overflow-x-auto",
        // Hide scrollbar visually — tabs still scroll via touch/mouse
        "scrollbar-hide",
        // Negative horizontal margin to break out of parent padding,
        // then re-add with px so first/last tabs sit flush with the title
        "-mx-4 px-4 sm:-mx-6 sm:px-6",
        "border-b",
        "md:overflow-x-visible"
      )}
      style={{ borderBottomColor: 'var(--color-border)' }}
      // Allow horizontal scroll with mouse wheel on desktop
      onWheel={(e) => {
        if (scrollRef.current) {
          e.preventDefault();
          scrollRef.current.scrollLeft += e.deltaY;
        }
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            ref={isActive ? activeRef : null}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex-shrink-0",
              "px-3 py-3",         // comfortable tap target
              "text-[14px] leading-none whitespace-nowrap",
              "transition-colors duration-150",
              "focus:outline-none",
              isActive
                ? "font-semibold"
                : "font-normal",
            )}
            style={{ color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}
            aria-selected={isActive}
            role="tab"
          >
            {tab.label}

            {/* Active underline pill — indigo, flush to bottom, text-width */}
            {isActive && (
              <span
                className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2",
                  "h-[2.5px] rounded-full",
                  // Width matches the text — approximate with px-1 inset
                  "w-[calc(100%-16px)]"
                )}
                style={{ backgroundColor: 'var(--color-accent)' }}
                aria-hidden
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PageHeader({
  title,
  showBackButton,
  onBack,
  rightAction,
  actions = [],
  tabs,
  activeTab,
  onTabChange,
  socialLinks = [],
  sticky = true,
  className,
}: PageHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  // Detect page scroll to add border-bottom shadow
  useEffect(() => {
    if (!sticky) return;
    const handler = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [sticky]);

  const hasRightContent = actions.length > 0 || socialLinks.length > 0 || !!rightAction;

  return (
    <header
      style={{ backgroundColor: 'var(--color-header-bg)', borderBottomColor: scrolled ? 'var(--color-border)' : 'transparent' }}
      className={cn(
        // Positioning
        sticky ? "sticky top-0 z-40" : "relative",

        // Scroll-triggered border
        scrolled ? "border-b shadow-sm" : "border-b border-transparent",

        // Spacing
        "px-4 sm:px-6",
        "pt-4",
        !tabs ? "pb-4" : "pb-0",   // tabs extend to the bottom of header

        // Transition
        "transition-shadow duration-200",

        className
      )}
    >
      {/* ── Top row: Title + Actions ── */}
      {(title || hasRightContent || showBackButton) && (
        <div className="flex items-center justify-between mb-1">
          {/* Title — bold, large, left-aligned */}
          <div className="flex items-center gap-4 flex-1 min-w-0 mr-3">
            {showBackButton && (
              <button
                onClick={onBack}
                className="w-10 h-10 shrink-0 rounded-full border border-[var(--color-border)] bg-[var(--color-card-bg)] flex items-center justify-center text-[var(--color-text-primary)] shadow-sm hover:scale-105 transition-transform"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {title && (
              <h1
                style={{ color: 'var(--color-text-primary)' }}
                className={cn(
                  "text-[26px] sm:text-[28px] lg:text-[30px] font-bold leading-tight tracking-tight truncate",
                )}
              >
                {title}
              </h1>
            )}
          </div>

          {/* Right side — icon actions OR social icons (never both) */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {rightAction}
            {actions.map((action) => (
              <ActionButton key={action.label} action={action} />
            ))}
            {socialLinks.map((social) => (
              <SocialButton key={social.label} social={social} />
            ))}
          </div>
        </div>
      )}

      {/* ── Tab bar row ── */}
      {tabs && activeTab !== undefined && onTabChange && (
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      )}
    </header>
  );
}
