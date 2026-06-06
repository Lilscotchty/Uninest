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
      <div className="flex items-center justify-between mb-3 px-4 sm:px-6">
        <div>
          <h2 className="text-[18px] font-bold text-gray-900 dark:text-white leading-tight">
            Recently Viewed
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
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
          "flex gap-4 overflow-x-auto overflow-y-hidden",
          // Break out of parent padding to allow edge-to-edge scroll
          "-mx-4 px-4 sm:-mx-6 sm:px-6",
          // Hide scrollbar
          "scrollbar-hide",
          "pb-[20px]",          // avoid cutting off card shadows at bottom
          "pt-[10px]",          // avoid cutting off card shadows at top
          "items-stretch"
        ].join(" ")}
        // Desktop: scroll with mouse wheel horizontally
        onWheel={(e) => {
          if (ref.current) {
            e.preventDefault();
            ref.current.scrollLeft += e.deltaY;
          }
        }}
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
