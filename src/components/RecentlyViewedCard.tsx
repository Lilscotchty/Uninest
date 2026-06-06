import { useNavigate } from "react-router-dom";
import { useRecentlyViewed, type RecentlyViewedItem } from "../hooks/useRecentlyViewed";
import { useAppContext } from "../context/AppContext";

interface Props {
  item: RecentlyViewedItem;
}

export function RecentlyViewedCard({ item }: Props) {
  const navigate          = useNavigate();
  const { recordView }    = useRecentlyViewed();
  const { properties, setSelectedPropertyId } = useAppContext();

  const formattedPrice = new Intl.NumberFormat("en-GH", {
    style:    "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(item.price);

  const matchedProperty = properties.find(p => p.id?.toString() === item.id?.toString());
  const displayImage = matchedProperty?.img || item.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2400&auto=format&fit=crop";

  const handleClick = () => {
    recordView(item);                          // refresh viewedAt timestamp
    setSelectedPropertyId(item.id);
    navigate(`/details`);            // existing hostel detail route - using property in this app
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
        "border border-white/60",
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
          (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2400&auto=format&fit=crop";
        }}
      />

      {/* ── Glassmorphism overlay ── */}
      <div
        className={[
          "absolute bottom-0 left-0 w-full",
          "min-h-[45%]",
          // Gradient — from-black/20 → to-black/60 (bottom heavy)
          "bg-gradient-to-b from-black/20 to-black/60",
          // Blur
          "backdrop-blur-[12px] [-webkit-backdrop-filter:blur(12px)]",
          // Top edge highlight
          "border-t border-white/25",
          // Layout
          "flex flex-col justify-end",
          "p-2 box-border z-10",
        ].join(" ")}
      >
        {/* Hostel name */}
        <h3
          className="m-0 mb-0.5 text-white font-semibold leading-tight tracking-[0.2px] truncate"
          style={{ fontSize: "0.80rem", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
        >
          {item.name}
        </h3>

        {/* Price + separator + location */}
        <p
          className="m-0 text-white/90 font-medium flex items-center gap-1 truncate"
          style={{ fontSize: "0.65rem" }}
        >
          <span className="font-bold text-[#ffd700]">
            {formattedPrice}/sem
          </span>
          <span className="text-white/50" style={{ fontSize: "0.5rem" }}>•</span>
          <span className="opacity-85 truncate">{item.location}</span>
        </p>
      </div>
    </div>
  );
}
