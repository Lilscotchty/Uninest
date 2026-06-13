import React from 'react';
import { Check, Heart, Star, Wifi, ShieldCheck, Zap, MapPin } from 'lucide-react';
import { Property } from '../types';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { formatPrice } from '../lib/formatPrice';

interface PropertyCardProps {
  property: Property;
  isSaved: boolean;
  onToggleSave: (id: number | string) => void;
  onClick: () => void;
  layout?: 'responsive' | 'compact' | 'explore-list' | 'full-width-clean';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  isSaved, 
  onToggleSave, 
  onClick, 
  layout = 'responsive' 
}) => {
  const { recordView } = useRecentlyViewed();

  const handleCardClick = () => {
    recordView({
      id: property.id.toString(),
      name: property.name,
      image_url: property.img,
      location: property.loc,
      price: property.priceNum,
      viewedAt: Date.now(),
    });
    onClick();
  };

  // ─────────────────────────────────────────────────────────────────
  // LAYOUT 1: EXPLORE LIST (Sleek Horizontal Row)
  // ─────────────────────────────────────────────────────────────────
  if (layout === 'explore-list') {
    return (
      <div 
        onClick={handleCardClick}
        className="group w-full max-w-md flex items-center p-2 bg-card-bg rounded-[20px] border border-border-subtle shadow-sm hover:shadow-float hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      >
        {/* Image Square */}
        <div className="w-[100px] h-[100px] shrink-0 relative rounded-2xl overflow-hidden bg-app-bg isolate">
          <img 
            src={property.img} 
            alt={property.name} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleSave(property.id); }}
            className="absolute top-2 left-2 z-20 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/40 hover:scale-110 transition-all"
          >
            <Heart size={12} className={isSaved ? 'text-[var(--color-coral)] fill-[var(--color-coral)]' : 'text-white'} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pl-4 pr-2 py-1 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <h3 className="text-[1.05rem] font-bold text-text-primary truncate tracking-tight">
                {property.name}
              </h3>
              <div className="flex items-center gap-1 text-[0.75rem] font-bold text-text-primary shrink-0 bg-app-bg px-1.5 py-0.5 rounded-md">
                <Star size={10} className="text-[var(--color-warning)] fill-[var(--color-warning)]" />
                {property.rating}
              </div>
            </div>
            <div className="flex items-center gap-1 text-[0.75rem] text-text-muted">
              <MapPin size={12} className="shrink-0 opacity-70" />
              <span className="truncate">{property.loc}</span>
            </div>
          </div>

          <div className="flex items-end justify-between mt-2">
            <div className="font-extrabold text-[1.1rem] text-text-primary tracking-tight">
              {formatPrice(property.priceNum, property.pricing_tag || '/sem').replace(property.pricing_tag || '/sem', '')}
              <span className="text-[0.65rem] font-semibold text-text-muted uppercase ml-1">
                {property.pricing_tag ? property.pricing_tag.replace('/', '') : 'sem'}
              </span>
            </div>
            {property.avail.includes('Available') && (
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] shadow-[0_0_8px_var(--color-success)] animate-pulse" title="Available Now" />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // LAYOUT 2: FULL WIDTH CLEAN (Premium Showcase)
  // ─────────────────────────────────────────────────────────────────
  if (layout === 'full-width-clean') {
    return (
      <div 
        onClick={handleCardClick}
        className="group w-full flex flex-col bg-card-bg rounded-[24px] overflow-hidden border border-border-subtle shadow-sm hover:shadow-float hover:-translate-y-1 transition-all duration-400 cursor-pointer isolate"
      >
        {/* Massive Cinematic Image */}
        <div className="w-full h-[280px] sm:h-[320px] relative overflow-hidden bg-app-bg">
          <img 
            src={property.img} 
            alt={property.name} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
          />
          {/* Smooth shadow overlay for text/icons */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            {property.avail.includes('Available') && (
              <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-[0.7rem] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                Available
              </span>
            )}
            <span className="bg-black/40 backdrop-blur-md border border-white/10 text-white text-[0.7rem] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Star size={12} className="text-yellow-400 fill-yellow-400" /> {property.rating}
            </span>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); onToggleSave(property.id); }}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/40 hover:scale-110 active:scale-95 z-10"
          >
            <Heart size={18} className={isSaved ? 'text-[var(--color-coral)] fill-[var(--color-coral)]' : 'fill-transparent'} />
          </button>

          {/* Floating Price */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xl text-text-primary px-4 py-2 rounded-2xl shadow-lg border border-white/20">
            <span className="font-extrabold text-xl tracking-tight">
              {formatPrice(property.priceNum, '')}
            </span>
            <span className="text-[0.7rem] font-bold uppercase text-text-muted ml-1 tracking-wider">
              {property.pricing_tag || '/sem'}
            </span>
          </div>
        </div>

        {/* Crisp Typography Body */}
        <div className="p-6">
          <h3 className="font-extrabold text-2xl leading-tight text-text-primary tracking-tight mb-1 group-hover:text-[var(--color-accent)] transition-colors">
            {property.name}
          </h3>
          <div className="flex items-center gap-1.5 text-[0.9rem] font-medium text-text-secondary">
            <MapPin size={16} className="text-[var(--color-accent)] shrink-0" />
            <span className="truncate">{property.loc}</span>
          </div>

          {/* Minimal Tags */}
          <div className="flex gap-2 mt-5">
             {property.tags.map((tag) => (
               <div key={tag} className="flex items-center gap-1.5 bg-app-bg text-text-secondary text-[0.75rem] font-bold px-3 py-1.5 rounded-lg border border-border-subtle">
                 {tag === 'wifi' && <><Wifi size={14} className="text-[var(--color-accent)]" /> Wi-Fi</>}
                 {tag === 'sec' && <><ShieldCheck size={14} className="text-[var(--color-accent)]" /> Security</>}
                 {tag === 'gen' && <><Zap size={14} className="text-[var(--color-accent)]" /> Power</>}
                 {tag === 'ac' && <span className="font-extrabold text-[var(--color-accent)]">AC</span>}
               </div>
             ))}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // LAYOUT 3: COMPACT / RESPONSIVE (The Clean Grid Workhorse)
  // ─────────────────────────────────────────────────────────────────
  const isCompact = layout === 'compact';
  
  return (
    <div 
      onClick={handleCardClick}
      className={`group flex flex-col bg-card-bg rounded-[20px] overflow-hidden border border-border-subtle shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-float hover:-translate-y-1 transition-all duration-300 cursor-pointer isolate ${
        isCompact ? 'w-full h-full' : 'w-full'
      }`}
    >
      {/* Top Image Section - Now a perfect 1:1 square */}
      <div className="relative w-full bg-app-bg overflow-hidden aspect-square">
        <img 
          src={property.img} 
          alt={property.name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-80" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 text-white text-[0.65rem] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
            <Check size={10} strokeWidth={4} /> Verified
          </div>
        </div>

        {/* Heart */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleSave(property.id); }}
          className="absolute top-3 right-3 bg-white/20 backdrop-blur-md border border-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/40 hover:scale-110 active:scale-95 z-10"
        >
          <Heart size={14} className={isSaved ? 'text-[var(--color-coral)] fill-[var(--color-coral)]' : 'text-white'} />
        </button>
      </div>

      {/* Card Info */}
      <div className="flex flex-col flex-1 p-4">
        {/* Meta row */}
        <div className="flex justify-between items-center mb-1.5">
          <div className="text-[0.75rem] font-bold text-text-primary flex items-center gap-1 bg-app-bg px-2 py-0.5 rounded-md border border-border-subtle">
            <Star size={12} className="text-yellow-400 fill-yellow-400" /> {property.rating}
          </div>
          <div className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--color-accent)] bg-[var(--color-accent-muted)] px-2 py-0.5 rounded-md">
            {property.avail.replace('left', '').trim()}
          </div>
        </div>
        
        {/* Title & Location */}
        <h3 className="font-extrabold text-[1.1rem] leading-tight tracking-tight text-text-primary mb-1 line-clamp-1 group-hover:text-[var(--color-accent)] transition-colors">
          {property.name}
        </h3>
        <div className="text-[0.8rem] font-medium text-text-muted flex items-center gap-1.5 mb-4">
          <MapPin size={12} className="opacity-70 shrink-0" />
          <span className="truncate">{property.loc}</span>
        </div>
        
        {/* Bottom Row: Price & Tags */}
        <div className="mt-auto flex items-end justify-between pt-3 border-t border-border-subtle">
          <div>
            <span className="text-text-muted text-[0.65rem] font-bold uppercase tracking-wider block mb-0.5">Starting at</span>
            <div className="font-extrabold text-lg tracking-tight text-text-primary leading-none">
              {formatPrice(property.priceNum, '')}
              <span className="text-[0.7rem] text-text-muted font-bold ml-0.5 uppercase tracking-wide">
                {property.pricing_tag || '/sem'}
              </span>
            </div>
          </div>
          
          <div className="flex gap-1.5">
             {property.tags.slice(0, 3).map((tag) => (
               <div key={tag} className="w-7 h-7 rounded-full bg-app-bg border border-border-subtle flex items-center justify-center text-text-secondary transition-colors group-hover:border-[var(--color-accent-muted)] group-hover:text-[var(--color-accent)]">
                 {tag === 'wifi' && <Wifi size={12} />}
                 {tag === 'sec' && <ShieldCheck size={12} />}
                 {tag === 'gen' && <Zap size={12} />}
                 {tag === 'ac' && <span className="text-[0.55rem] font-extrabold">AC</span>}
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};