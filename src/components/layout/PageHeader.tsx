import { useRef, useState, useEffect } from "react";
import { cn } from "../../lib/utils"; 

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
function ActionButton({ action }: { action: HeaderAction }) {
  return (
    <button
      type="button"
      aria-label={action.label}
      onClick={action.onClick}
      className={cn(
        "w-9 h-9 flex items-center justify-center rounded-xl",
        "text-gray-500 dark:text-gray-400",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "active:scale-95 transition-all duration-150",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        "dark:focus:ring-offset-gray-900"
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
function SocialButton({
  social,
}: {
  social: { icon: React.ReactNode; href: string; label: string };
}) {
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      className={cn(
        "w-9 h-9 flex items-center justify-center rounded-xl",
        // Filled dark background — matches VN's solid social icon treatment
        "bg-gray-900 dark:bg-white",
        "text-white dark:text-gray-900",
        "hover:opacity-80 active:scale-95 transition-all duration-150",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
        "border-b border-gray-100 dark:border-gray-800",
        "md:overflow-x-visible"
      )}
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
                ? "text-gray-900 dark:text-white font-semibold"
                : "text-gray-400 dark:text-gray-500 font-normal",
              "hover:text-gray-700 dark:hover:text-gray-300"
            )}
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
                  "bg-indigo-600 dark:bg-indigo-400",
                  // Width matches the text — approximate with px-1 inset
                  "w-[calc(100%-16px)]"
                )}
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

  const hasRightContent = actions.length > 0 || socialLinks.length > 0;

  return (
    <header
      className={cn(
        // Positioning
        sticky ? "sticky top-0 z-40" : "relative",

        // Colours
        "bg-white dark:bg-gray-900",

        // Scroll-triggered border
        scrolled
          ? "border-b border-gray-200 dark:border-gray-800 shadow-sm shadow-gray-100/50 dark:shadow-black/20"
          : "border-b border-transparent",

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
      {(title || hasRightContent) && (
        <div className="flex items-center justify-between mb-1">
          {/* Title — bold, large, left-aligned */}
          {title ? (
            <h1
              className={cn(
                "text-[26px] sm:text-[28px] lg:text-[30px] font-bold leading-tight tracking-tight",
                "text-gray-900 dark:text-white",
                // If no title, allow right content to take full width
                hasRightContent ? "flex-1 min-w-0 mr-3" : "flex-1"
              )}
            >
              {title}
            </h1>
          ) : (
            // Pattern B: spacer so icons push to the right even without a title
            <div className="flex-1" aria-hidden />
          )}

          {/* Right side — icon actions OR social icons (never both) */}
          <div className="flex items-center gap-1 flex-shrink-0">
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
