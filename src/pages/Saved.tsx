import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { HOSTELS } from '../data';
import { PageHeader } from '../components/PageHeader';
import { Bookmark, Star, ArrowRightLeft, TrendingDown } from 'lucide-react';

export const Saved: React.FC = () => {
  const { savedHostels, toggleSave, showToast, setCurrentView, hostels } = useAppContext();
  const navigate = useNavigate();
  const [activeSavedFilter, setActiveSavedFilter] = useState<string>('all');

  const allSavedItems = hostels.filter(h => savedHostels.includes(h.id));

  // Simulating "Price Dropped" for specific categories or conditions,
  // Here we arbitrarily say premium or campus hostels have price drops for demo
  const isDrop = (category: string) => ['campus', 'premium'].includes(category);
  const isAvail = (avail: string) => avail !== 'Sold out';

  const filteredItems = allSavedItems.filter(h => {
    if (activeSavedFilter === 'drop') return isDrop(h.category);
    if (activeSavedFilter === 'avail') return isAvail(h.avail);
    return true;
  });

  return (
   <div className="w-full flex-1 min-h-0 bg-app-bg flex flex-col font-sans relative overflow-hidden">
      <PageHeader 
        title="Saved" 
        rightAction={
          <button 
            onClick={() => showToast('Compare mode activated')}
            className="w-[100px] h-[35px] rounded-[15px] flex items-center justify-center text-white font-semibold text-xs cursor-pointer border border-white/25 shadow-[inset_0_0_12px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.2)] backdrop-blur-md transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(120, 130, 200, 0.6) 0%, rgba(135, 100, 170, 0.5) 40%, rgba(130, 140, 90, 0.4) 100%)'
            }}
          >
            <ArrowRightLeft size={14} className="mr-1.5" /> Compare
          </button>
        }
      />

      {/* Filter Chips */}
      <div className="px-5 pt-4 pb-2 flex gap-2 overflow-x-auto hide-scrollbar bg-app-bg w-full shrink-0">
        {['All Saved', 'Price Dropped', 'Available Now'].map((filterItem) => {
          const filterKey = filterItem === 'All Saved' ? 'all' : filterItem === 'Price Dropped' ? 'drop' : 'avail';
          const isActive = activeSavedFilter === filterKey;
          return (
            <button
              key={filterItem}
              onClick={() => setActiveSavedFilter(filterKey)}
              className={`px-4 py-2 rounded-full border-[1.5px] text-xs font-semibold whitespace-nowrap cursor-pointer transition-all shadow-[0_2px_6px_rgba(0,0,0,0.03)]
                ${isActive ? 'bg-indigo text-white border-indigo shadow-float' : 'bg-card-bg text-text-muted border-transparent hover:bg-app-bg'}`}
            >
              {filterItem}
            </button>
          )
        })}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 pb-[70px] flex flex-col gap-7 hide-scrollbar w-full mt-2">
        {filteredItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 rounded-full bg-indigo-light text-indigo flex items-center justify-center mb-5">
              <Bookmark size={40} />
            </div>
            <h2 className="font-montserrat text-[1.4rem] text-text-primary mb-2 font-bold mt-0">No saved hostels yet</h2>
            <p className="text-[0.85rem] text-text-muted leading-relaxed mb-6">Properties you bookmark will show up here so you can easily view and book them later.</p>
            <button 
              onClick={() => navigate("/explore")}
              className="bg-indigo text-white border-none py-3 px-6 rounded-[14px] font-bold text-[0.95rem] shadow-float cursor-pointer transition-colors hover:bg-indigo-dark"
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
                  className="absolute top-3.5 right-3.5 bg-card-bg/85 backdrop-blur-md text-indigo w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer transition-all hover:bg-indigo hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-10 group-active:scale-110"
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
  );
};
