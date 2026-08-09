import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { Search, MapPin, SlidersHorizontal, ArrowRight, Grid, DoorClosed, Users, School, Tag, Wifi } from 'lucide-react';
import { RecentlyViewedStrip } from "../components/RecentlyViewedStrip";

const FILTERS = [
  { id: 'all', label: 'All', icon: <Grid size={16} /> },
  { id: 'private', label: 'Private', icon: <DoorClosed size={16} /> },
  { id: 'shared', label: 'Shared', icon: <Users size={16} /> },
  { id: 'campus', label: 'Near Campus', icon: <School size={16} /> },
  { id: 'budget', label: 'Budget', icon: <Tag size={16} /> },
  { id: 'wifi', label: 'Wi-Fi', icon: <Wifi size={16} /> },
];

export const MobileHome: React.FC = () => {
  const { activeFilter, setActiveFilter, savedProperties, toggleSave, setSelectedPropertyId, properties } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="flex-1 w-full bg-app-bg pb-24">
      {/* HEADER SECTION (Mobile Specific) */}
      <div className="bg-card-bg pt-10 pb-4 px-4 sticky top-0 z-40 border-b border-border-subtle shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Discover</h1>
            <p className="text-sm text-text-secondary mt-0.5">Find your perfect stay</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-1 flex items-center justify-center border border-border-subtle overflow-hidden">
             <img src="https://i.pravatar.cc/100" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* SEARCH BAR */}
        <div 
          onClick={() => navigate("/explore")}
          className="w-full bg-surface-1 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm border border-border-subtle hover:border-[var(--color-accent)] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Search size={20} className="text-[var(--color-accent)]" />
          <span className="text-[0.95rem] font-medium text-text-muted flex-1">Where do you want to live?</span>
          <div className="bg-card-bg p-1.5 rounded-xl border border-border-subtle shadow-sm">
            <SlidersHorizontal size={16} className="text-text-primary" />
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">
        {/* FILTER CHIPS (Horizontal Scroll) */}
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1 -mx-4 px-4 scroll-smooth">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex flex-col items-center justify-center gap-1.5 shrink-0 w-[72px] h-[72px] rounded-2xl text-[0.75rem] font-medium transition-all ${
                activeFilter === f.id 
                  ? 'bg-[var(--color-button)] text-white shadow-[0_4px_12px_rgba(var(--color-button-rgb),0.3)] border-transparent' 
                  : 'bg-card-bg text-text-secondary border border-border-subtle hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              <div className={`${activeFilter === f.id ? 'text-white' : 'text-text-primary'}`}>
                {f.icon}
              </div>
              <span>{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <RecentlyViewedStrip />
      </div>

      {/* QUICK ACTIONS FOR MOBILE */}
      <div className="mt-2 px-4 mb-8">
        <div className="grid grid-cols-2 gap-3">
          <div 
            onClick={() => navigate("/virtual-tour")}
            className="bg-card-bg border border-border-subtle rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center shadow-sm active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
            </div>
            <h3 className="font-semibold text-sm text-text-primary leading-tight">Virtual Tour</h3>
            <p className="text-[0.65rem] text-text-muted">See units live</p>
          </div>
          
          <div 
            onClick={() => navigate("/price-alerts")}
            className="bg-card-bg border border-border-subtle rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center shadow-sm active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </div>
            <h3 className="font-semibold text-sm text-text-primary leading-tight">Price Alerts</h3>
            <p className="text-[0.65rem] text-text-muted">Get notified</p>
          </div>
        </div>
      </div>

      {/* FEATURED PROPERTIES (Horizontal Swipe for Mobile) */}
      <div className="mt-6 mb-8">
        <div className="flex justify-between items-center px-4 mb-3">
          <h2 className="text-lg font-bold tracking-tight text-text-primary">Featured Properties</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 pb-4 snap-x snap-mandatory">
           {properties.filter(p => ['1', '2', '3'].includes(p.id.toString())).map((property) => (
             <div key={property.id} className="w-[85vw] shrink-0 snap-center">
                <PropertyCard 
                  property={property} 
                  isSaved={savedProperties.includes(property.id)}
                  onToggleSave={toggleSave}
                  onClick={() => {
                    setSelectedPropertyId(property.id);
                    navigate("/details");
                  }} 
                  layout="full-width-clean"
                />
             </div>
           ))}
        </div>
      </div>

      {/* RECOMMENDED PROPERTIES (Vertical List for Mobile) */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold tracking-tight text-text-primary">Recommended for you</h2>
        </div>
        <div className="flex flex-col gap-5 pb-6">
          {properties.slice(0, 10).map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              isSaved={savedProperties.includes(property.id)}
              onToggleSave={toggleSave}
              onClick={() => {
                setSelectedPropertyId(property.id);
                navigate("/details");
              }} 
              layout="full-width-clean"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
