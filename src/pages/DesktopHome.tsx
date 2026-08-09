import { useNavigate } from "react-router-dom";
import React, { useRef, useState, useEffect } from 'react';

import { useAppContext } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { PageHeader } from '../components/layout/PageHeader';
import { RecentlyViewedStrip } from "../components/RecentlyViewedStrip";
import { MapPin, Grip, DoorClosed, Users, School, Tag, Wifi, Search, SlidersHorizontal, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const FILTERS = [
  { id: 'all', label: 'All', icon: <Grip size={14} /> },
  { id: 'private', label: 'Private', icon: <DoorClosed size={14} /> },
  { id: 'shared', label: 'Shared', icon: <Users size={14} /> },
  { id: 'campus', label: 'Near Campus', icon: <School size={14} /> },
  { id: 'budget', label: 'Budget', icon: <Tag size={14} /> },
  { id: 'wifi', label: 'Wi-Fi', icon: <Wifi size={14} /> },
];

// Dedicated component to handle stateful, binary sliding per row
const PropertyRow = ({ title, data, seeAllLink, savedProperties, toggleSave, setSelectedPropertyId, navigate }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  
  // React-based screen detection (Fail-safe)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkLayout = () => {
      setIsMobile(window.innerWidth < 768); // 768px is Tailwind's 'md' breakpoint
      if (scrollRef.current) {
        setCanScroll(scrollRef.current.scrollWidth > scrollRef.current.clientWidth);
      }
    };
    
    // Check on mount and resize
    checkLayout();
    window.addEventListener('resize', checkLayout);
    return () => window.removeEventListener('resize', checkLayout);
  }, [data]);

  const handleNext = () => {
    if (scrollRef.current) {
      // Slide exactly to the end
      const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({ left: maxScroll, behavior: 'smooth' });
      setScrolled(true);
    }
  };

  const handlePrev = () => {
    if (scrollRef.current) {
      // Slide exactly back to the beginning
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      setScrolled(false);
    }
  };

  // Sync state if a desktop user swipes with a trackpad
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrolled(e.currentTarget.scrollLeft > 10);
  };

  if (!data || data.length === 0) return null;

  return (
    <div className="mt-4 mb-2 max-w-screen-2xl mx-auto w-full flex flex-col px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4 pb-4">
        <h2 className="text-[1.05rem] sm:text-[1.2rem] font-semibold tracking-tight text-[var(--color-heading)] leading-tight">{title}</h2>
        <span 
          onClick={() => navigate(seeAllLink)} 
          className="text-sm font-semibold text-[var(--color-accent)] cursor-pointer tracking-tight hover:text-[var(--color-accent-hover)] transition-colors flex items-center gap-1"
        >
          See all <ArrowRight size={14} />
        </span>
      </div>
      
      <div className="relative group">
        
        {/* Left Arrow - Strict conditional render (only runs if NOT mobile) */}
        {!isMobile && canScroll && scrolled && (
          <button 
            onClick={handlePrev}
            className="absolute -left-3 lg:-left-5 top-[40%] -translate-y-1/2 z-20 bg-card-bg/95 backdrop-blur-md text-text-primary shadow-[0_4px_16px_rgba(0,0,0,0.15)] rounded-full w-10 h-10 flex items-center justify-center border border-border-subtle hover:scale-110 hover:bg-[var(--color-button)] hover:text-white transition-all cursor-pointer"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* Right Arrow - Strict conditional render (only runs if NOT mobile) */}
        {!isMobile && canScroll && !scrolled && (
          <button 
            onClick={handleNext}
            className="absolute -right-3 lg:-right-5 top-[40%] -translate-y-1/2 z-20 bg-card-bg/95 backdrop-blur-md text-text-primary shadow-[0_4px_16px_rgba(0,0,0,0.15)] rounded-full w-10 h-10 flex items-center justify-center border border-border-subtle hover:scale-110 hover:bg-[var(--color-button)] hover:text-white transition-all cursor-pointer"
          >
            <ChevronRight size={22} />
          </button>
        )}

        {/* Container 
            Inline overflowX guarantees global CSS cannot freeze the scroll effect
        */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className={`flex gap-4 sm:gap-5 hide-scrollbar pb-6 pt-2 items-stretch scroll-smooth w-full ${isMobile ? 'snap-x snap-mandatory' : ''}`}
          style={{ 
            overflowX: isMobile ? 'auto' : 'hidden', // Inline style forces native scroll on mobile
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none' 
          }}
        >
           {/* Sizing: 85vw on mobile, 200px square on desktop */}
          {data.map((property: any) => (
            <div key={property.id} className="w-[65vw] sm:w-[300px] md:w-[200px] snap-start shrink-0 flex hover:-translate-y-1 transition-transform duration-300">
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
    </div>
  );
};

export const DesktopHome: React.FC = () => {
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
          {/* SEARCH BAR UNDER HEADER */}
          <div className="px-4 sm:px-6 lg:px-8 relative z-10 mb-4 mt-6 max-w-4xl mx-auto w-full">
            <button 
              onClick={() => navigate("/explore")}
              className="w-full bg-card-bg rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-border-subtle transition-all hover:shadow-md hover:border-[var(--color-accent-muted)] text-left group"
            >
              <MapPin size={22} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
              <span className="text-base font-semibold text-text-muted flex-1 group-hover:text-text-primary transition-colors">Where do you want to live?</span>
            </button>
          </div>

          {/* FILTER CHIPS */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 pb-2 pt-4 max-w-screen-2xl mx-auto w-full">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`flex flex-row items-center gap-1.5 shrink-0 px-4 py-2.5 rounded-full text-[0.85rem] font-medium transition-all border ${
                  activeFilter === f.id 
                    ? 'bg-[var(--color-button)] text-white border-transparent shadow-[var(--shadow-button)]' 
                    : 'bg-card-bg text-text-secondary border-border-subtle hover:bg-[var(--color-surface-hover)] hover:text-text-primary'
                }`}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>

           {/* RECENTLY VIEWED */}
            <RecentlyViewedStrip />

          {/* CAMPUS SECTIONS USING NEW COMPONENT */}
          <PropertyRow 
            title="Nearby Properties" 
            data={properties.slice(0, 8)} 
            seeAllLink="/see-all/nearby" 
            savedProperties={savedProperties} 
            toggleSave={toggleSave} 
            setSelectedPropertyId={setSelectedPropertyId} 
            navigate={navigate} 
          />
          <PropertyRow 
            title="Near ATU Campus" 
            data={properties.filter(p => p.location?.includes('ATU')).length > 0 ? properties.filter(p => p.location?.includes('ATU')) : properties.slice(0, 8)} 
            seeAllLink="/see-all/atu" 
            savedProperties={savedProperties} 
            toggleSave={toggleSave} 
            setSelectedPropertyId={setSelectedPropertyId} 
            navigate={navigate} 
          />
          <PropertyRow 
            title="Near UG Campus" 
            data={properties.filter(p => p.location?.includes('UG')).length > 0 ? properties.filter(p => p.location?.includes('UG')) : [...properties].reverse().slice(0, 8)} 
            seeAllLink="/see-all/ug" 
            savedProperties={savedProperties} 
            toggleSave={toggleSave} 
            setSelectedPropertyId={setSelectedPropertyId} 
            navigate={navigate} 
          />

          {/* QUICK ACTIONS */}
          <div className="mt-2 text-text-primary px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto w-full pb-4">
            <div className="flex justify-between items-center py-4 pb-3">
              <h2 className="text-[1.05rem] sm:text-[1.2rem] font-semibold tracking-tight text-[var(--color-heading)] leading-tight">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <div className="modern-card" onClick={() => navigate("/virtual-tour")}>
                <div className="glass-orb" style={{ background: "radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%)" }}></div>
                <div className="icon-box" style={{ background: "transparent", color: "#b45309" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                </div>
                <div className="text-content">
                  <h3>Virtual Tour</h3>
                  <p>See units live</p>
                </div>
                <div className="arrow">›</div>
              </div>

              <div className="modern-card" onClick={() => navigate("/price-alerts")}>
                <div className="glass-orb" style={{ background: "radial-gradient(circle, rgba(52, 211, 153, 0.2) 0%, transparent 70%)" }}></div>
                <div className="icon-box" style={{ background: "transparent", color: "#047857" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                </div>
                <div className="text-content">
                  <h3>Price Alerts</h3>
                  <p>Get notified</p>
                </div>
                <div className="arrow">›</div>
              </div>
            </div>
          </div>

          {/* FEATURED CAROUSEL */}
          <div className="mt-2 max-w-screen-2xl mx-auto w-full">
            <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 pb-3">
              <h2 className="text-[1.05rem] sm:text-[1.2rem] font-semibold tracking-tight text-[var(--color-heading)] leading-tight">Featured Picks</h2>
              <span onClick={() => navigate('/see-all/featured')} className="text-sm font-semibold text-[var(--color-accent)] cursor-pointer tracking-tight hover:text-[var(--color-accent-hover)] transition-colors">See all →</span>
            </div>
            
            <div className="px-4 sm:px-6 lg:px-8">
              <div 
                className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar scroll-smooth pb-4 snap-x snap-mandatory items-stretch" 
                ref={trackRef} 
                onScroll={(e) => {
                  const track = e.currentTarget;
                  if (track.clientWidth === 0) return;
                  const idx = Math.round(track.scrollLeft / track.clientWidth);
                  setCurrentFeatured(idx);
                }}
              >
                {featuredProperties.map((feat, i) => (
                  <div key={i} className="w-[85vw] sm:w-[400px] lg:w-[420px] shrink-0 snap-center flex flex-col bg-card-bg border border-border-subtle rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <img src={feat.img} alt={feat.name} className="w-full h-48 sm:h-52 object-cover" />
                    <div className="p-5 flex flex-col flex-1">
                      <span className={`inline-flex items-center self-start text-xs font-bold px-2.5 py-1 rounded-md mb-3 uppercase tracking-wider ${
                        feat.tagTheme === 'warning' ? 'bg-[var(--color-warning-muted)] text-[var(--color-warning)]' :
                        feat.tagTheme === 'accent' ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]' :
                        'bg-[var(--color-success-muted)] text-[var(--color-success)]'
                      }`}>
                        {feat.tag}
                      </span>
                      <h3 className="text-lg font-bold text-text-primary mb-1">{feat.name}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
                        {feat.desc}
                      </p>
                      <div className="mt-auto pt-2">
                        <button 
                          onClick={() => {
                            setSelectedPropertyId(feat.id);
                            navigate("/details");
                          }}
                          className="w-full flex items-center justify-center gap-2 bg-[var(--color-surface-hover)] text-text-primary border border-border-subtle rounded-xl px-4 py-2.5 text-sm font-bold cursor-pointer transition-all hover:bg-[var(--color-button)] hover:text-white hover:border-[var(--color-accent)] active:scale-[0.98]"
                        >
                          {feat.action} <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Carousel Indicators */}
              <div className="flex justify-center gap-1.5 mt-1 mb-2">
                {featuredProperties.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentFeatured ? 'w-6 bg-[var(--color-button)]' : 'w-1.5 bg-border-subtle'}`} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* RENDER OTHER TABS DYNAMICALLY */}
      {['nearby', 'featured', 'new'].includes(activeTab) && (
        <div className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-20">
          {(
            activeTab === 'nearby' ? properties.slice(0, 5) :
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