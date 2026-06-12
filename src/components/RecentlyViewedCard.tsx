import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecentlyViewed, type RecentlyViewedItem } from "../hooks/useRecentlyViewed";
import { Briefcase, MapPin } from "lucide-react";

interface Props {
  item: RecentlyViewedItem;
}

export const RecentlyViewedCard: React.FC<Props> = ({ item }) => {
  const navigate          = useNavigate();
  const { recordView }    = useRecentlyViewed();

  const displayImage = item.image_url || "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2400&auto=format&fit=crop";

  const handleClick = () => {
    recordView(item);                          // refresh viewedAt timestamp
    navigate(`/opportunities`);                // currently navigating to opportunities page where everything lives
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      aria-label={`View ${item.name}`}
      className={[
        // Dimensions — exact from HTML spec
        "relative w-[160px] h-[120px]",
        "rounded-[14px] overflow-hidden",
        // Border
        "border border-black/5 dark:border-white/10",
        // Shadow
        "shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
        // Hover
        "hover:-translate-y-1",
        "hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)]",
        // Group for image zoom
        "group cursor-pointer",
        // Transition
        "transition-all duration-300",
        // Flex shrink — never compress in horizontal scroll
        "flex-shrink-0",
      ].join(" ")}
    >
      {/* ── Image ── */}
      <div className="absolute inset-0 bg-slate-900/10 z-[1] group-hover:bg-transparent transition-colors duration-300"></div>
      <img
        src={displayImage}
        alt={item.name}
        className={[
          "w-full h-full object-cover block",
          "transition-transform duration-500",
          "group-hover:scale-[1.08]",
        ].join(" ")}
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2400&auto=format&fit=crop";
        }}
      />

      {/* ── Glassmorphism overlay ── */}
      <div
        className={[
          "absolute inset-x-0 bottom-0",
          "min-h-[50%]",
          // Gradient — from-black/0 → to-black/80 (bottom heavy)
          "bg-gradient-to-b from-transparent via-black/40 to-black/80",
          // Layout
          "flex flex-col justify-end",
          "p-2.5 box-border z-10",
        ].join(" ")}
      >
        {/* Company Sector Badge */}
        {item.sector && (
          <div className="mb-1 w-fit flex items-center">
            <span className="text-[0.55rem] font-bold text-white bg-[var(--color-accent)]/80 backdrop-blur-sm px-1.5 py-0.5 rounded uppercase tracking-wide">
              {item.sector}
            </span>
          </div>
        )}

        {/* Company name */}
        <h3
          className="m-0 mb-0.5 text-white font-bold leading-tight tracking-[0.2px] truncate"
          style={{ fontSize: "0.85rem", textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
        >
          {item.name}
        </h3>

        {/* Location */}
        <p
          className="m-0 text-white/90 font-medium flex items-center gap-1.5 truncate"
          style={{ fontSize: "0.65rem", textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
        >
          <MapPin size={10} className="text-white/80 shrink-0" />
          <span className="opacity-90 truncate">{item.location}</span>
        </p>
      </div>
    </div>
  );
}
