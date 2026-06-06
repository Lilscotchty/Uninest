import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Clock } from "lucide-react";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import { RecentlyViewedCard } from "../components/RecentlyViewedCard";

// Format relative time: "2 hours ago", "3 days ago"
function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (days  > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins  > 0) return `${mins}m ago`;
  return "Just now";
}

// Group items by day: "Today", "Yesterday", "Mon 2 Jun"
function groupByDay(items: ReturnType<typeof useRecentlyViewed>["allItems"]) {
  const groups: Record<string, typeof items> = {};
  const now   = new Date();
  const today = now.toDateString();
  const yesterday = new Date(now.getTime() - 86400000).toDateString();

  for (const item of items) {
    const d   = new Date(item.viewedAt).toDateString();
    const key = d === today
      ? "Today"
      : d === yesterday
        ? "Yesterday"
        : new Date(item.viewedAt).toLocaleDateString("en-GB", {
            weekday: "short", day: "numeric", month: "short",
          });
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
}

export function RecentlyViewedPage() {
  const navigate                       = useNavigate();
  const { allItems, hasItems, clearHistory } = useRecentlyViewed();

  const groups = groupByDay(allItems);

  return (
    <div className="min-h-screen bg-offwhite dark:bg-customDark">
      {/* ── Sticky header ── */}
      <header
        className={[
          "sticky top-0 z-40",
          "bg-white dark:bg-[#1a1a24]",
          "border-b border-border-subtle dark:border-border-dark",
          "px-4 sm:px-6",
          "h-[72px] flex items-center justify-between",
        ].join(" ")}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className={[
              "w-10 h-10 rounded-full flex items-center justify-center",
              "border border-border-subtle dark:border-border-dark",
              "hover:bg-gray-50 dark:hover:bg-gray-800",
              "text-text-secondary dark:text-gray-400 transition-colors",
            ].join(" ")}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-primary dark:text-white leading-tight">
              Recently Viewed
            </h1>
            {hasItems && (
              <p className="text-xs text-text-secondary dark:text-gray-400">
                {allItems.length} {allItems.length === 1 ? "property" : "properties"}
              </p>
            )}
          </div>
        </div>

        {hasItems && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Clear your entire viewing history?")) clearHistory();
            }}
            aria-label="Clear history"
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
              "text-xs font-medium text-red-500",
              "border border-red-200 dark:border-red-900/50",
              "hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
            ].join(" ")}
          >
            <Trash2 size={13} />
            Clear all
          </button>
        )}
      </header>

      {/* ── Empty state ── */}
      {!hasItems && (
        <div className="flex flex-col items-center justify-center text-center py-24 px-6">
          <div
            className={[
              "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
              "bg-gray-100 dark:bg-gray-800",
            ].join(" ")}
          >
            <Clock size={28} className="text-gray-300 dark:text-gray-600" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary dark:text-gray-300 mb-2">
            No history yet
          </h2>
          <p className="text-sm text-text-secondary dark:text-gray-500 max-w-xs">
            Properties you view will appear here so you can easily find them again.
          </p>
          <button
            type="button"
            onClick={() => navigate("/explore")}
            className={[
              "mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold text-white",
              "bg-primary",
              "hover:bg-primary-hover transition-colors",
            ].join(" ")}
          >
            Browse properties
          </button>
        </div>
      )}

      {/* ── Grouped grid ── */}
      {hasItems && (
        <div className="px-4 sm:px-6 py-6 pb-24 md:pb-8 space-y-8 max-w-screen-xl mx-auto min-h-screen">
          {Object.entries(groups).map(([day, dayItems]) => (
            <section key={day}>
              {/* Day label */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold text-text-secondary dark:text-gray-400 uppercase tracking-wider">
                  {day}
                </span>
                <div className="flex-1 h-px bg-border-subtle dark:bg-border-dark" />
                <span className="text-[11px] text-text-secondary dark:text-gray-500">
                  {dayItems.length} {dayItems.length === 1 ? "property" : "properties"}
                </span>
              </div>

              {/* Responsive grid of cards */}
              <div
                className={[
                  "grid gap-4",
                  // On mobile: 2 columns of 160px cards
                  "grid-cols-2",
                  // Tablet: 3 cols
                  "sm:grid-cols-3",
                  // Desktop: 4 cols
                  "md:grid-cols-4",
                  // Wide desktop: 5 cols
                  "lg:grid-cols-5",
                  "xl:grid-cols-6",
                ].join(" ")}
              >
                {dayItems.map((item) => (
                  <div key={item.id} className="flex flex-col gap-1.5 items-center w-full">
                    <div className="w-full max-w-[160px]">
                      <RecentlyViewedCard item={item} />
                      {/* Time since viewed */}
                      <span className="text-[10.px] text-text-secondary dark:text-gray-400 pl-1 mt-1 block">
                        {timeAgo(item.viewedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
export default RecentlyViewedPage;
