import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react"; 
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
    <section className="mt-2 mb-2 max-w-screen-2xl mx-auto w-full">
      {/* ── Section header ── */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 pb-3">
        <div>
          <h2 className="text-[1.05rem] sm:text-[1.2rem] font-semibold tracking-tight text-[var(--color-heading)] leading-tight">
            Recently Viewed
          </h2>
          <p className="text-[0.75rem] sm:text-xs text-text-secondary mt-0.5 font-medium">
            Pick up where you left off
          </p>
        </div>

        {hasMore && (
          <button
            type="button"
            onClick={() => navigate("/recently-viewed")}
            className="text-sm font-semibold text-[var(--color-accent)] cursor-pointer tracking-tight hover:text-[var(--color-accent-hover)] transition-colors flex items-center gap-1 group"
          >
            See all <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* ── Scrollable card row ── */}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 hide-scrollbar pb-4 pt-2 items-stretch"
      >
        {stripItems.map((item) => (
          <div key={item.id}>
            <RecentlyViewedCard item={item} />
          </div>
        ))}

        {/* ── Premium "See more" end-cap card ── */}
        {hasMore && (
          <button
            type="button"
            onClick={() => navigate("/recently-viewed")}
            className="flex-shrink-0 w-[160px] rounded-2xl border-2 border-dashed border-border-subtle bg-transparent flex flex-col items-center justify-center gap-3 text-text-secondary hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-surface-hover)] transition-all duration-300 group shadow-none"
          >
            <div className="w-10 h-10 rounded-full bg-card-bg group-hover:bg-[var(--color-accent-muted)] flex items-center justify-center transition-colors shadow-sm">
              <ArrowRight size={18} className="group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[0.85rem] font-bold tracking-wide">
              View {allItems.length - 7} More
            </span>
          </button>
        )}
      </div>
    </section>
  );
}