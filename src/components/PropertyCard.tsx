import React from 'react';
import { Check, Heart, Star, Wifi, ShieldCheck, Zap, MapPin } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  isSaved: boolean;
  onToggleSave: (id: number | string) => void;
  onClick: () => void;
  layout?: 'responsive' | 'compact' | 'explore-list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, isSaved, onToggleSave, onClick, layout = 'responsive' }) => {
  if (layout === 'explore-list') {
    return (
      <div 
        onClick={onClick}
        className="group flex w-full max-w-[400px] h-[100px] bg-white dark:bg-card-bg border border-slate-200 dark:border-slate-800 rounded-[30px] overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 cursor-pointer"
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
            className="absolute top-2 left-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm border-none rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-sm transition-transform duration-200 hover:scale-110 active:scale-95 z-20"
          >
            <Heart size={12} className={`transition-colors duration-200 ${isSaved ? 'text-coral fill-coral' : 'text-gray-500 dark:text-gray-300 fill-transparent'}`} />
          </button>
          <div className="absolute top-0 left-[-150%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-15deg] transition-[left] duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] z-10 pointer-events-none group-hover:left-[200%]" />
        </div>
        <div className="flex-1 flex flex-col justify-between py-3 pr-3.5 pl-2 overflow-hidden">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center gap-2">
              <h3 className="m-0 text-[15px] font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap overflow-hidden text-ellipsis">
                {property.name}
              </h3>
              <div className="text-[12px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-[2px] shrink-0">
                <Star className="text-yellow-400 fill-yellow-400 mb-[1px]" size={11} /> {property.rating}
              </div>
            </div>
            <div className="text-[12px] text-slate-500 flex items-center gap-1">
              <MapPin size={11} className="opacity-80 shrink-0" />
              <span className="truncate">{property.loc}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-auto">
            <div className="text-[16px] font-bold text-slate-900 dark:text-slate-100">
              {property.price}
            </div>
            <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-[4px] tracking-wide uppercase">
              {property.avail.includes('Available') ? 'Available' : property.avail.replace('left', '').trim()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isCompact = layout === 'compact';
  
  return (
    <div 
      onClick={onClick}
      className={`
        bg-card-bg border-transparent border shadow-card overflow-hidden flex cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-float active:scale-[0.98] 
        ${isCompact ? 'w-[200px] min-w-[200px] flex-col rounded-[20px] shrink-0' : 'w-full flex-col sm:flex-row rounded-xl hover:shadow-md'}
      `}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden group ${isCompact ? 'h-[130px]' : 'h-48 sm:h-full sm:w-48 xl:w-56 shrink-0 aspect-[4/3] sm:aspect-auto'}`}>
        <img 
          src={property.img} 
          alt={property.name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
        />
        <div className="absolute top-2.5 left-2.5 bg-teal/90 text-white text-[0.45rem] font-bold px-2 py-1 rounded-md tracking-[0.4px] uppercase flex items-center gap-1">
          <Check size={10} strokeWidth={4} /> Verified
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleSave(property.id); }}
          className="absolute top-2.5 right-2.5 bg-card-bg/90 border-none rounded-full w-[30px] h-[30px] flex items-center justify-center cursor-pointer shadow-md transition-transform duration-200 hover:scale-115 active:scale-95"
        >
          <Heart size={16} className={`transition-colors duration-200 ${isSaved ? 'text-coral fill-coral' : 'text-gray-300 fill-transparent'}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className={`flex flex-col flex-1 ${isCompact ? 'p-[14px]' : 'p-4 sm:p-5'}`}>
        <div className="flex justify-between items-center mb-1.5">
          <div className="text-[0.7rem] sm:text-[0.75rem] font-semibold text-text-primary flex items-center gap-1">
            <Star size={13} className="text-yellow-400 fill-yellow-400" /> {property.rating} <span className="text-text-primary text-xs ml-1">({property.reviews})</span>
          </div>
          <div className="text-[0.6rem] sm:text-[0.68rem] bg-indigo-light text-indigo font-semibold px-2 py-0.5 rounded-[5px]">
            {property.avail}
          </div>
        </div>
        
        <h3 className={`font-bold text-text-primary mb-1.5 sm:mb-2 whitespace-nowrap overflow-hidden text-ellipsis ${isCompact ? 'text-[0.8rem] sm:text-[0.98rem]' : 'text-lg sm:text-xl'}`}>
          {property.name}
        </h3>
        
        <div className="flex gap-1.5 mb-[10px] flex-wrap">
           {property.tags.map((tag) => (
             <div key={tag} className="flex items-center justify-center gap-1 bg-app-bg rounded-[6px] px-[7px] py-[3px] text-[0.68rem] text-text-muted font-medium">
               {tag === 'wifi' && <Wifi size={12} className="text-indigo" />}
               {tag === 'sec' && <ShieldCheck size={12} className="text-indigo" />}
               {tag === 'gen' && <Zap size={12} className="text-indigo" />}
               {tag === 'ac' && <span className="text-[0.55rem] font-bold text-indigo">AC</span>}
             </div>
           ))}
        </div>
        
        <div className="mt-auto pt-2">
          <div className="text-[0.65rem] sm:text-[0.7rem] text-text-muted">
            <strong className={`font-bold text-text-primary ${isCompact ? 'text-[0.7rem] sm:text-[1.2rem] font-fraunces' : 'text-xl sm:text-2xl'}`}>{property.price}</strong>/sem
          </div>
          
          <div className="text-[0.65rem] sm:text-[0.72rem] text-teal font-semibold mt-[2px] sm:mt-[3px] flex items-center gap-1">
            <MapPin size={10} className="shrink-0" /> <span className="truncate">{property.loc}</span>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className={`mt-2.5 sm:mt-3 flex justify-center items-center text-indigo border-[1.5px] border-indigo bg-transparent rounded-[10px] text-center cursor-pointer font-bold transition-colors duration-300 hover:bg-indigo-light w-full ${isCompact ? 'text-[0.75rem] py-1.5' : 'text-sm py-2'}`}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
