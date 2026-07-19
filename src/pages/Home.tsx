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

const PropertyRow = ({ title, data, seeAllLink, savedProperties, toggleSave, setSelectedPropertyId, navigate }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkLayout = () => {
      setIsMobile(window.innerWidth < 768);
      if (scrollRef.current) {
        setCanScroll(scrollRef.current.scrollWidth > scrollRef.current.clientWidth);
      }
    };
    checkLayout();
    window.addEventListener('resize', checkLayout);
    return () => window.removeEventListener('resize', checkLayout);
  }, [data]);

  const handleNext = () => {
    if (scrollRef.current) {
      const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({ left: maxScroll, behavior: 'smooth' });
      setScrolled(true);
    }
  };

  const handlePrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      setScrolled(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrolled(e.currentTarget.scrollLeft > 10);
  };

  if (!data || data.length === 0) return null;

  return (
    <div className="mt-8 mb-4 max-w-[1400px] mx-auto w-full flex flex-col px-6 lg:px-12">
      <div className="flex justify-between items-end py-4 pb-6 border-b border-border-subtle mb-6">
        <h2 className="text-3xl sm:text-4xl font-serif tracking-tighter text-text-primary leading-none">
          {title}
        </h2>
        <button 
          onClick={() => navigate(seeAllLink)} 
          className="text-xs uppercase tracking-widest font-semibold text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 pb-1"
        >
          View Collection <ArrowRight size={14} />
        </button>
      </div>
      
      <div className="relative group">
        {!isMobile && canScroll && scrolled && (
          <button 
            onClick={handlePrev}
            className="absolute -left-6 top-[40%] -translate-y-1/2 z-20 bg-white text-text-primary shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-full w-12 h-12 flex items-center justify-center hover:scale-105 hover:bg-text-primary hover:text-white transition-all cursor-pointer"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
        )}

        {!isMobile && canScroll && !scrolled && (
          <button 
            onClick={handleNext}
            className="absolute -right-6 top-[40%] -translate-y-1/2 z-20 bg-white text-text-primary shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-full w-12 h-12 flex items-center justify-center hover:scale-105 hover:bg-text-primary hover:text-white transition-all cursor-pointer"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        )}

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className={`flex gap-6 sm:gap-8 hide-scrollbar pb-8 pt-2 items-stretch scroll-smooth w-full ${isMobile ? 'snap-x snap-mandatory' : ''}`}
          style={{ overflowX: isMobile ? 'auto' : 'hidden' }}
        >
          {data.map((property: any) => (
            <div key={property.id} className="w-[75vw] sm:w-[320px] md:w-[360px] snap-start shrink-0 flex hover:-translate-y-2 transition-transform duration-500 ease-out">
              <PropertyCard 
                property={property} 
                isSaved={savedProperties.includes(property.id)}
                onToggleSave={toggleSave}
                onClick={() => {
                  setSelectedPropertyId(property.id);
                  navigate("/details");
                }} 
                layout="compact"
                className="rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-none bg-white"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Home: React.FC = () => {
  const { activeFilter, setActiveFilter, savedProperties, toggleSave, setSelectedPropertyId, properties } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentFeatured, setCurrentFeatured] = useState(0);
  
  // Referenced from 1783292641165.jpg (Lumina Living) for premium architectural aesthetic
  const featuredProperties = [
    {
      id: 1,
      img: 'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=1200',
      tag: 'TRENDING',
      name: 'Evandy Residence',
      desc: 'Shared study spaces, rooftop lounge, and curated social events. Built for those who demand more than just a unit.',
      action: 'Explore Property'
    },
    {
      id: 3,
      img: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
      tag: 'PREMIUM',
      name: 'Pentagon Annex',
      desc: 'Executive single suites with bespoke en-suite bathrooms. Uncompromising comfort and architectural privacy.',
      action: 'Explore Luxury'
    },
    {
      id: 2,
      img: 'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg?auto=compress&cs=tinysrgb&w=1200',
      tag: 'PRIME LOCATION',
      name: 'Bani Property',
      desc: 'Situated exactly 2 minutes from the main concourse. 24/7 security, climate control, and seamless connectivity.',
      action: 'See Location'
    }
  ];

  return (
    <div className="flex-1 w-full hide-scrollbar relative scroll-smooth flex flex-col pt-0 bg-[#fafafa]">
      
      {/* High-Craft Elite Hero Chamber */}
      <div className="relative w-full min-h-[60vh] flex flex-col justify-end px-6 lg:px-12 pb-12 pt-32 bg-white">
        <div className="max-w-[1400px] mx-auto w-full z-10 relative flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif tracking-tighter text-text-primary leading-[0.9] mb-6">
              Find Your<br/>Sanctuary.
            </h1>
            <p className="text-lg md:text-xl text-text-secondary font-sans max-w-md leading-relaxed">
              Curated living spaces blending contemporary comfort with unparalleled access.
            </p>
          </div>
          
          <div className="w-full lg:w-[400px]">
            <button 
              onClick={() => navigate("/explore")}
              className="w-full bg-white rounded-full p-5 flex items-center gap-4 shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-text-primary text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <Search size={18} strokeWidth={2} />
              </div>
              <span className="text-base font-medium text-text-secondary flex-1 tracking-wide group-hover:text-text-primary transition-colors">
                Search locations, properties...
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* FILTER CHIPS */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar px-6 lg:px-12 py-8 max-w-[1400px] mx-auto w-full">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`flex flex-row items-center gap-2 shrink-0 px-6 py-3 rounded-full text-sm font-semibold tracking-wide uppercase transition-all duration-300 ${
              activeFilter === f.id 
                ? 'bg-text-primary text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]' 
                : 'bg-white text-text-secondary hover:bg-gray-50 hover:text-text-primary shadow-sm'
            }`}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      {activeTab === 'all' && (
        <div className="w-full flex flex-col gap-12 pb-24">
          <RecentlyViewedStrip />

          {/* MACRO DETAILED PRODUCT FOCUS - FEATURED PICKS */}
          <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 mt-12">
            <div className="flex justify-between items-end pb-8 border-b border-border-subtle mb-8">
              <h2 className="text-3xl sm:text-4xl font-serif tracking-tighter text-text-primary leading-none">Curated Selections</h2>
              <button onClick={() => navigate('/see-all/featured')} className="text-xs uppercase tracking-widest font-semibold text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 pb-1">
                View Gallery <ArrowRight size={14} />
              </button>
            </div>
            
            <div 
              className="flex gap-6 overflow-x-auto hide-scrollbar scroll-smooth pb-12 snap-x snap-mandatory items-stretch" 
              ref={trackRef} 
            >
              {featuredProperties.map((feat, i) => (
                <div key={i} className="w-[85vw] sm:w-[500px] lg:w-[600px] shrink-0 snap-center flex flex-col bg-white rounded-[32px] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_60px_rgba(0,0,0,0.1)] transition-all duration-500 group cursor-pointer"
                     onClick={() => {
                        setSelectedPropertyId(feat.id);
                        navigate("/details");
                     }}>
                  <div className="relative w-full h-[300px] overflow-hidden">
                    <img src={feat.img} alt={feat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full">
                       <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary">{feat.tag}</span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1 bg-white">
                    <h3 className="text-3xl font-serif tracking-tighter text-text-primary mb-3">{feat.name}</h3>
                    <p className="text-base text-text-secondary leading-relaxed mb-8 font-sans max-w-[90%]">
                      {feat.desc}
                    </p>
                    <div className="mt-auto">
                      <div className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-text-primary group-hover:gap-5 transition-all">
                        {feat.action} <ArrowRight size={18} className="text-text-secondary group-hover:text-text-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <PropertyRow 
            title="Proximity Listings" 
            data={properties.slice(0, 8)} 
            seeAllLink="/see-all/nearby" 
            savedProperties={savedProperties} 
            toggleSave={toggleSave} 
            setSelectedPropertyId={setSelectedPropertyId} 
            navigate={navigate} 
          />
          
          <PropertyRow 
            title="University Sector" 
            data={properties.filter(p => p.location?.includes('UG')).length > 0 ? properties.filter(p => p.location?.includes('UG')) : [...properties].reverse().slice(0, 8)} 
            seeAllLink="/see-all/ug" 
            savedProperties={savedProperties} 
            toggleSave={toggleSave} 
            setSelectedPropertyId={setSelectedPropertyId} 
            navigate={navigate} 
          />

          {/* MODERNIST FEATURES ASYMMETRIC GRID - QUICK ACTIONS */}
          <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 py-16">
            <h2 className="text-3xl sm:text-4xl font-serif tracking-tighter text-text-primary leading-none mb-10">Client Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div onClick={() => navigate("/virtual-tour")} className="bg-white rounded-[32px] p-10 flex flex-col justify-between min-h-[240px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_50px_rgba(0,0,0,0.08)] transition-all cursor-pointer group border border-gray-100">
                <div className="w-14 h-14 rounded-full border border-border-subtle flex items-center justify-center mb-8 group-hover:bg-text-primary group-hover:text-white transition-colors text-text-primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                </div>
                <div>
                  <h3 className="text-2xl font-serif tracking-tight text-text-primary mb-2">Immersive Tours</h3>
                  <p className="text-text-secondary font-sans text-sm">Experience properties remotely in high fidelity.</p>
                </div>
              </div>

              <div onClick={() => navigate("/price-alerts")} className="bg-white rounded-[32px] p-10 flex flex-col justify-between min-h-[240px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_50px_rgba(0,0,0,0.08)] transition-all cursor-pointer group border border-gray-100">
                <div className="w-14 h-14 rounded-full border border-border-subtle flex items-center justify-center mb-8 group-hover:bg-text-primary group-hover:text-white transition-colors text-text-primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                </div>
                <div>
                  <h3 className="text-2xl font-serif tracking-tight text-text-primary mb-2">Market Intelligence</h3>
                  <p className="text-text-secondary font-sans text-sm">Receive bespoke notifications on price adjustments.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};