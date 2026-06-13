import { useNavigate } from "react-router-dom";
import React, { useRef, useState } from 'react';

import { useAppContext } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { PageHeader } from '../components/layout/PageHeader';
import { RecentlyViewedStrip } from "../components/RecentlyViewedStrip";
import { Search, SlidersHorizontal, ArrowRight, Grip, DoorClosed, Users, School, Tag, Wifi } from 'lucide-react';

const FILTERS = [
  { id: 'all', label: 'All', icon: <Grip size={14} /> },
  { id: 'private', label: 'Private', icon: <DoorClosed size={14} /> },
  { id: 'shared', label: 'Shared', icon: <Users size={14} /> },
  { id: 'campus', label: 'Near Campus', icon: <School size={14} /> },
  { id: 'budget', label: 'Budget', icon: <Tag size={14} /> },
  { id: 'wifi', label: 'Wi-Fi', icon: <Wifi size={14} /> },
];

export const Home: React.FC = () => {
  const { activeFilter, setActiveFilter, savedProperties, toggleSave, setSelectedPropertyId, properties } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  
  // Featured Picks auto-sliding carousel
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentFeatured, setCurrentFeatured] = useState(0);
  
  const featuredProperties = [
    {
      id: 1,
      img: 'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=800',
      tag: '🔥 Trending',
      tagTheme: 'warning', 
      name: 'Evandy Property',
      desc: 'Shared study spaces, rooftop lounge, and weekly social events. Built for students who want more than just a unit.',
      action: 'Explore Property'
    },
    {
      id: 3,
      img: 'https://loremflickr.com/600/400/bedroom?lock=101',
      tag: '⭐ Premium',
      tagTheme: 'accent',
      name: 'Pentagon Annex',
      desc: 'Executive single suites with en-suite bathrooms. For students who won\'t compromise on comfort and privacy.',
      action: 'Explore Luxury'
    },
    {
      id: 2,
      img: 'https://loremflickr.com/600/400/bedroom?lock=102',
      tag: '📍 Best Location',
      tagTheme: 'success',
      name: 'Bani Property',
      desc: 'Exactly 2 minutes from the main gate, with 24/7 security, steady electricity, and free Wi-Fi included.',
      action: 'See Location'
    }
  ];

  // Helper function to render horizontal property rows with perfect mobile snapping
  const renderPropertyRow = (title: string, data: typeof properties, seeAllLink: string) => {
    if (!data || data.length === 0) return null;
    
    return (
      <div className="mt-4 mb-2 max-w-screen-2xl mx-auto w-full">
        <div className="flex justify-between items-end px-4 sm:px-6 lg:px-8 py-2 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-heading)] leading-none">{title}</h2>
          <span 
            onClick={() => navigate(seeAllLink)} 
            className="text-sm font-semibold text-[var(--color-accent)] cursor-pointer tracking-tight hover:text-[var(--color-accent-hover)] transition-colors flex items-center gap-1 group"
          >
            See all <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
        
        {/* Scroll Container: Snaps on mobile, seamless on desktop */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory px-4 sm:px-6 lg:px-8 pb-6 pt-2 items-stretch">
          {data.map((property) => (
            <div key={property.id} className="snap-start shrink-0 w-[85vw] sm:w-[300px] lg:w-[320px]">
              <PropertyCard 
                property={property} 
                isSaved={savedProperties.includes(property.id)}
                onToggleSave={toggleSave}
                onClick={() => {
                  setSelectedPropertyId(property.id);
                  navigate("/details");
                }} 
                layout="compact"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 w-full hide-scrollbar relative scroll-smooth flex flex-col pt-0 bg-app-bg">
      <PageHeader 
        title="Explore"
        actions={[
          { icon: <Search size={22} strokeWidth={1.8} />, label: "Search", onClick: () => navigate("/explore") },
          { icon: <SlidersHorizontal size={22} strokeWidth={1.8} />, label: "Filter", onClick: () => {} }
        ]}
        tabs={[
          { id: 'all', label: 'All' },
          { id: 'nearby', label: 'Nearby' },
          { id: 'featured', label: 'Featured' },
          { id: 'new', label: 'New Listings' }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'all' && (
        <>
          {/* MOBILE/TABLET HERO SEARCH PILL (Hidden on md+ because Header.tsx handles it) */}
          <div className="md:hidden px-4 sm:px-6 relative z-10 mb-2 mt-5 mx-auto w-full max-w-full">
            <button 
              onClick={() => navigate("/explore")}
              className="w-full bg-card-bg rounded-full p-2.5 pl-5 pr-3 flex items-center gap-4 shadow-[0_6px_16px_rgba(0,0,0,0.06)] border border-border-subtle transition-transform active:scale-[0.98]"
            >
              <Search size={22} className="text-text-primary" strokeWidth={2.5} />
              <div className="flex flex-col text-left flex-1 justify-center">
                <span className="text-[0.88rem] font-bold text-text-primary leading-tight tracking-wide">Where to?</span>
                <span className="text-[0.75rem] text-text-muted font-medium leading-tight mt-0.5">Search properties • Campus • Filters</span>
              </div>
            </button>
          </div>

          {/* FILTER CHIPS (Snapping Scroll) */}
          <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 pb-4 pt-4 max-w-screen-2xl mx-auto w-full snap-x">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`snap-start flex flex-row items-center gap-2 shrink-0 px-5 py-2.5 rounded-full text-[0.88rem] font-semibold transition-all border shadow-sm hover:shadow-md ${
                  activeFilter === f.id 
                    ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]' 
                    : 'bg-card-bg text-text-secondary border-border-subtle hover:border-[var(--color-accent-muted)]'
                }`}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>

          {/* RECENTLY VIEWED */}
          <RecentlyViewedStrip />

          {/* CAMPUS SECTIONS */}
          <div className="mt-4">
            {renderPropertyRow("Nearby Properties", properties.slice(0, 5), "/see-all/nearby")}
            {renderPropertyRow("Near ATU Campus", properties.filter(p => p.location?.includes('ATU')).length > 0 ? properties.filter(p => p.location?.includes('ATU')) : properties.slice(0, 4), "/see-all/atu")}
            {renderPropertyRow("Near UG Campus", properties.filter(p => p.location?.includes('UG')).length > 0 ? properties.filter(p => p.location?.includes('UG')) : [...properties].reverse().slice(0, 4), "/see-all/ug")}
          </div>

          {/* QUICK ACTIONS */}
          <div className="mt-2 text-text-primary px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto w-full pb-6">
            <div className="flex justify-between items-end py-2 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-heading)] leading-none">Quick Actions</h2>
            </div>
            
            <div className="card-wrapper">
              <div className="modern-card group" onClick={() => navigate("/virtual-tour")}>
                <div className="glass-orb" style={{ background: "radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, transparent 70%)" }}></div>
                <div className="icon-box" style={{ background: "transparent", color: "#b45309" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                </div>
                <div className="text-content relative z-10">
                  <h3>Virtual Tour</h3>
                  <p>See units live</p>
                </div>
                <div className="arrow">›</div>
              </div>

              <div className="modern-card group" onClick={() => navigate("/price-alerts")}>
                <div className="glass-orb" style={{ background: "radial-gradient(circle, rgba(52, 211, 153, 0.25) 0%, transparent 70%)" }}></div>
                <div className="icon-box" style={{ background: "transparent", color: "#047857" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                </div>
                <div className="text-content relative z-10">
                  <h3>Price Alerts</h3>
                  <p>Get notified</p>
                </div>
                <div className="arrow">›</div>
              </div>
            </div>
          </div>

          {/* FEATURED CAROUSEL */}
          <div className="mt-2 mb-8 max-w-screen-2xl mx-auto w-full">
            <div className="flex justify-between items-end px-4 sm:px-6 lg:px-8 py-2 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-heading)] leading-none">Featured Picks</h2>
              <span onClick={() => navigate('/see-all/featured')} className="text-sm font-semibold text-[var(--color-accent)] cursor-pointer tracking-tight hover:text-[var(--color-accent-hover)] transition-colors group">See all <ArrowRight size={14} className="inline group-hover:translate-x-0.5 transition-transform" /></span>
            </div>
            
            <div 
              className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth px-4 sm:px-6 lg:px-8 pb-6" 
              ref={trackRef} 
              onScroll={(e) => {
                const track = e.currentTarget;
                if (track.clientWidth === 0) return;
                const idx = Math.round(track.scrollLeft / track.clientWidth);
                setCurrentFeatured(idx);
              }}
            >
              {featuredProperties.map((feat, i) => (
                <div key={i} className="snap-center shrink-0 w-[90vw] sm:w-[400px] lg:w-[480px] bg-card-bg border border-border-subtle rounded-[24px] overflow-hidden shadow-sm hover:shadow-float transition-shadow group cursor-pointer isolate">
                  <div className="overflow-hidden h-[200px] sm:h-[240px]">
                    <img src={feat.img} alt={feat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-6 relative z-10 bg-card-bg">
                    <span className={`inline-flex items-center text-[0.7rem] font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-wider ${
                      feat.tagTheme === 'warning' ? 'bg-[var(--color-warning-muted)] text-[var(--color-warning)]' :
                      feat.tagTheme === 'accent' ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]' :
                      'bg-[var(--color-success-muted)] text-[var(--color-success)]'
                    }`}>
                      {feat.tag}
                    </span>
                    <h3 className="text-xl font-extrabold text-text-primary mb-2 tracking-tight">{feat.name}</h3>
                    <p className="text-[0.9rem] text-text-secondary leading-relaxed mb-6 line-clamp-2">
                      {feat.desc}
                    </p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPropertyId(feat.id);
                        navigate("/details");
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-[var(--color-surface-hover)] text-text-primary border border-border-subtle rounded-xl px-4 py-3.5 text-[0.9rem] font-bold transition-all hover:bg-[var(--color-accent)] hover:text-white hover:border-[var(--color-accent)] active:scale-[0.98]"
                    >
                      {feat.action} <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-2 mb-4">
              {featuredProperties.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentFeatured ? 'w-8 bg-[var(--color-accent)]' : 'w-2 bg-border-subtle'}`} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* RENDER OTHER TABS DYNAMICALLY (Grid scales all the way up to 2xl: monitors) */}
      {['nearby', 'featured', 'new'].includes(activeTab) && (
        <div className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8 pb-20">
          {(
            activeTab === 'nearby' ? properties :
            activeTab === 'featured' ? properties.filter(p => ['1', '2', '3'].includes(p.id.toString())) :
            [...properties].reverse()
          ).map(property => (
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
      )}
    </div>
  );
};