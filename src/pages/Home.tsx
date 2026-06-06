import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from 'react';

import { MapContainer, TileLayer } from 'react-leaflet';
import { useAppContext } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { PageHeader } from '../components/layout/PageHeader';
import { RecentlyViewedStrip } from "../components/RecentlyViewedStrip";
import { MapPin, ChevronRight, Video, Bell, Scale, UserPlus, Grip, DoorClosed, Users, School, Tag, Wifi, Star, Search, SlidersHorizontal } from 'lucide-react';


const FILTERS = [
  { id: 'all', label: 'All', icon: <Grip size={14} /> },
  { id: 'private', label: 'Private', icon: <DoorClosed size={14} /> },
  { id: 'shared', label: 'Shared', icon: <Users size={14} /> },
  { id: 'campus', label: 'Near Campus', icon: <School size={14} /> },
  { id: 'budget', label: 'Budget', icon: <Tag size={14} /> },
  { id: 'wifi', label: 'Wi-Fi', icon: <Wifi size={14} /> },
];

export const Home: React.FC = () => {
  const { activeFilter, setActiveFilter, setCurrentView, savedProperties, toggleSave, showToast, setSelectedPropertyId, setExploreSearchQuery, properties } = useAppContext();
  const navigate = useNavigate();
  
  // Featured Picks auto-sliding carousel (like index.html)
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const featuredProperties = [
    {
      id: 1,
      img: 'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=800',
      tag: '🔥 Trending',
      tagColor: 'amber',
      name: 'Evandy Property',
      desc: 'Shared study spaces, rooftop lounge, and weekly social events. Built for students who want more than just a unit.',
      action: 'Explore Property →'
    },
    {
      id: 3,
      img: 'https://loremflickr.com/600/400/bedroom?lock=101',
      tag: '⭐ Premium',
      tagColor: 'indigo',
      name: 'Pentagon Annex',
      desc: 'Executive single suites with en-suite bathrooms. For students who won\'t compromise on comfort and privacy.',
      action: 'Explore Luxury →'
    },
    {
      id: 2,
      img: 'https://loremflickr.com/600/400/bedroom?lock=102',
      tag: '📍 Best Location',
      tagColor: 'teal',
      name: 'Bani Property',
      desc: 'Exactly 2 minutes from the main gate, with 24/7 security, steady electricity, and free Wi-Fi included.',
      action: 'See Location →'
    }
  ];

  // Testimonials
  const testimonials = [
    { init: 'AK', name: 'Abena Korantema', sub: 'Level 200, UG · Legon Annex', body: '"SkyCobe literally saved me hours of stress. I found my unit, viewed photos, and booked online before even arriving in Accra."' },
    { init: 'KO', name: 'Kwame Owusu', sub: 'Level 300, Ashesi', body: '"The seamless booking process connected me to my ideal property in minutes. I\'d never have found it without this app. 10/10!"' },
    { init: 'EA', name: 'Efua Asante', sub: 'Fresher, KNUST', body: '"So easy to use. I viewed 6 properties in under 10 minutes and found one within my budget near the main gate."' },
  ];
  const [tIdx, setTIdx] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setTIdx((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(int);
  }, [testimonials.length]);

  return (
    <div className="flex-1 w-full hide-scrollbar relative scroll-smooth flex flex-col pt-0">
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
        activeTab="all"
        onTabChange={() => {}}
      />

      {/* SEARCH BAR UNDER HEADER */}
      <div className="px-4 sm:px-6 lg:px-8 relative z-10 mb-4 mt-6 max-w-4xl mx-auto w-full">
        <button 
          onClick={() => navigate("/explore")}
          className="w-full bg-card-bg rounded-2xl p-4 flex items-center gap-3 shadow-float border border-[var(--color-border)] transition-transform hover:-translate-y-[1px] text-left"
        >
          <MapPin size={22} className="text-text-primary" />
          <span className="text-base font-semibold text-text-muted flex-1">Where do you want to live?</span>
        </button>
      </div>

      {/* FILTER CHIPS */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pl-5 pr-5 pb-2 pt-4">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`flex flex-row items-center gap-1.5 shrink-0 px-4 py-2 rounded-full text-[0.82rem] font-medium transition-all shadow-[0_1px_4px_rgba(55,48,163,0.06)] border ${
              activeFilter === f.id 
                ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-[0_4px_12px_rgba(55,48,163,0.25)]' 
                : 'bg-card-bg text-text-muted border-transparent hover:bg-app-bg'
            }`}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      {/* NEARBY PROPERTIES */}
      <div className="mt-4 mb-2 max-w-screen-2xl mx-auto w-full">
        <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 pb-3">
          <h2 className="font-montserrat text-xl sm:text-2xl font-black tracking-tight text-text-primary">Nearby Properties</h2>
          <span className="text-sm font-semibold text-[var(--color-accent)] cursor-pointer tracking-tight hover:underline">See all →</span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 pb-4 pt-2 items-stretch">
          {properties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              isSaved={savedProperties.includes(property.id)}
              onToggleSave={toggleSave}
              onClick={() => {
                setSelectedPropertyId(property.id);
                navigate("/details");
              }} 
              layout="compact"
            />
          ))}
        </div>
      </div>

      {/* PROMO BANNER */}
      <div 
        className="mx-4 sm:mx-5 mb-4 rounded-[18px] p-4 flex items-center justify-between relative overflow-hidden shadow-[0_6px_20px_rgba(55,48,163,0.25)]"
        style={{ background: 'linear-gradient(135deg, var(--color-indigo) 0%, #7c3aed 100%)' }}
      >
        <div className="absolute -top-[30px] -right-[30px] w-[100px] h-[100px] rounded-full bg-[var(--color-surface)]/10" />
        <div className="relative z-10">
          <p className="text-white/65 text-[0.55rem] uppercase tracking-[0.5px] font-medium mb-1">🎓 First semester deal</p>
          <h3 className="text-white text-[0.91rem] font-bold leading-tight">15% off your first booking</h3>
        </div>
        <button 
          onClick={() => {
            navigator.clipboard.writeText('DWELL15');
            showToast('Promo code DWELL15 copied!');
          }}
          className="relative z-10 bg-amber-glow text-white border-none rounded-[10px] px-4 py-2 text-[0.82rem] font-bold shadow-sm whitespace-nowrap active:scale-95 transition-transform"
        >
          Claim now
        </button>
      </div>

      {/* QUICK ACTIONS */}
      <div className="mt-2 text-text-primary px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto w-full">
        <div className="flex justify-between items-center py-4 pb-3">
          <h2 className="font-montserrat text-xl sm:text-2xl font-black tracking-tight text-text-primary">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
          <div className="bg-card-bg rounded-2xl sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-zinc-100 shadow-sm cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col gap-3"
               onClick={() => navigate("/virtual-tour")}>
            <div className="flex justify-between items-start w-full">
              <div className="w-[42px] h-[42px] rounded-[14px] flex items-center justify-center shrink-0 bg-amber-light text-amber-500">
                <Video size={18} />
              </div>
              <ChevronRight size={14} className="text-slate-300 mt-1 transition-all group-hover:translate-x-1 group-hover:text-[var(--color-accent)]" />
            </div>
            <div>
              <strong className="block text-[0.9rem] font-bold text-text-primary mb-1">Virtual Tour</strong>
              <span className="block text-[0.75rem] text-text-muted leading-tight">See units live</span>
            </div>
          </div>

          <div className="bg-card-bg rounded-2xl sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-zinc-100 shadow-sm cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col gap-3"
               onClick={() => navigate("/price-alerts")}>
            <div className="flex justify-between items-start w-full">
              <div className="w-[42px] h-[42px] rounded-[14px] flex items-center justify-center shrink-0 bg-teal-light text-teal-600">
                <Bell size={18} />
              </div>
              <ChevronRight size={14} className="text-slate-300 mt-1 transition-all group-hover:translate-x-1 group-hover:text-[var(--color-accent)]" />
            </div>
            <div>
              <strong className="block text-[0.9rem] font-bold text-text-primary mb-1">Price Alerts</strong>
              <span className="block text-[0.75rem] text-text-muted leading-tight">Get notified</span>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURED CAROUSEL */}
      <div className="mt-2">
        <div className="flex justify-between items-center px-4 sm:px-5 py-4 pb-3">
          <h2 className="font-montserrat text-[0.9rem] sm:text-[1.1rem] font-black tracking-tight text-text-primary">Featured Picks</h2>
        </div>
        <div className="px-4 sm:px-5">
          <div className="flex gap-0 overflow-x-auto snap-x snap-mandatory hide-scrollbar rounded-[20px] border border-border-subtle shadow-float scroll-smooth" ref={trackRef} onScroll={(e) => {
            const track = e.currentTarget;
            if (track.clientWidth === 0) return;
            const idx = Math.round(track.scrollLeft / track.clientWidth);
            setCurrentFeatured(idx);
          }}>
            {featuredProperties.map((feat, i) => (
              <div key={i} className="min-w-full snap-start bg-card-bg rounded-[20px] overflow-hidden">
                <img src={feat.img} alt={feat.name} className="w-full h-[170px] object-cover" />
                <div className="p-[18px]">
                  <span className={`inline-block text-[0.7rem] font-bold px-[8px] py-[3px] rounded-[6px] mb-2 uppercase tracking-[0.4px] ${
                    feat.tagColor === 'amber' ? 'bg-amber-light text-amber-500' :
                    feat.tagColor === 'indigo' ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]' :
                    'bg-teal-light text-teal-600'
                  }`}>
                    {feat.tag}
                  </span>
                  <h3 className="font-fraunces text-[1.1rem] font-bold text-text-primary mb-[4px]">{feat.name}</h3>
                  <p className="text-[0.85rem] text-text-muted leading-[1.6] mb-[14px] line-clamp-2">
                    {feat.desc}
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedPropertyId(feat.id);
                      navigate("/details");
                    }}
                    className="bg-amber-glow text-white border-none rounded-[12px] px-[20px] py-[10px] text-[0.88rem] font-bold cursor-pointer transition-colors shadow-[0_4px_14px_rgba(245,158,11,0.3)] hover:bg-[#d97706] active:scale-95"
                  >
                    {feat.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-[6px] mt-[12px] mb-[4px]">
            {featuredProperties.map((_, i) => (
              <div key={i} className={`h-[7px] rounded-full transition-all duration-300 ${i === currentFeatured ? 'w-[22px] bg-[var(--color-accent)]' : 'w-[7px] bg-[#d1d5db]'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* RECENTLY VIEWED */}
      <div className="mt-4 pb-2">
        <RecentlyViewedStrip />
      </div>

      {/* MAP VIEW */}
      <div className="mt-2 text-text-primary">
        <div className="flex justify-between items-center px-4 sm:px-5 py-4 pb-3">
          <h2 className="font-montserrat text-[0.9rem] sm:text-[1.1rem] font-black tracking-tight text-text-primary">Map View</h2>
        </div>
        <div className="px-4 sm:px-5 pb-6">
          <div className="h-[200px] rounded-[18px] overflow-hidden border border-border-subtle shadow-card relative cursor-pointer z-0 isolate" onClick={() => navigate("/explore")}>
              <MapContainer center={[5.6506, -0.1870]} zoom={14} className="w-full h-full !z-0" zoomControl={false} dragging={false} style={{ zIndex: 0 }}>
                <TileLayer
                   url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                   attribution="Google"
                />
                <div className="absolute inset-0 bg-transparent z-[1000]" /> {/* Click interceptor */}
              </MapContainer>
          </div>
        </div>
      </div>

    </div>
  );
};
