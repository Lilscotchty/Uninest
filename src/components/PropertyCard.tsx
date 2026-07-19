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

// Visual System & Grid Scales (Internal Constants)
const SCALES = {
  radius: {
    base: '16px',
    lg: '24px',
    xl: '32px',
    full: '9999px',
  },
  shadow: {
    base: '0 4px 12px rgba(0,0,0,0.06)',
    float: '0 8px 24px rgba(0,0,0,0.12)',
    badge: '0 2px 8px rgba(0,0,0,0.08)',
  },
  accent: '#FF7F5C', // Tasteful Coral/Rust Accent, consistent across all interactions
  neutral: {
    surface: '#FFFFFF',
    surfaceSubtle: '#F9FAFB',
    text: '#1F2937', // Charcoal Text
    textMuted: '#6B7280',
    border: '#E5E7EB',
  },
  grid: {
    p: '24px', // Standard internal padding
    gap: '16px', // Standard grid gap
  },
};

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

  // Re-imagined 'explore-list' as a high-end horizontal list card
  if (layout === 'explore-list') {
    return (
      <div 
        onClick={handleCardClick}
        className="group flex w-full max-w-4xl mx-auto min-h-[160px] bg-white border-none rounded-[24px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 active:scale-[0.98] cursor-pointer"
      >
        <div className="w-2/5 h-full shrink-0 relative overflow-hidden">
          <img 
            src={property.img} 
            alt={property.name} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {property.avail.includes('Available') && (
            <div className="absolute bottom-3.5 left-3.5 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-[16px] flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SCALES.accent }} />
              <span className="font-sans text-[0.65rem] font-semibold tracking-wider uppercase text-gray-800">
                {property.avail.includes('Available') ? 'Available Now' : property.avail.replace('left', '').trim()}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between" style={{ padding: SCALES.grid.p }}>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-start gap-4">
              <h3 className="m-0 font-sans font-semibold text-[1.15rem] leading-tight text-gray-900 group-hover:text-gray-800 transition-colors truncate">
                {property.name}
              </h3>
              <div className="text-[1rem] font-bold text-gray-900 flex items-center gap-1.5 shrink-0 bg-gray-100/60 px-2.5 py-1 rounded-[16px]">
                <Star className="text-yellow-400 fill-yellow-400 mb-0.5" size={14} /> {property.rating}
              </div>
            </div>
            <div className="text-[0.9rem] flex items-center gap-2 text-gray-500 truncate mt-0.5">
              <MapPin size={13} className="shrink-0 text-gray-400" />
              <span className="truncate">{property.loc}</span>
            </div>
          </div>
          <div className="flex justify-between items-end mt-auto w-full gap-4">
            <div className="font-sans text-[1.25rem] font-bold text-gray-900 leading-tight">
              {formatPrice(property.priceNum, property.pricing_tag || '/sem').replace(property.pricing_tag || '/sem', '')}
              <span className="text-[0.7rem] text-gray-500 block -mt-0.5 font-medium tracking-wide uppercase">Per {property.pricing_tag ? property.pricing_tag.replace('/', '') : 'sem'}</span>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleSave(property.id); }}
              className="bg-white/90 backdrop-blur-md text-gray-800 w-[42px] h-[42px] rounded-full flex items-center justify-center border-none cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-gray-100"
            >
              <Heart size={18} className={`transition-colors duration-200 ${isSaved ? 'text-coral fill-coral' : 'fill-transparent'}`} style={{ color: isSaved ? SCALES.accent : undefined }} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Optimized 'full-width-clean' as a high-end editorial stack
  if (layout === 'full-width-clean') {
    return (
      <div 
        onClick={handleCardClick}
        className="w-full max-w-2xl mx-auto flex justify-center group shrink-0 mb-4"
      >
        <div className="w-full h-full flex flex-col relative origin-center transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-pointer overflow-hidden rounded-[24px] shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white">
          <div className="w-full h-[320px] rounded-[24px] overflow-hidden relative">
            {property.avail.includes('Available') && (
              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-gray-800 text-[0.65rem] font-bold px-3 py-2 rounded-[16px] uppercase tracking-wider z-10 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SCALES.accent }} /> Available
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
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-gray-800 w-[42px] h-[42px] rounded-full flex items-center justify-center border-none cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-gray-100 z-10"
            >
              <Heart size={18} className={`transition-colors duration-200 ${isSaved ? 'text-coral fill-coral' : 'fill-transparent'}`} style={{ color: isSaved ? SCALES.accent : undefined }} />
            </button>
          </div>

          <div className="pb-5" style={{ padding: SCALES.grid.p }}>
            <div className="flex justify-between items-center gap-4">
              <h3 className="m-0 font-sans font-semibold text-[1.4rem] leading-tight text-gray-900 group-hover:text-gray-800 transition-colors truncate">
                {property.name}
              </h3>
              <div className="text-[1.25rem] font-bold text-gray-900 flex items-center gap-1.5 shrink-0 bg-gray-100/60 px-3 py-1.5 rounded-[16px]">
                <Star className="text-yellow-400 fill-yellow-400 mb-0.5" size={16} /> {property.rating}
              </div>
            </div>
            
            <div className="flex justify-between items-end mt-4 w-full gap-4 pt-1">
              <div className="text-[1rem] flex items-center gap-2 text-gray-500 truncate">
                <MapPin size={14} className="shrink-0 text-gray-400" />
                <span className="truncate">{property.loc}</span>
              </div>
              <div className="font-sans text-[1.5rem] font-bold text-gray-900 leading-none">
                {formatPrice(property.priceNum, property.pricing_tag || '/sem').replace(property.pricing_tag || '/sem', '')}
                <span className="text-[0.7rem] text-gray-500 block text-right font-medium tracking-wide uppercase">Per {property.pricing_tag ? property.pricing_tag.replace('/', '') : 'sem'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Base 'square' variant, redesigned with floating visual metrics and premium standard card details
  return (
    <div 
      onClick={handleCardClick}
      className="group flex flex-col w-full aspect-[1/1.2] bg-white border-none rounded-[24px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 active:scale-[0.98] cursor-pointer"
    >
      {/* Square Image Container with refined metrics and interactions */}
      <div className="relative overflow-hidden group w-full flex-1">
        <img 
          src={property.img} 
          alt={property.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        
        {/* Heart Icon Button - Simplified pill design */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(property.id);
          }}
          aria-label="Toggle favorite"
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-gray-800 w-[38px] h-[38px] rounded-full flex items-center justify-center border-none cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-[0_2px_8px_rgba(0,0,0,0.08)] z-10"
        >
          <Heart size={16} className={`transition-colors duration-200 ${isSaved ? 'text-coral fill-coral' : 'fill-transparent'}`} style={{ color: isSaved ? SCALES.accent : undefined }} />
        </button>
        
        {/* White Glass Review Badge - Top Left */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-[16px] flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] z-10">
          <Star size={13} className="fill-yellow-400 text-yellow-400" stroke="none" /> 
          <span className="text-[0.75rem] font-bold text-gray-900">
            {property.rating}
          </span>
        </div>

        {/* White Glass Price Badge - Bottom Left */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-[20px] flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] z-10">
          <span className="font-sans text-[0.95rem] font-bold text-gray-900 leading-tight">
            {formatPrice(property.priceNum, property.pricing_tag || '/sem').replace(property.pricing_tag || '/sem', '')}
          </span>
          <span className="font-sans text-[0.6rem] font-medium text-gray-500 tracking-wide uppercase -ml-0.5 mt-0.5">
            / sem
          </span>
        </div>

      </div>

      {/* Written Data Section with generous padding and hierarchy */}
      <div className="pt-4 pb-5 px-5 flex flex-col gap-1 w-full shrink-0">
        <h3 className="m-0 font-sans font-semibold text-[1.1rem] text-gray-900 leading-tight truncate pr-2 group-hover:text-gray-800 transition-colors">
          {property.name}
        </h3>
        <div className="flex justify-between items-center text-[0.8rem] text-gray-500 mt-1 gap-2">
            <div className="flex items-center gap-1.5 truncate">
                <MapPin size={12} className="shrink-0 text-gray-400" />
                <span className="truncate">{property.loc}</span>
            </div>
            {property.avail.includes('Available') && (
              <span className="font-sans text-[0.65rem] font-bold tracking-wide uppercase px-2 py-0.5 rounded-[16px]" style={{ color: SCALES.accent, backgroundColor: `${SCALES.accent}10` }}>
                {property.avail.includes('Available') ? 'Available' : property.avail.replace('left', '').trim()}
              </span>
            )}
        </div>
      </div>
    </div>
  );
};