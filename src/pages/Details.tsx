import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { Pannellum } from "pannellum-react";
import { BlazingRifts } from "../components/BlazingRifts";
import {
  ChevronLeft,
  ArrowUpFromLine,
  Phone,
  Info,
  ShieldCheck,
  Star,
  MapPin,
  Lock,
  Coins,
  Droplet,
  Wifi,
  Snowflake,
  PlugZap,
  WashingMachine,
  BookOpen,
  User,
  Bed,
  Ruler,
  Tag,
  Heart,
  MessageCircle,
  Coffee,
  Video,
  CheckCircle2
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useAppContext } from "../context/AppContext";
import { PROPERTIES } from "../data";
import { supabase } from "../lib/supabase";

const mapIcon = L.divIcon({
  className: "",
  html: `<div style="background:#489b78;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 4px 10px rgba(72,155,120,0.5);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export const Details: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedPropertyId,
    showToast,
    savedProperties,
    toggleSave,
    properties,
    user,
    profile,
  } = useAppContext();

  const [bookingForm, setBookingForm] = useState({
    firstName: profile?.full_name?.split(' ')[0] || "",
    lastName: profile?.full_name?.split(' ').slice(1).join(' ') || "",
    phone: profile?.phone || ""
  });

  const [hostProfile, setHostProfile] = useState<any>(null);
  const navigate = useNavigate();

  const property = properties.find((h) => h.id?.toString() === selectedPropertyId?.toString()) || properties[0];

  useEffect(() => {
    if (profile) {
      setBookingForm(prev => ({
        ...prev,
        firstName: prev.firstName || profile.full_name?.split(' ')[0] || "",
        lastName: prev.lastName || profile.full_name?.split(' ').slice(1).join(' ') || "",
        phone: prev.phone || profile.phone || ""
      }));
    }
  }, [profile]);

  useEffect(() => {
    async function fetchHostProfile() {
      if (!property?.manager_id) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', property.manager_id)
          .single();
        if (data && !error) {
          setHostProfile(data);
        }
      } catch (err) {
        console.error("Failed to fetch host profile", err);
      }
    }
    fetchHostProfile();
  }, [property?.manager_id]);

  const isSaved = savedProperties.includes(property.id);

  // Gallery State combined with Slider Logic
  const allMedia = [...(property.images?.length ? property.images : [property.img]), ...(property.panoramas || [])];
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    // Pause auto-slider if user is viewing a 360 panorama so it doesn't swipe away while dragging
    const isPano = currentImg >= (property.images?.length || 1);
    if (isPano) return;

    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % allMedia.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [allMedia.length, currentImg, property.images]);

  // UI States
  const [activeRoomMode, setActiveRoomMode] = useState<number>(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [priceBump, setPriceBump] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);

  const fallbackRooms = [
    {
      name: "Standard Room",
      size: "Standard",
      occ: "Unknown capacity",
      bed: "1 bed(s)",
      price: property.price ? `${property.price}` : "GH₵5,000",
      avail: property.avail || "Available",
      availClass: "bg-[#b9e5d1] text-[#489b78]",
      img: property.images?.[0] || property.img,
    }
  ];

  const roomsToDisplay = property.rooms && property.rooms.length > 0 
    ? property.rooms.map((r: any, idx: number) => ({
        name: r.room_type || r.name || `Room ${idx + 1}`,
        size: r.size || "Standard size",
        occ: (r.capacity !== undefined && r.capacity !== null) ? `${r.capacity} occupant(s)` : (r.occupantsPerRoom !== undefined && r.occupantsPerRoom !== null) ? `${r.occupantsPerRoom} occupant(s)` : "Unknown capacity",
        bed: r.bed || `${(r.capacity !== undefined && r.capacity !== null) ? r.capacity : (r.occupantsPerRoom !== undefined && r.occupantsPerRoom !== null) ? r.occupantsPerRoom : 1} bed(s)`,
        price: r.price ? `GH₵${r.price}` : "Price unknown",
        avail: r.quantity ? `${r.quantity} space(s) left` : "Available",
        availClass: "bg-[#b9e5d1] text-[#489b78]",
        img: r.image_url || property.images?.[idx] || property.images?.[0] || property.img,
      }))
    : fallbackRooms;

  const selectedRoom = roomsToDisplay[activeRoomMode] || roomsToDisplay[0];

  // Event Handlers
  const handleRoomChange = (idx: number) => {
    setActiveRoomMode(idx);
    setPriceBump(true);
  };

  const handleSwipeUpStart = (e: React.TouchEvent) => setTouchStartY(e.changedTouches[0].screenY);
  const handleSwipeUpEnd = (e: React.TouchEvent) => {
    if (touchStartY - e.changedTouches[0].screenY > 20) setIsPanelOpen(true);
  };
  const handleSwipeDownEnd = (e: React.TouchEvent) => {
    if (e.changedTouches[0].screenY - touchStartY > 20) setIsPanelOpen(false);
  };

  const handleBookClick = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setBookingModalOpen(true);
    }, 800);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#e9ecef] font-poppins selection:bg-[#b9e5d1]">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .price-bump { animation: bump 0.3s ease; }
        @keyframes bump { 0% { transform: scale(1); } 50% { transform: scale(1.15); color: #489b78; } 100% { transform: scale(1); } }
      `}</style>

      {/* Mobile App Container */}
      <div className="w-full h-[100dvh] md:w-[375px] md:h-[812px] bg-[#1e1e1e] md:rounded-[40px] relative overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.15)] flex flex-col">
        
        {/* Full Screen Media Slider */}
        <div className="absolute inset-0 w-full h-full z-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
          
          {allMedia.map((media, idx) => {
            const isPano = idx >= (property.images?.length || 1);
            return (
              <div 
                key={idx} 
                className={`absolute inset-0 w-full h-full transition-opacity duration-[1.5s] ease-in-out ${currentImg === idx ? 'opacity-100 z-0' : 'opacity-0 -z-10'}`}
              >
                {isPano ? (
                  currentImg === idx ? (
                    <Pannellum
                      width="100%"
                      height="100%"
                      image={media}
                      pitch={10}
                      yaw={180}
                      hfov={110}
                      autoLoad={true}
                    />
                  ) : null
                ) : (
                  <img src={media} className="w-full h-full object-cover" alt={`${property.name} view`} />
                )}
              </div>
            );
          })}

          {/* Media Indicators */}
          <div className="absolute bottom-[45%] left-0 w-full flex justify-center gap-2 z-10">
            {allMedia.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentImg(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${currentImg === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        </div>

        {/* Background Typography */}
        <div className="absolute top-[10%] left-[-2%] text-[110px] font-extrabold italic leading-[0.85] text-white/40 z-[2] pointer-events-none tracking-[-3px] drop-shadow-2xl">
          <div>SKY</div>
          <div>COBE</div>
        </div>

        {/* Header */}
        <header className="relative z-10 flex justify-between items-start px-6 pt-12 md:pt-10">
          <button
            onClick={() => navigate("/student/dashboard")}
            className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-[0_8px_15px_rgba(0,0,0,0.1)] active:scale-95 transition-transform"
          >
            <ChevronLeft size={20} className="text-[#1e1e1e]" />
          </button>
          
          <div className="text-center mt-1">
            <h1 className="text-lg font-bold text-white leading-tight drop-shadow-md">
              {property.name.length > 20 ? property.name.slice(0,20) + '...' : property.name}
            </h1>
            <span className="text-xs text-white/90 font-medium drop-shadow-md">Student Hostel</span>
          </div>

          <div className="w-11 h-11" /> {/* Placeholder for balance */}
        </header>

        {/* Floating Actions */}
        <div className="absolute right-6 top-[35%] flex flex-col gap-4 z-10">
          <button
            onClick={() => toggleSave(property.id)}
            className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-[0_8px_15px_rgba(0,0,0,0.1)] active:scale-95 transition-transform"
          >
            <Heart 
              size={20} 
              className={`transition-colors duration-300 ${isSaved ? 'fill-[#1e1e1e] text-[#1e1e1e]' : 'fill-none text-[#1e1e1e]'}`} 
            />
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              showToast("Link copied!");
            }}
            className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-[0_8px_15px_rgba(0,0,0,0.1)] active:scale-95 transition-transform"
          >
            <ArrowUpFromLine size={18} className="text-[#1e1e1e]" />
          </button>
        </div>

        {/* Primary Bottom Sheet */}
        <div className="relative z-10 bg-white mt-auto h-[42%] rounded-t-[35px] p-6 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] flex flex-col justify-between">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs text-[#8d9a94] font-medium mb-1">Total Price</div>
              <div 
                className={`text-[28px] font-bold text-[#1e1e1e] leading-none tracking-tight ${priceBump ? 'price-bump' : ''}`}
                onAnimationEnd={() => setPriceBump(false)}
              >
                {selectedRoom.price}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#8d9a94] font-medium mb-1">Availability</div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${selectedRoom.availClass}`}>
                {selectedRoom.avail}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs text-[#8d9a94] font-medium mb-3">Room Options</div>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {roomsToDisplay.map((room_item, index) => (
                <button
                  key={index}
                  onClick={() => handleRoomChange(index)}
                  className={`px-4 py-2.5 shrink-0 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                    activeRoomMode === index 
                      ? 'bg-[#489b78] text-white border-[#489b78] shadow-[0_8px_15px_rgba(72,155,120,0.3)]' 
                      : 'bg-transparent text-[#1e1e1e] border-[#e5e5e5]'
                  }`}
                >
                  {room_item.name}
                </button>
              ))}
            </div>
          </div>

          <button 
            className="w-full bg-[#489b78] text-white rounded-[20px] py-[18px] text-base font-semibold flex justify-center items-center gap-2 shadow-[0_10px_20px_rgba(72,155,120,0.25)] active:scale-95 transition-all mt-2"
            onClick={handleBookClick}
          >
            {isBooking ? (
              <><CheckCircle2 size={18} /> Reserved!</>
            ) : (
              <><Bed size={18} /> Request Room</>
            )}
          </button>

          {/* Swipe Indicator */}
          <div 
            className="text-center mt-4 flex flex-col items-center gap-1 cursor-pointer py-2"
            onClick={() => setIsPanelOpen(true)}
            onTouchStart={handleSwipeUpStart}
            onTouchEnd={handleSwipeUpEnd}
          >
            <span className="text-[11px] text-[#8d9a94] font-medium">Swipe up for amenities</span>
            <ChevronLeft size={16} className="text-[#1e1e1e] rotate-90 animate-bounce" />
          </div>
        </div>

        {/* Secondary Details Panel Overlay */}
        <div 
          className={`absolute inset-0 bg-black/60 z-15 transition-opacity duration-400 ${isPanelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
          onClick={() => setIsPanelOpen(false)}
        />
        
        {/* Secondary Details Panel */}
        <div 
          className={`absolute bottom-0 left-0 w-full h-[85%] bg-white rounded-t-[35px] z-20 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isPanelOpen ? 'translate-y-0' : 'translate-y-full'}`}
        >
          <div 
            className="w-full pt-4 pb-6 flex flex-col items-center cursor-pointer"
            onClick={() => setIsPanelOpen(false)}
            onTouchStart={handleSwipeUpStart}
            onTouchEnd={handleSwipeDownEnd}
          >
            <div className="w-11 h-[5px] bg-[#e5e5e5] rounded-full mb-4" />
            <h2 className="text-[18px] font-bold text-[#1e1e1e]">Details & Amenities</h2>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-8 hide-scrollbar">
            
            {/* Location Map */}
            <h3 className="text-[15px] font-bold text-[#1e1e1e] mb-4">Location</h3>
            <div className="w-full h-[180px] rounded-[20px] overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.08)] bg-[#f7f9f8] mb-6">
              <MapContainer 
                center={[property.lat || 5.6506, property.lng || -0.1870]} 
                zoom={14} 
                className="w-full h-full z-0" 
                zoomControl={false}
              >
                <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&scale=2" />
                <Marker position={[property.lat || 5.6506, property.lng || -0.1870]} icon={mapIcon}>
                   <Popup>{property.name}</Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Amenities Grid */}
            <h3 className="text-[15px] font-bold text-[#1e1e1e] mb-4">Amenities</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {((property.amenities?.length ? property.amenities : property.tags) || []).map((am, i) => {
                const label = am.toLowerCase();
                let Icon = Wifi;
                if (label.includes("ac")) Icon = Snowflake;
                else if (label.includes("security") || label.includes("sec")) Icon = ShieldCheck;
                else if (label.includes("gen")) Icon = PlugZap;
                else if (label.includes("study")) Icon = BookOpen;
                else if (label.includes("water") || label.includes("piped")) Icon = Droplet;
                else if (label.includes("kitchen") || label.includes("cafeteria")) Icon = Coffee;

                return (
                  <div key={i} className="flex items-center gap-2.5 bg-[#f7f9f8] p-3 rounded-[15px]">
                    <Icon size={18} className="text-[#489b78]" />
                    <span className="text-xs font-semibold text-[#1e1e1e]">{am}</span>
                  </div>
                );
              })}
            </div>

            {/* Reviews */}
            <h3 className="text-[15px] font-bold text-[#1e1e1e] mb-4">Reviews</h3>
            <div className="flex justify-between items-center p-4 rounded-[20px] bg-[#f7f9f8] border border-[#e5e5e5] mb-6">
              <div className="flex items-center gap-4">
                <div className="text-[32px] font-extrabold text-[#1e1e1e] leading-none">{property.rating}</div>
                <div className="flex flex-col">
                  <div className="text-[#ffc107] text-sm tracking-[2px]">★★★★★</div>
                  <div className="text-[11px] text-[#8d9a94] font-medium mt-0.5">{property.reviews} Reviews</div>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/property/${property.id}/reviews`)}
                className="bg-[#1e1e1e] text-white font-semibold text-xs py-2.5 px-4 rounded-xl active:scale-95 transition-transform"
              >
                Read
              </button>
            </div>

            {/* Host Profile */}
            <h3 className="text-[15px] font-bold text-[#1e1e1e] mb-4">Property Host</h3>
            <div className="flex items-center justify-between p-4 border border-[#e5e5e5] rounded-[20px] bg-white mb-8">
              <div className="flex items-center gap-3">
                {hostProfile?.avatar_url ? (
                  <img src={hostProfile.avatar_url} alt="Host" className="w-[50px] h-[50px] rounded-full object-cover border-2 border-[#b9e5d1]" />
                ) : (
                  <div className="w-[50px] h-[50px] rounded-full bg-[#b9e5d1] text-[#489b78] border-2 border-white flex justify-center items-center font-bold text-lg">
                    {hostProfile?.full_name ? hostProfile.full_name.substring(0,1) : "H"}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-[#1e1e1e]">{hostProfile?.full_name || "Hostel Admin"}</h4>
                  <p className="text-[11px] text-[#8d9a94] font-medium">
                    {hostProfile?.role === 'accommodation_owner' ? 'Verified Owner' : 'Property Manager'} • {property.rating} ★
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${hostProfile?.phone || '+233550000000'}`} className="w-9 h-9 rounded-xl bg-[#f7f9f8] text-[#1e1e1e] flex justify-center items-center active:bg-[#e5e5e5]">
                  <Phone size={14} />
                </a>
                <a href={`https://wa.me/${(hostProfile?.phone || '233550000000').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-[#e5f5ed] text-[#489b78] flex justify-center items-center active:bg-[#b9e5d1]">
                  <MessageCircle size={14} />
                </a>
              </div>
            </div>
            
          </div>
        </div>

        {/* Booking Request Modal */}
        {bookingModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-[30px] p-6 shadow-2xl relative animate-in zoom-in duration-200">
              <button
                onClick={() => setBookingModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-[#f7f9f8] rounded-full text-[#1e1e1e] hover:bg-[#e5e5e5] transition-colors"
              >
                ✕
              </button>
              <h2 className="text-[18px] font-bold text-[#1e1e1e] mb-1">Request Room</h2>
              <p className="text-[13px] text-[#8d9a94] mb-6">Fill out your details to secure {selectedRoom.name}.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#1e1e1e] mb-1.5 ml-1 uppercase tracking-wider">First Name</label>
                  <input 
                    type="text" 
                    value={bookingForm.firstName}
                    onChange={(e) => setBookingForm({...bookingForm, firstName: e.target.value})}
                    className="w-full px-4 py-3.5 bg-[#f7f9f8] border border-[#e5e5e5] rounded-[16px] outline-none focus:border-[#489b78] transition-all text-sm font-medium"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#1e1e1e] mb-1.5 ml-1 uppercase tracking-wider">Last Name</label>
                  <input 
                    type="text" 
                    value={bookingForm.lastName}
                    onChange={(e) => setBookingForm({...bookingForm, lastName: e.target.value})}
                    className="w-full px-4 py-3.5 bg-[#f7f9f8] border border-[#e5e5e5] rounded-[16px] outline-none focus:border-[#489b78] transition-all text-sm font-medium"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#1e1e1e] mb-1.5 ml-1 uppercase tracking-wider">Phone Number</label>
                  <input 
                    type="tel" 
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                    className="w-full px-4 py-3.5 bg-[#f7f9f8] border border-[#e5e5e5] rounded-[16px] outline-none focus:border-[#489b78] transition-all text-sm font-medium"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <button 
                  onClick={() => {
                    showToast("Room requested successfully!");
                    setBookingModalOpen(false);
                  }}
                  className="w-full py-4 bg-[#1e1e1e] text-white rounded-[20px] font-bold text-[15px] shadow-xl shadow-[#1e1e1e]/20 active:scale-95 transition-all mt-4"
                >
                  Confirm Request
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};