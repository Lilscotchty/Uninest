import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, useAnimation, PanInfo } from 'motion/react';
import { ChevronLeft, MapPin, Search, Navigation, Heart, Star, Layers } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';

const formatShortPrice = (num: number) => {
  if (!num) return '';
  if (num >= 1000) return `GH₵${(num / 1000).toFixed(1).replace('.0', '')}k`;
  return `GH₵${num}`;
};

// Dummy icon for exact location using round image
const getCustomIcon = (img: string, priceNum?: number) => {
  const priceLabel = priceNum ? formatShortPrice(priceNum) : '';
  return new L.DivIcon({
    className: 'custom-marker',
    html: `
      <div style="position:relative;width:56px;height:56px;border-radius:50%;border:2.5px solid white;box-shadow:0 4px 16px rgba(15, 23, 42, 0.4);overflow:visible;background:white;">
        <img src="${img}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;filter:brightness(0.65);" />
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;border-radius:50%;">
          <span style="color:white;font-weight:700;font-size:11px;text-align:center;text-shadow:0 1px 4px rgba(0,0,0,0.9);letter-spacing:-0.2px;">${priceLabel}</span>
        </div>
        <div style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);border-width:8px 6px 0;border-style:solid;border-color:white transparent transparent;"></div>
      </div>
    `,
    iconSize: [56, 64],
    iconAnchor: [28, 64],
  });
};

interface Offsets {
  [id: number]: { lat: number; lng: number };
}

const MapUpdater = ({ center, isVisible }: { center: [number, number] | null, isVisible: boolean }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true, duration: 0.4 });
    }
  }, [center, map]);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        map.invalidateSize();
      }, 50);
    }
  }, [isVisible, map]);
  return null;
};

export const Explore: React.FC = () => {
  const { currentView, setCurrentView, savedProperties, toggleSave, setSelectedPropertyId, exploreSearchQuery, setExploreSearchQuery, properties } = useAppContext();
  const navigate = useNavigate();
  
  // Drawer states
  const drawerControls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  const [peekPropertyId, setPeekPropertyId] = useState<number | null>(null);
  const [localSearch, setLocalSearch] = useState(exploreSearchQuery || '');
  const [mapMode, setMapMode] = useState<'standard' | 'satellite'>('standard');

  const peekProperty = peekPropertyId ? properties.find(h => h.id === peekPropertyId) : null;

  const filteredProperties = properties.filter(h => {
    const searchLower = localSearch.toLowerCase();
    return h.name.toLowerCase().includes(searchLower) || h.loc.toLowerCase().includes(searchLower) || h.tags.some(t => t.toLowerCase().includes(searchLower));
  });

  const snapTo = (state: 'peek' | 'half' | 'full') => {
    if (!containerRef.current) return;
    const height = containerRef.current.offsetHeight;
    
    let y = 0;
    if (state === 'full') y = 0; // Top of container
    if (state === 'half') y = height * 0.5;
    if (state === 'peek') y = height - 110; // 110px from bottom

    drawerControls.start({ y, transition: { type: 'spring', bounce: 0, duration: 0.4 } });
  };

  // Initial snap to half, and re-snap if measuring was 0 when opened
  const [hasSnapped, setHasSnapped] = useState(false);
  useEffect(() => {
    if (currentView === 'explore' && !hasSnapped) {
      setTimeout(() => {
        snapTo('half');
        setHasSnapped(true);
      }, 10);
    }
  }, [currentView, hasSnapped]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!containerRef.current) return;
    const height = containerRef.current.offsetHeight;
    const currentY = info.point.y;
    const velocity = info.velocity.y;

    // Determine target based on position and velocity
    const targets = [
      { state: 'full', y: 0 },
      { state: 'half', y: height * 0.5 },
      { state: 'peek', y: height - 110 }
    ];

    // Predict endpoint using velocity
    const predictedY = currentY + velocity * 0.2;
    
    let closestTarget = targets[0];
    let minDiff = Math.abs(predictedY - targets[0].y);

    targets.forEach(t => {
      const diff = Math.abs(predictedY - t.y);
      if (diff < minDiff) {
        minDiff = diff;
        closestTarget = t;
      }
    });

    snapTo(closestTarget.state as 'peek' | 'half' | 'full');
  };

  // Center on Legon area roughly
  const centerLat = 5.6506;
  const centerLng = -0.1870;

  return (
    <div className="relative w-full flex-1 min-h-0 overflow-hidden flex flex-col md:flex-row h-[calc(100vh-64px)]" ref={containerRef}>
      {/* Top Bar over map */}
      <div className="md:hidden absolute top-0 left-0 w-full z-[1000] p-4 sm:p-5 flex flex-col pointer-events-none">
        <div className="flex items-start justify-between w-full mb-4">
          <button 
            onClick={() => navigate("/student/dashboard")}
            className="w-11 h-11 rounded-full bg-[#1c1c1e]/85 backdrop-blur shadow-[0_2px_10px_rgba(0,0,0,0.2)] flex items-center justify-center text-white pointer-events-auto active:scale-95 transition-transform"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>
          
          <div className="flex-1 mx-3 sm:mx-4 pointer-events-auto h-11">
            <div className="bg-white/95 backdrop-blur shadow-[0_2px_10px_rgba(0,0,0,0.1)] rounded-full px-4 flex items-center gap-2 border border-black/5 h-full">
              <Search size={18} className="text-gray-500 shrink-0" />
              <input 
                type="text" 
                placeholder="Search properties, areas..." 
                className="bg-transparent border-none outline-none w-full text-[0.9rem] font-medium text-gray-800 placeholder:text-gray-400"
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setExploreSearchQuery(e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pointer-events-auto pb-2">
          {['All', 'Private', 'Shared', 'Near Campus', 'Budget', 'Wi-Fi'].map((filter, i) => (
            <button 
              key={filter}
              className={`whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-[1.5px] text-[0.75rem] font-bold shadow-sm transition-all
                ${i === 0 
                  ? 'bg-indigo text-white border-indigo shadow-[0_4px_14px_rgba(55,48,163,0.35)]' 
                  : 'bg-card-bg/90 backdrop-blur text-text-muted border-transparent hover:bg-card-bg'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Result Badge */}
        <div className="inline-flex items-center gap-1.5 bg-card-bg rounded-full px-3 py-1.5 mt-2 self-start shadow-[0_2px_10px_rgba(55,48,163,0.12)] pointer-events-none transition-all">
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse"></span>
          <span className="text-[0.7rem] sm:text-[0.75rem] font-bold text-indigo">{filteredProperties.length} properties nearby</span>
        </div>
      </div>

      
      {/* DESKTOP/TABLET SIDEBAR LIST */}
      <div className="hidden md:flex w-[40%] lg:w-[35%] h-full flex-col bg-card-bg border-r border-border-subtle z-10 shrink-0">
        <div className="p-4 border-b border-border-subtle shrink-0">
           <div className="flex items-center gap-3 mb-4">
              <button 
                onClick={() => navigate("/student/dashboard")}
                className="w-10 h-10 rounded-full bg-border-subtle flex items-center justify-center text-text-primary hover:bg-border-subtle/80 cursor-pointer"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
              <div className="bg-app-bg rounded-xl px-4 flex items-center gap-2 border border-border-subtle h-11 flex-1">
                <Search size={18} className="text-gray-500 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search properties, areas..." 
                  className="bg-transparent border-none outline-none w-full text-[0.9rem] font-medium text-text-primary placeholder:text-text-muted"
                  value={localSearch}
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                    setExploreSearchQuery(e.target.value);
                  }}
                />
              </div>
           </div>
           
           <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
             {['All', 'Private', 'Shared', 'Near Campus', 'Budget', 'Wi-Fi'].map((filter, i) => (
               <button 
                 key={filter}
                 className={`shrink-0 px-4 py-1.5 rounded-full border-[1.5px] text-[0.75rem] font-bold shadow-sm transition-all
                   ${i === 0 
                     ? 'bg-indigo text-white border-indigo shadow-[0_4px_14px_rgba(55,48,163,0.35)]' 
                     : 'bg-card-bg text-text-muted border-border-subtle hover:bg-app-bg'}`}
               >
                 {filter}
               </button>
             ))}
           </div>
           <div className="mt-2 text-sm font-semibold text-text-primary">
             {filteredProperties.length} properties nearby
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {filteredProperties.map(h => (
            <div key={h.id} className="w-full" onMouseEnter={() => setPeekPropertyId(h.id)} onMouseLeave={() => setPeekPropertyId(null)}>
               <PropertyCard 
                 property={h} 
                 layout="explore-list"
                 isSaved={savedProperties.includes(h.id)} 
                 onToggleSave={toggleSave} 
                 onClick={() => { setSelectedPropertyId(h.id); navigate("/details"); }} 
               />
            </div>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="absolute md:relative inset-0 md:inset-auto z-0 md:z-auto transition-all duration-500 ease-in-out md:flex-1 md:h-full">
        <MapContainer center={[centerLat, centerLng]} zoom={15} className="w-full h-full !z-0" zoomControl={false} style={{ zIndex: 0 }}>
          <TileLayer
            url={mapMode === 'satellite' ? "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&scale=2" : "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&scale=2"}
            attribution="Google Maps"
            maxZoom={20}
            maxNativeZoom={19}
            updateWhenIdle={false}
            updateWhenZooming={false}
            keepBuffer={10}
            crossOrigin="anonymous"
          />
          <MapUpdater center={peekProperty ? [peekProperty.lat, peekProperty.lng] : null} isVisible={currentView === 'explore'} />
          
          {filteredProperties.map(h => {
             return (
               <React.Fragment key={h.id}>
                 <Circle 
                   center={[h.lat, h.lng]}
                   radius={140}
                   pathOptions={{ fillColor: '#3730a3', color: 'transparent', fillOpacity: 0.08 }}
                 />
                 <Marker 
                   position={[h.lat, h.lng]} 
                   icon={getCustomIcon(h.img, h.priceNum)} 
                   eventHandlers={{ click: () => { 
                     setPeekPropertyId(h.id); 
                     snapTo('peek'); // hide drawer to bottom
                   } }}
                 />
               </React.Fragment>
             );
          })}
        </MapContainer>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute right-4 z-[2000] flex flex-col gap-3 pointer-events-none" style={{ bottom: peekProperty ? '140px' : '90px', transition: 'bottom 0.3s cubic-bezier(0.4,0,0.2,1)' }}>
        <button 
          onClick={() => setMapMode(prev => prev === 'standard' ? 'satellite' : 'standard')}
          className="w-12 h-12 rounded-full bg-white text-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center pointer-events-auto active:scale-95 border border-black/5 transition-transform cursor-pointer"
          aria-label="Toggle map mode"
        >
          <Layers size={22} strokeWidth={1.8} />
        </button>
        <button className="md:hidden w-12 h-12 rounded-full bg-[#1a1b26]/90 backdrop-blur shadow-lg flex items-center justify-center pointer-events-auto border border-white/10 active:scale-95 transition-transform">
          <div className="w-3.5 h-3.5 rounded-full bg-blue-500 border-[2.5px] border-white shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
        </button>
      </div>

      {/* Peek Card (shows above drawer) */}
      <div className={`md:hidden absolute left-4 right-4 z-[1050] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex justify-center ${peekProperty ? 'opacity-100 translate-y-[-100px] bottom-0 pointer-events-auto' : 'opacity-0 translate-y-[20px] bottom-0 pointer-events-none'}`}>
        {peekProperty && (
          <div className="relative w-full max-w-[400px]">
            <button 
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 bg-white/80 backdrop-blur-sm rounded-full p-1 z-30 shadow-sm"
              onClick={(e) => { e.stopPropagation(); setPeekPropertyId(null); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <PropertyCard 
              property={peekProperty} 
              layout="explore-list"
              isSaved={savedProperties.includes(peekProperty.id)} 
              onToggleSave={toggleSave} 
              onClick={() => { setSelectedPropertyId(peekProperty.id); navigate("/details"); }} 
            />
          </div>
        )}
      </div>

      {/* Bottom Drawer */}
      <motion.div
        animate={drawerControls}
        drag="y"
        dragConstraints={{ top: 0, bottom: typeof window !== 'undefined' ? window.innerHeight - 110 : 600 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        className="absolute top-0 left-0 w-full h-[100dvh] bg-app-bg rounded-t-[32px] shadow-[0_-10px_40px_rgba(30,27,75,0.15)] z-[1000] flex flex-col pt-3"
      >
        {/* Drawer Handle */}
        <div className="w-full flex justify-center pb-4 pt-1 cursor-grab active:cursor-grabbing shrink-0">
          <div className="w-12 h-1.5 bg-indigo-light rounded-full"></div>
        </div>
        
        {/* Scrollable Content inside Drawer */}
        <div className="flex-1 overflow-y-auto px-5 pb-10 hide-scrollbar"
             onPointerDown={(e) => {
               // Prevent dragging the drawer when scrolling inside it unless at the very top
               const target = e.currentTarget;
               if (target.scrollTop > 0) {
                 e.stopPropagation();
               }
             }}
        >
          <div className="flex justify-between items-center px-1 mb-4">
            <h2 className="font-montserrat text-[1.4rem] font-bold text-text-primary">Nearby Properties</h2>
            <button className="flex items-center gap-1.5 bg-indigo-light text-indigo px-3 py-1.5 rounded-[10px] text-[0.75rem] font-semibold transition-colors hover:bg-indigo-light/80">
              <Navigation size={12} className="rotate-180" />
              <span>Price ↑</span>
            </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-8 text-text-muted">No properties found.</div>
            ) : filteredProperties.map(property => (
              <div key={property.id} className="w-full flex justify-center">
                <PropertyCard 
                  property={property} 
                  layout="explore-list"
                  isSaved={savedProperties.includes(property.id)} 
                  onToggleSave={toggleSave} 
                  onClick={() => { setSelectedPropertyId(property.id); navigate("/details"); }} 
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
