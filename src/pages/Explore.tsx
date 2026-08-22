import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, useAnimation, PanInfo, useDragControls } from 'motion/react';
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
  const dragControls = useDragControls();
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
    
    let y = 80;
    if (state === 'full') y = 80; // Match top constraint
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
      { state: 'full', y: 80 },
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
            <div className="bg-[var(--color-surface)]/95 backdrop-blur shadow-[0_2px_10px_rgba(0,0,0,0.1)] rounded-full px-4 flex items-center gap-2 border border-black/5 h-full">
              <Search size={18} className="text-[var(--color-text-secondary)] shrink-0" />
              <input 
                type="text" 
                placeholder="Search properties, areas..." 
                className="bg-transparent border-none outline-none w-full text-[0.9rem] font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)]"
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
                  ? 'bg-[var(--color-button)] text-white border-transparent shadow-[var(--shadow-button)]' 
                  : 'bg-card-bg/90 backdrop-blur text-text-muted border-transparent hover:bg-card-bg'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Result Badge */}
        <div className="inline-flex items-center gap-1.5 bg-card-bg rounded-full px-3 py-1.5 mt-2 self-start shadow-[0_2px_10px_rgba(55,48,163,0.12)] pointer-events-none transition-all">
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse"></span>
          <span className="text-[0.7rem] sm:text-[0.75rem] font-bold text-[var(--color-accent)]">{filteredProperties.length} properties nearby</span>
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
                   pathOptions={{ fillColor: '#178053', color: 'transparent', fillOpacity: 0.15 }}
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
          className="w-12 h-12 rounded-full bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center pointer-events-auto active:scale-95 border border-black/5 transition-transform cursor-pointer"
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
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 bg-[var(--color-surface)]/80 backdrop-blur-sm rounded-full p-1 z-30 shadow-sm"
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
        initial={{ y: typeof window !== 'undefined' ? window.innerHeight * 0.5 : 400 }}
        animate={drawerControls}
        drag="y"
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={{ top: 80, bottom: typeof window !== 'undefined' ? window.innerHeight - 110 : 600 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        className="absolute top-0 left-0 w-full h-[100dvh] bg-app-bg rounded-t-[32px] shadow-[0_-10px_40px_rgba(30,27,75,0.15)] z-[1000] flex flex-col pt-3"
      >
        {/* Drawer Handle */}
        <div 
          className="w-full flex justify-center pb-4 pt-1 cursor-grab active:cursor-grabbing shrink-0 pointer-events-auto touch-none"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="w-16 h-1.5 bg-border-subtle rounded-full"></div>
        </div>
        
        {/* Scrollable Content inside Drawer */}
        <div className="flex-1 overflow-y-auto px-5 pb-32 hide-scrollbar pointer-events-auto">
          <div className="flex justify-between items-center px-1 mb-4">
             <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate("/student/dashboard")}
                  className="w-10 h-10 hidden md:flex rounded-full bg-border-subtle items-center justify-center text-text-primary hover:bg-border-subtle/80 cursor-pointer transition-colors"
                >
                  <ChevronLeft size={20} strokeWidth={2.5} />
                </button>
                <h2 className="text-[1.05rem] sm:text-[1.2rem] font-semibold tracking-tight text-[var(--color-heading)] leading-tight">Nearby Properties</h2>
             </div>
             
             <div className="hidden md:flex flex-1 max-w-md mx-6 bg-[var(--color-surface)] rounded-full px-4 items-center gap-2 border border-border-subtle h-11">
                <Search size={18} className="text-[var(--color-text-secondary)] shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search properties, areas..." 
                  className="bg-transparent border-none outline-none w-full text-[0.9rem] font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-disabled)]"
                  value={localSearch}
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                    setExploreSearchQuery(e.target.value);
                  }}
                />
             </div>

            <button className="flex items-center gap-1.5 bg-slate-800 text-white px-3 py-1.5 rounded-[10px] text-[0.75rem] font-semibold transition-colors hover:bg-slate-800/80 shrink-0">
              <Navigation size={12} className="rotate-180" />
              <span>Price ↑</span>
            </button>
          </div>
          
          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-4">
            {filteredProperties.length === 0 ? (
              <div className="text-center py-8 text-text-muted col-span-full">No properties found.</div>
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
