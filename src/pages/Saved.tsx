import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { PROPERTIES } from '../data';
import { PageHeader } from '../components/layout/PageHeader';
import { Bookmark, Star, ArrowRightLeft, TrendingDown, SortAsc } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';

export const Saved: React.FC = () => {
  const { savedProperties, toggleSave, showToast, setCurrentView, properties, setSelectedPropertyId } = useAppContext();
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
   <div className="w-full flex-1 flex flex-col bg-app-bg font-sans relative">
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
                ${isActive ? 'bg-[var(--color-button)] text-white border-[var(--color-button)] shadow-float' : 'bg-card-bg text-text-muted border-transparent hover:bg-app-bg'}`}
            >
              {filterItem}
            </button>
          )
        })}
      </div>

      {/* List */}
      <div className="w-full mt-2 pb-[100px] md:pb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full flex-1 flex flex-col items-center justify-center text-center px-8 py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 rounded-full bg-[var(--color-accent-muted)] text-[var(--color-accent)] flex items-center justify-center mb-5">
              <Bookmark size={40} />
            </div>
            <h2 className="text-[1.2rem] text-text-primary mb-2 font-semibold mt-0">No saved properties yet</h2>
            <p className="text-[0.85rem] text-text-muted leading-relaxed mb-6">Properties you bookmark will show up here so you can easily view and book them later.</p>
            <button 
              onClick={() => navigate("/explore")}
              className="bg-[var(--color-button)] text-white border-none py-3 px-6 rounded-[14px] font-bold text-[0.95rem] shadow-float cursor-pointer transition-colors hover:bg-[var(--color-button)]-dark"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          filteredItems.map((h) => (
            <PropertyCard 
              key={h.id}
              property={h} 
              isSaved={true}
              onToggleSave={toggleSave}
              onClick={() => {
                setSelectedPropertyId(h.id); 
                navigate("/details");
              }} 
            />
          ))
        )}
      </div>
      </div>
    </div>
  );
};
