import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { PROPERTIES } from '../data';
import { PageHeader } from '../components/layout/PageHeader';
import { Bookmark, Star, ArrowRightLeft, TrendingDown, SortAsc } from 'lucide-react';

export const Saved: React.FC = () => {
  const { savedProperties, toggleSave, showToast, setCurrentView, properties } = useAppContext();
  const navigate = useNavigate();
  const [activeSavedFilter, setActiveSavedFilter] = useState<string>('all');
  const [activeHeaderTab, setActiveHeaderTab] = useState<string>('properties');

  const allSavedItems = properties.filter(h => savedProperties.includes(h.id));

  // Simulating "Price Dropped" for specific categories or conditions,
  // Here we arbitrarily say premium or campus properties have price drops for demo
  const isDrop = (category: string) => ['campus', 'premium'].includes(category);
  const isAvail = (avail: string) => avail !== 'Sold out';

  const filteredItems = allSavedItems.filter(h => {
    if (activeSavedFilter === 'drop') return isDrop(h.category);
    if (activeSavedFilter === 'avail') return isAvail(h.avail);
    return true;
  });

  return (
   <div className="w-full flex-1 min-h-0 bg-app-bg flex flex-col font-sans relative overflow-hidden overflow-y-auto">
      <PageHeader 
        title="Saved" 
        tabs={[
          { id: 'properties', label: 'Properties' },
          { id: 'searches', label: 'Searches' }
        ]}
        activeTab={activeHeaderTab}
        onTabChange={setActiveHeaderTab}
        actions={[
          {
            icon: <SortAsc size={22} strokeWidth={1.8} />,
            label: "Sort",
            onClick: () => showToast('Sort options')
          }
        ]}
      />


    <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      {/* Filter Chips */}
      <div className="pt-4 pb-2 flex gap-2 overflow-x-auto hide-scrollbar bg-app-bg w-full shrink-0">
        {['All Saved', 'Price Dropped', 'Available Now'].map((filterItem) => {
          const filterKey = filterItem === 'All Saved' ? 'all' : filterItem === 'Price Dropped' ? 'drop' : 'avail';
          const isActive = activeSavedFilter === filterKey;
          return (
            <button
              key={filterItem}
              onClick={() => setActiveSavedFilter(filterKey)}
              className={`px-4 py-2 rounded-full border-[1.5px] text-xs font-semibold whitespace-nowrap cursor-pointer transition-all shadow-[0_2px_6px_rgba(0,0,0,0.03)]
                ${isActive ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-float' : 'bg-card-bg text-text-muted border-transparent hover:bg-app-bg'}`}
            >
              {filterItem}
            </button>
          )
        })}
      </div>

      {/* List */}
      <div className="w-full mt-2 pb-[70px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 rounded-full bg-[var(--color-accent-muted)] text-[var(--color-accent)] flex items-center justify-center mb-5">
              <Bookmark size={40} />
            </div>
            <h2 className="font-montserrat text-[1.4rem] text-text-primary mb-2 font-bold mt-0">No saved properties yet</h2>
            <p className="text-[0.85rem] text-text-muted leading-relaxed mb-6">Properties you bookmark will show up here so you can easily view and book them later.</p>
            <button 
              onClick={() => navigate("/explore")}
              className="bg-[var(--color-accent)] text-white border-none py-3 px-6 rounded-[14px] font-bold text-[0.95rem] shadow-float cursor-pointer transition-colors hover:bg-[var(--color-accent)]-dark"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          filteredItems.map((h) => (
            <div key={h.id} className="flex flex-col relative origin-center transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 group">
              <div className="w-full h-[220px] rounded-[20px] overflow-hidden relative shadow-card bg-slate-200">
                {isAvail(h.avail) && (
                  <span className="absolute top-3.5 left-3.5 bg-card-bg/95 backdrop-blur-md text-teal text-[0.65rem] font-bold px-2.5 py-1.5 rounded-lg uppercase tracking-wide z-10 shadow-sm">
                    Available
                  </span>
                )}
                
                <img src={h.img} alt={h.name} className="w-full h-full object-cover transition-transform duration-500 group-active:scale-105" />
                
                <button 
                  onClick={() => {
                    toggleSave(h.id);
                    showToast('Bookmark removed');
                  }}
                  className="absolute top-3.5 right-3.5 bg-card-bg/85 backdrop-blur-md text-[var(--color-accent)] w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer transition-all hover:bg-[var(--color-accent)] hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-10 group-active:scale-110"
                >
                  <Bookmark size={18} fill="currentColor" />
                </button>
                
                <div className="absolute bottom-3.5 left-3.5 bg-slate-900/85 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl font-fraunces text-[1.25rem] font-bold flex flex-col leading-none shadow-sm z-10">
                  {h.price}
                  <span className="font-sans text-[0.65rem] font-semibold opacity-80 mt-1 tracking-wide uppercase">Per Semester</span>
                </div>
              </div>

              <div className="pt-3.5 px-1.5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-fraunces text-[1.1rem] font-bold text-text-primary mr-2.5 leading-tight">{h.name}</h3>
                  <div className="text-[0.85rem] font-bold text-text-primary flex items-center gap-1 pt-0.5 shrink-0">
                    <Star size={13} fill="#fbbf24" stroke="none" /> {h.rating}
                  </div>
                </div>
                <div className="text-[0.85rem] text-text-muted font-medium mb-1.5">{h.loc}</div>
                {isDrop(h.category) && (
                  <div className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-[0.7rem] font-bold px-2 py-1 rounded-md mt-1">
                    <TrendingDown size={12} strokeWidth={2.5} /> Price Dropped
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
};
