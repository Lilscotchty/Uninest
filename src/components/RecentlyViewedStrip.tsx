import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";
import { RecentlyViewedCard } from "./RecentlyViewedCard";

export function RecentlyViewedStrip() {
  const { stripItems, hasItems, allItems } = useRecentlyViewed();
  const navigate  = useNavigate();
  const ref       = useRef<HTMLDivElement>(null);

  // ── Hidden when no cards have been viewed yet ─────────────────────────────
  if (!hasItems) return null;

  const hasMore = allItems.length > 7;

  return (
    <section className="w-full">
      {/* ── Section header ── */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-4 pb-3">
        <div>
          <h2 className="font-montserrat text-[0.9rem] sm:text-[1.1rem] font-black tracking-tight text-text-primary leading-tight">
            Recently Viewed
          </h2>
          <p className="text-[0.75rem] sm:text-xs text-text-muted mt-0.5">
            Pick up where you left off
          </p>
        </div>

        {hasMore && (
          <button
            type="button"
            onClick={() => navigate("/recently-viewed")}
            className={[
              "flex items-center gap-1 text-xs font-semibold",
              "text-indigo-600 dark:text-indigo-400",
              "hover:underline active:opacity-70 transition-opacity",
            ].join(" ")}
          >
            See all
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* ── Scrollable card row ── */}
      <div
        ref={ref}
        className={[
          "flex gap-4 overflow-x-auto",
          "px-4 sm:px-5",
          // Hide scrollbar
          "hide-scrollbar",
          "pb-4",          // match other sections padding
          "pt-2",          // match other sections padding
          "items-stretch"
        ].join(" ")}
      >
        {stripItems.map((item) => (
          <RecentlyViewedCard key={item.id} item={item} />
        ))}

        {/* ── "See more" end-cap card ── */}
        {hasMore && (
          <button
            type="button"
            onClick={() => navigate("/recently-viewed")}
            className={[
              "flex-shrink-0 w-[160px] h-[120px] rounded-[14px]",
              "border border-dashed border-gray-300 dark:border-gray-600",
              "flex flex-col items-center justify-center gap-1",
              "text-gray-400 dark:text-gray-500",
              "hover:border-indigo-400 hover:text-indigo-500",
              "transition-all duration-200",
            ].join(" ")}
          >
            <ChevronRight size={20} />
            <span className="text-[0.65rem] font-medium">
              {allItems.length - 7} more
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
