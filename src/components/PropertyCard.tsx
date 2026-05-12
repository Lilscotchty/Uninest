import React from 'react';
import { FaCheck, FaHeart, FaStar, FaWifi, FaShieldAlt, FaBolt, FaMapMarkerAlt } from 'react-icons/fa';
import { Hostel } from '../types';

interface PropertyCardProps {
  hostel: Hostel;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
  onClick: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ hostel, isSaved, onToggleSave, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="w-[180px] sm:w-[200px] min-w-[180px] sm:min-w-[200px] bg-card-bg rounded-[20px] border border-indigo-light shadow-card overflow-hidden flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-float active:scale-[0.98] shrink-0"
    >
      {/* Image Container */}
      <div className="relative h-[130px] overflow-hidden group">
        <img 
          src={hostel.img} 
          alt={hostel.name} 
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
        />
        <div className="absolute top-2.5 left-2.5 bg-teal/90 text-white text-[0.65rem] font-bold px-2 py-1 rounded-md tracking-[0.4px] uppercase flex items-center gap-1">
          <FaCheck size={10} /> Verified
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleSave(hostel.id); }}
          className="absolute top-2.5 right-2.5 bg-white/90 border-none rounded-full w-[30px] h-[30px] flex items-center justify-center cursor-pointer shadow-md transition-transform duration-200 hover:scale-115 active:scale-95"
        >
          <FaHeart className={`text-[0.85rem] transition-colors duration-200 ${isSaved ? 'text-coral' : 'text-gray-300'}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-[14px] flex flex-col flex-1">
        <div className="flex justify-between items-center mb-1.5">
          <div className="text-[0.65rem] sm:text-[0.75rem] font-semibold text-text-primary flex items-center gap-1">
            <FaStar className="text-yellow-400 text-[0.7rem] sm:text-[0.8rem]" /> {hostel.rating} <span className="text-text-primary hidden sm:inline">({hostel.reviews})</span>
          </div>
          <div className="text-[0.6rem] sm:text-[0.68rem] bg-indigo-light text-indigo font-semibold px-2 py-0.5 rounded-[5px]">
            {hostel.avail}
          </div>
        </div>
        
        <h3 className="font-fraunces text-[0.85rem] sm:text-[0.98rem] font-bold text-text-primary mb-1.5 sm:mb-2 whitespace-nowrap overflow-hidden text-ellipsis">
          {hostel.name}
        </h3>
        
        <div className="flex gap-1.5 mb-[10px]">
           {hostel.tags.map((tag) => (
             <div key={tag} className="flex items-center justify-center gap-1 bg-app-bg rounded-[6px] px-[7px] py-[3px] text-[0.68rem] text-text-muted font-medium">
               {tag === 'wifi' && <FaWifi className="text-[0.7rem] text-indigo" />}
               {tag === 'sec' && <FaShieldAlt className="text-[0.7rem] text-indigo" />}
               {tag === 'gen' && <FaBolt className="text-[0.7rem] text-indigo" />}
               {tag === 'ac' && <span className="text-[0.55rem] font-bold text-indigo">AC</span>}
             </div>
           ))}
        </div>
        
        <div className="mt-auto">
          <div className="text-[0.7rem] sm:text-[0.78rem] text-text-muted">
            <strong className="font-fraunces text-[1.1rem] sm:text-[1.2rem] font-bold text-text-primary">{hostel.price}</strong>/sem
          </div>
          
          <div className="text-[0.65rem] sm:text-[0.72rem] text-teal font-semibold mt-[2px] sm:mt-[3px] flex items-center gap-1">
            <FaMapMarkerAlt size={10} className="shrink-0" /> <span className="truncate">{hostel.loc}</span>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="mt-2.5 sm:mt-3 text-[0.75rem] sm:text-[0.80rem] flex justify-center items-center text-indigo border-[1.5px] border-indigo bg-transparent py-1.5 sm:py-2 px-2.5 rounded-[10px] text-center cursor-pointer font-bold transition-colors duration-300 hover:bg-indigo-light w-full">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
