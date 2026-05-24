import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from 'react';
import { HiLocationMarker } from 'react-icons/hi';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useAppContext } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { MapPin, ChevronRight, Video, Bell, Scale, UserPlus, Grip, DoorClosed, Users, School, Tag, Wifi, Star, Search } from 'lucide-react';
import { Header } from '../components/Header';

const FILTERS = [
  { id: 'all', label: 'All', icon: <Grip size={14} /> },
  { id: 'private', label: 'Private', icon: <DoorClosed size={14} /> },
  { id: 'shared', label: 'Shared', icon: <Users size={14} /> },
  { id: 'campus', label: 'Near Campus', icon: <School size={14} /> },
  { id: 'budget', label: 'Budget', icon: <Tag size={14} /> },
  { id: 'wifi', label: 'Wi-Fi', icon: <Wifi size={14} /> },
];

export const Home: React.FC = () => {
  const { activeFilter, setActiveFilter, setCurrentView, savedHostels, toggleSave, showToast, setSelectedHostelId, setExploreSearchQuery, hostels } = useAppContext();
  const navigate = useNavigate();
  
  // Featured Picks auto-sliding carousel (like index.html)
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const featuredHostels = [
    {
      id: 1,
      img: 'https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=800',
      tag: '🔥 Trending',
      tagColor: 'amber',
      name: 'Evandy Hostel',
      desc: 'Shared study spaces, rooftop lounge, and weekly social events. Built for students who want more than just a room.',
      action: 'Explore Hostel →'
    },
    {
      id: 3,
      img: 'https://loremflickr.com/600/400/bedroom?lock=101',
      tag: '⭐ Premium',
      tagColor: 'indigo',
      name: 'Pentagon Annex',
      desc: 'Executive single rooms with en-suite bathrooms. For students who won\'t compromise on comfort and privacy.',
      action: 'Explore Luxury →'
    },
    {
      id: 2,
      img: 'https://loremflickr.com/600/400/bedroom?lock=102',
      tag: '📍 Best Location',
      tagColor: 'teal',
      name: 'Bani Hostel',
      desc: 'Exactly 2 minutes from the main gate, with 24/7 security, steady electricity, and free Wi-Fi included.',
      action: 'See Location →'
    }
  ];

  // Testimonials
  const testimonials = [
    { init: 'AK', name: 'Abena Korantema', sub: 'Level 200, UG · Legon Annex', body: '"UniNest literally saved me hours of stress. I found my room, viewed photos, and booked online before even arriving in Accra."' },
    { init: 'KO', name: 'Kwame Owusu', sub: 'Level 300, Ashesi', body: '"The seamless booking process connected me to my ideal hostel in minutes. I\'d never have found it without this app. 10/10!"' },
    { init: 'EA', name: 'Efua Asante', sub: 'Fresher, KNUST', body: '"So easy to use. I viewed 6 hostels in under 10 minutes and found one within my budget near the main gate."' },
  ];
  const [tIdx, setTIdx] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setTIdx((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(int);
  }, [testimonials.length]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar pb-[70px] relative scroll-smooth">
      <Header />
      {/* SEARCH BAR UNDER HEADER */}
      <div className="px-5 relative z-10 mb-4 mt-6">
        <button 
          onClick={() => navigate("/explore")}
          className="w-full bg-card-bg rounded-2xl p-4 flex items-center gap-3 shadow-float border border-gray-200 transition-transform hover:-translate-y-[1px] text-left"
        >
          <HiLocationMarker size={22} className="text-text-primary" />
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
                ? 'bg-indigo text-white border-indigo shadow-[0_4px_12px_rgba(55,48,163,0.25)]' 
                : 'bg-card-bg text-text-muted border-transparent hover:bg-app-bg'
            }`}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      {/* NEARBY HOSTELS */}
      <div className="mt-4 mb-2">
        <div className="flex justify-between items-center px-4 sm:px-5 py-4 pb-3">
          <h2 className="font-montserrat text-[0.9rem] sm:text-[1.1rem] font-black tracking-tight text-text-primary">Nearby Hostels</h2>
          <span className="text-[0.7rem] font-semibold text-indigo cursor-pointer tracking-tight">See all →</span>
        </div>
        
        <div className="flex gap-3.5 overflow-x-auto hide-scrollbar pl-5 pr-5 pb-4 items-stretch">
          {hostels.map((hostel) => (
            <PropertyCard 
              key={hostel.id} 
              hostel={hostel} 
              isSaved={savedHostels.includes(hostel.id)}
              onToggleSave={toggleSave}
              onClick={() => {
                setSelectedHostelId(hostel.id);
                navigate("/details");
              }} 
            />
          ))}
        </div>
      </div>

      {/* PROMO BANNER */}
      <div 
        className="mx-4 sm:mx-5 mb-4 rounded-[18px] p-4 flex items-center justify-between relative overflow-hidden shadow-[0_6px_20px_rgba(55,48,163,0.25)]"
        style={{ background: 'linear-gradient(135deg, var(--color-indigo) 0%, #7c3aed 100%)' }}
      >
        <div className="absolute -top-[30px] -right-[30px] w-[100px] h-[100px] rounded-full bg-white/10" />
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
      <div className="mt-2 text-text-primary">
        <div className="flex justify-between items-center px-4 sm:px-5 py-4 pb-3">
          <h2 className="font-montserrat text-[0.9rem] sm:text-[1.1rem] font-black tracking-tight text-text-primary">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 gap-3.5 px-4 sm:px-5 pb-4">
          <div className="bg-card-bg rounded-[18px] p-4 border-transparent border shadow-card cursor-pointer group transition-all hover:-translate-y-[3px] hover:shadow-float flex flex-col gap-3"
               onClick={() => navigate("/virtual-tour")}>
            <div className="flex justify-between items-start w-full">
              <div className="w-[42px] h-[42px] rounded-[14px] flex items-center justify-center shrink-0 bg-amber-light text-amber-500">
                <Video size={18} />
              </div>
              <ChevronRight size={14} className="text-slate-300 mt-1 transition-all group-hover:translate-x-1 group-hover:text-indigo" />
            </div>
            <div>
              <strong className="block text-[0.9rem] font-bold text-text-primary mb-1">Virtual Tour</strong>
              <span className="block text-[0.75rem] text-text-muted leading-tight">See rooms live</span>
            </div>
          </div>

          <div className="bg-card-bg rounded-[18px] p-4 border-transparent border shadow-card cursor-pointer group transition-all hover:-translate-y-[3px] hover:shadow-float flex flex-col gap-3"
               onClick={() => navigate("/price-alerts")}>
            <div className="flex justify-between items-start w-full">
              <div className="w-[42px] h-[42px] rounded-[14px] flex items-center justify-center shrink-0 bg-teal-light text-teal-600">
                <Bell size={18} />
              </div>
              <ChevronRight size={14} className="text-slate-300 mt-1 transition-all group-hover:translate-x-1 group-hover:text-indigo" />
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
            {featuredHostels.map((feat, i) => (
              <div key={i} className="min-w-full snap-start bg-card-bg rounded-[20px] overflow-hidden">
                <img src={feat.img} alt={feat.name} className="w-full h-[170px] object-cover" />
                <div className="p-[18px]">
                  <span className={`inline-block text-[0.7rem] font-bold px-[8px] py-[3px] rounded-[6px] mb-2 uppercase tracking-[0.4px] ${
                    feat.tagColor === 'amber' ? 'bg-amber-light text-amber-500' :
                    feat.tagColor === 'indigo' ? 'bg-indigo-light text-indigo' :
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
                      setSelectedHostelId(feat.id);
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
            {featuredHostels.map((_, i) => (
              <div key={i} className={`h-[7px] rounded-full transition-all duration-300 ${i === currentFeatured ? 'w-[22px] bg-indigo' : 'w-[7px] bg-[#d1d5db]'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIAL */}
      <div className="mt-2 text-text-primary">
        <div className="flex justify-between items-center px-4 sm:px-5 py-4 pb-3">
          <h2 className="font-montserrat text-[0.9rem] sm:text-[1.1rem] font-black tracking-tight text-text-primary">What Students Say</h2>
        </div>
        <div className="mx-4 sm:mx-5 mb-[4px] bg-card-bg rounded-[18px] p-[18px] border-transparent border shadow-card group">
          <div className="flex items-center gap-[12px] mb-[12px]">
            <div className="w-[40px] h-[40px] rounded-full bg-indigo-light flex items-center justify-center font-bold text-[0.85rem] text-indigo shrink-0">
              {testimonials[tIdx].init}
            </div>
            <div>
              <strong className="block text-[0.88rem] font-semibold text-text-primary">{testimonials[tIdx].name}</strong>
              <span className="text-[0.75rem] text-text-muted">{testimonials[tIdx].sub}</span>
            </div>
          </div>
          <div className="flex gap-[2px] mb-[8px] text-[#fbbf24]">
            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" strokeWidth={0} />)}
          </div>
          <p className="text-[0.85rem] text-text-muted leading-[1.65] italic transition-all duration-300 min-h-[60px]">
            {testimonials[tIdx].body}
          </p>
          <span className="inline-block mt-[10px] bg-indigo-light text-indigo text-[0.7rem] font-bold px-[9px] py-[3px] rounded-[6px]">
            Verified Tenant
          </span>
        </div>
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
