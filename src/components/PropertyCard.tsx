import React from 'react';
import { Heart, Star, MapPin } from 'lucide-react';
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

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, isSaved, onToggleSave, onClick, layout = 'responsive' }) => {
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

  if (layout === 'explore-list') {
    return (
      <div 
        onClick={handleCardClick}
        className="group flex w-full max-w-[400px] h-[100px] bg-card-bg border-transparent border rounded-[30px] overflow-hidden shadow-card transition-all duration-300 hover:shadow-float hover:-translate-y-1 active:scale-[0.98] cursor-pointer"
      >
        <div className="w-[125px] h-full shrink-0 relative overflow-hidden" style={{ clipPath: 'polygon(0 0, 100% 0, 82% 100%, 0 100%)' }}>
          <img 
            src={property.img} 
            alt={property.name} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleSave(property.id); }}
            className="absolute top-2 left-2 bg-[var(--color-surface)]/80 backdrop-blur-sm border-none rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-sm transition-transform duration-200 hover:scale-110 active:scale-95 z-20"
            style={{ backgroundColor: 'var(--color-overlay)' }}
          >
            <Heart size={12} className={`transition-colors duration-200 ${isSaved ? 'text-coral fill-coral' : 'fill-transparent'}`} style={{ color: isSaved ? undefined : 'var(--color-text-secondary)' }} />
          </button>
          <div className="absolute top-0 left-[-150%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-15deg] transition-[left] duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] z-10 pointer-events-none group-hover:left-[200%]" />
        </div>
        <div className="flex-1 flex flex-col justify-between py-3 pr-3.5 pl-2 overflow-hidden min-w-0">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex justify-between items-center gap-2 min-w-0 w-full">
              <h3 className="m-0 text-[15px] min-w-0 font-bold text-text-primary whitespace-nowrap overflow-hidden text-ellipsis">
                {property.name}
              </h3>
              <div className="text-[12px] font-semibold text-text-primary flex items-center gap-[2px] shrink-0">
                <Star className="text-yellow-400 fill-yellow-400 mb-[1px]" size={11} /> {property.rating}
              </div>
            </div>
            <div className="text-[12px] text-text-muted flex items-center gap-1 min-w-0">
              <MapPin size={11} className="shrink-0" />
              <span className="truncate">{property.loc}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-auto w-full">
            <div className="text-[16px] font-bold text-text-primary truncate">
              {formatPrice(property.priceNum, property.pricing_tag || '/sem')}
            </div>
            <div className="text-[10px] font-semibold px-2 py-0.5 rounded-[4px] tracking-wide uppercase shrink-0"
              style={{ color: 'var(--color-success)', backgroundColor: 'var(--color-surface-2)' }}
            >
              {property.avail.includes('Available') ? 'Available' : property.avail.replace('left', '').trim()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'full-width-clean') {
    return (
      <div 
        onClick={handleCardClick}
        className="w-full max-w-2xl mx-auto flex justify-center group shrink-0 mb-2"
      >
        <div className="w-full h-full flex flex-col relative origin-center transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-pointer">
          <div className="w-full h-[240px] rounded-[18px] overflow-hidden relative shadow-sm border border-border-subtle bg-slate-100">
            {property.avail.includes('Available') && (
              <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-[var(--color-accent)] text-[0.65rem] font-bold px-2.5 py-1.5 rounded-lg uppercase tracking-wider z-10 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                Available
              </span>
            )}
            
            <img 
              src={property.img} 
              alt={property.name} 
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleSave(property.id); }}
              className="absolute top-3.5 right-3.5 bg-white/90 backdrop-blur-md text-text-primary w-[34px] h-[34px] rounded-full flex items-center justify-center border-none cursor-pointer transition-all hover:bg-[var(--color-button)] hover:text-white shadow-sm z-10 hover:scale-110 active:scale-95"
            >
              <Heart size={16} className={`transition-colors duration-200 ${isSaved ? 'text-[var(--color-accent)] fill-[var(--color-accent)]' : 'fill-transparent'}`} />
            </button>
          </div>

          <div className="pt-3.5 px-1.5 pb-1 flex flex-col gap-1">
            <div className="flex justify-between items-start gap-4">
              <h3 className="font-semibold text-[1.15rem] leading-tight text-text-primary truncate transition-colors group-hover:text-[var(--color-accent)]">{property.name}</h3>
              <div className="text-[1.05rem] font-bold text-text-primary shrink-0">
                {formatPrice(property.priceNum, property.pricing_tag || '/sem').replace(property.pricing_tag || '/sem', '')}
                <span className="text-[0.65rem] text-text-muted/80 block text-right tracking-wide uppercase font-semibold -mt-0.5">Per {property.pricing_tag ? property.pricing_tag.replace('/', '') : 'sem'}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-text-muted mt-0.5">
              <div className="text-[0.85rem] flex items-center gap-1.5 truncate">
                <MapPin size={13} className="shrink-0 text-text-muted/70" />
                <span className="truncate">{property.loc}</span>
              </div>
              <div className="text-[0.8rem] font-medium flex items-center gap-1 shrink-0 bg-app-bg px-2 py-0.5 rounded-md border border-border-subtle">
                <Star size={12} className="text-yellow-400 fill-yellow-400 mb-[1px]" /> {property.rating}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      className="flex flex-col cursor-pointer group w-full"
    >
      {/* Square Image Container (Fluid aspect-square and rounded-3xl) */}
      <div className="relative overflow-hidden rounded-[20px] group w-full aspect-square shrink-0">
        <img 
          src={property.img} 
          alt={property.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        
        {/* Heart Icon Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(property.id);
          }}
          aria-label="Toggle favorite"
          className="absolute top-3 right-3 bg-black/30 backdrop-blur-md text-white w-9 h-9 rounded-full flex items-center justify-center border border-white/10 cursor-pointer transition-all hover:bg-black/50 shadow-[0_4px_12px_rgba(0,0,0,0.2)] z-10 hover:scale-110 active:scale-95"
        >
          <Heart size={20} className={isSaved ? 'fill-coral text-coral' : 'fill-transparent'} stroke={isSaved ? 'none' : 'currentColor'} />
        </button>
        
        {/* White Glass Price Badge */}
        <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-md border border-black/10 text-black px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm z-10">
          <span className="font-sans text-[0.65rem] font-semibold tracking-wide uppercase">
            {formatPrice(property.priceNum, property.pricing_tag || '/sem').replace(property.pricing_tag || '/sem', '')}
          </span>
          <span className="font-sans text-[0.6rem] font-semibold opacity-80 tracking-wide uppercase">
            Per {property.pricing_tag ? property.pricing_tag.replace('/', '') : 'sem'}
          </span>
        </div>

        {/* White Glass Review Badge */}
        <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md border border-black/10 text-black px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm z-10">
          <Star size={13} className="fill-black text-black" stroke="none" /> 
          <span className="text-[0.7rem] font-bold">
            {property.rating}
          </span>
        </div>
      </div>

      {/* Written Data Section */}
      <div className="pt-2 px-1 w-full">
        <div className="flex justify-between items-start">
          <h3 className="text-[0.85rem] font-medium text-text-primary leading-tight truncate pr-2">
            {property.name}
          </h3>
        </div>
        <div className="text-[0.75rem] text-text-muted flex items-center gap-0.5 mt-0.5">
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">{property.loc}</span>
        </div>
      </div>
    </div>
  );
};
