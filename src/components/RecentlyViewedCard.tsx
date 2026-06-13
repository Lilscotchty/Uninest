import { useNavigate } from "react-router-dom";
import { useRecentlyViewed, type RecentlyViewedItem } from "../hooks/useRecentlyViewed";
import { useAppContext } from "../context/AppContext";
import { MapPin } from "lucide-react";

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
    navigate(`/details`);            // navigate to hostel details
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      aria-label={`View ${item.name}`}
      className="relative w-[140px] sm:w-[150px] aspect-square rounded-2xl overflow-hidden border border-border-subtle shadow-sm group cursor-pointer transition-all duration-300 flex-shrink-0 isolate hover:-translate-y-1.5 hover:shadow-md hover:border-[var(--color-accent-muted)]"
    >
      {/* ── Background Image ── */}
      <img
        src={displayImage}
        alt={item.name}
        className="w-full h-full object-cover block transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2400&auto=format&fit=crop";
        }}
      />

      {/* ── Floating Price Badge (Top Right) ── */}
      <div className="absolute top-2 right-2 z-20">
        <span className="bg-black/60 backdrop-blur-md text-white text-[0.65rem] font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-sm transition-colors group-hover:bg-[var(--color-accent)] group-hover:border-[var(--color-accent)]">
          {formattedPrice}
        </span>
      </div>

      {/* ── Smooth Gradient Overlay (Bottom) ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-85 group-hover:opacity-100 transition-opacity duration-300 z-10" />

      {/* ── Text Content ── */}
      <div className="absolute bottom-0 left-0 w-full p-3 z-20 flex flex-col justify-end transform transition-transform duration-300">
        <h3 className="text-white text-sm font-bold leading-tight tracking-wide truncate drop-shadow-md mb-1">
          {item.name}
        </h3>
        
        <p className="text-white/80 text-[0.7rem] font-medium truncate flex items-center gap-1 drop-shadow-sm">
          <MapPin size={10} className="text-[var(--color-accent)] flex-shrink-0" /> 
          <span className="truncate">{item.location}</span>
        </p>
      </div>
    </div>
  );
}