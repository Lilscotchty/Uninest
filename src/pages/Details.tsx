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
  Video
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useAppContext } from "../context/AppContext";
import { PROPERTIES } from "../data";

const mapIcon = L.divIcon({
  className: "",
  html: `<div style="background:#178053;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(23,128,83,0.4);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
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
  } = useAppContext();

  const [bookingForm, setBookingForm] = useState({
    firstName: "",
    lastName: "",
    phone: ""
  });
  const navigate = useNavigate();

  const property = properties.find((h) => h.id?.toString() === selectedPropertyId?.toString()) || properties[0];
  const isSaved = savedProperties.includes(property.id);

  // Gallery State
  const [currentImg, setCurrentImg] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const [descExpanded, setDescExpanded] = useState(false);
  const fullDesc = `Located perfectly for students looking to minimize their commute. ${property.name} offers a vibrant community atmosphere with spaces designed for deep study and relaxed living.`;

  const [activeRoomMode, setActiveRoomMode] = useState<
    "single" | "double" | "quad"
  >("single");

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const rooms = {
    single: {
      name: "Private Single Suite",
      size: "12 m²",
      occ: "1 occupant",
      bed: "Single bed",
      price: "GH₵5,000",
      avail: "4 units left",
      availClass: "bg-green-100 text-green-700",
      img: property.images?.[0] || property.img,
    },
    double: {
      name: "Shared Double Unit",
      size: "18 m²",
      occ: "2 occupants",
      bed: "Bunk beds",
      price: "GH₵3,800",
      avail: "2 units left",
      availClass: "bg-amber-100 text-amber-700",
      img: property.images?.[1] || property.img,
    },
    quad: {
      name: "Quad Dorm Room",
      size: "28 m²",
      occ: "4 occupants",
      bed: "4 single beds",
      price: "GH₵3,200",
      avail: "6 units left",
      availClass: "bg-green-100 text-green-700",
      img: property.images?.[2] || property.img,
    },
  };

  const selectedRoom = rooms[activeRoomMode];

  return (
    <div className="flex-1 w-full bg-slate-100 relative flex flex-col md:overflow-y-auto">
      <div className="w-full max-w-screen-2xl mx-auto px-0 md:px-6 lg:px-8 pb-[100px] md:pb-8 flex flex-col md:grid md:grid-cols-3 gap-0 md:gap-8 pt-0 md:pt-6">
        {/* GALLERY */}
        <div className="relative h-[380px] md:h-[500px] bg-black md:col-span-3 md:rounded-2xl overflow-hidden shadow-sm">
          <div className="absolute top-6 left-5 right-5 flex justify-between items-center z-10">
            <button
              onClick={() => navigate("/student/dashboard")}
              className="w-11 h-11 rounded-full bg-card-bg/75 backdrop-blur-md flex items-center justify-center text-text-primary shadow-sm hover:scale-105 transition-transform"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2.5 items-center">
              <button
                onClick={() => toggleSave(property.id)}
                className="w-11 h-11 rounded-full bg-card-bg/75 backdrop-blur-md flex items-center justify-center text-text-primary shadow-sm hover:scale-105 transition-transform"
              >
                {isSaved ? (
                  <Heart strokeWidth={2.5} className="text-coral" />
                ) : (
                  <Heart strokeWidth={2.5} fill="none" color="currentColor" />
                )}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast("Link copied!");
                }}
                className="w-11 h-11 rounded-full bg-card-bg/75 backdrop-blur-md flex items-center justify-center text-text-primary shadow-sm hover:scale-105 transition-transform"
              >
                <ArrowUpFromLine size={18} />
              </button>
            </div>
          </div>

          <div
            className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth relative"
            ref={trackRef}
            onScroll={(e) => {
              const track = e.currentTarget;
              if (track.clientWidth > 0)
                setCurrentImg(Math.round(track.scrollLeft / track.clientWidth));
            }}
          >
            {(property.images || []).map((src, i) => (
              <div key={i} className="min-w-full h-full snap-start relative">
                <img src={src} className="w-full h-full object-cover" />
              </div>
            ))}
            {/* 360 Slide */}
            {property.panoramas && property.panoramas.length > 0 ? (
               property.panoramas.map((pano, i) => (
                <div key={`pano-${i}`} className="min-w-full h-full snap-start relative bg-slate-900">
                    <Pannellum
                      width="100%"
                      height="100%"
                      image={pano}
                      pitch={10}
                      yaw={180}
                      hfov={110}
                      autoLoad={false}
                    />
                </div>
              ))
            ) : (
              <div key="pano-fallback" className="min-w-full h-full snap-start relative bg-slate-900 group">
                  <BlazingRifts />
              </div>
            )}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute bottom-0 left-0 w-full h-[140px] bg-gradient-to-t from-[#0f0e2e]/60 to-transparent pointer-events-none" />

          <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 flex gap-2 items-center bg-black/30 backdrop-blur-md p-1.5 rounded-[14px]">
            {(property.images || []).map((src, i) => (
              <div
                key={i}
                className={`w-[44px] h-[34px] rounded-lg overflow-hidden cursor-pointer transition-all ${currentImg === i ? "opacity-100 scale-105 outline outline-2 outline-white -outline-offset-1" : "opacity-60 hover:opacity-100"}`}
                onClick={() =>
                  trackRef.current?.scrollTo({
                    left: i * (trackRef.current?.clientWidth || 0),
                    behavior: "smooth",
                  })
                }
              >
                <img
                  src={src}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {property.panoramas && property.panoramas.length > 0 ? property.panoramas.map((pano, j) => {
              const i = (property.images?.length || 0) + j;
              return (
                <div
                  key={`pano-thumb-${j}`}
                  className={`w-[44px] h-[34px] rounded-lg overflow-hidden cursor-pointer transition-all relative ${currentImg === i ? "opacity-100 scale-105 outline outline-2 outline-white -outline-offset-1" : "opacity-60 hover:opacity-100"}`}
                  onClick={() =>
                    trackRef.current?.scrollTo({
                      left: i * (trackRef.current?.clientWidth || 0),
                      behavior: "smooth",
                    })
                  }
                >
                  <img src={pano} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                    <Video size={14} />
                  </div>
                </div>
              );
            }) : (
              <div
                  key="pano-thumb-fallback"
                  className={`w-[44px] h-[34px] rounded-lg overflow-hidden cursor-pointer transition-all relative ${currentImg === (property.images?.length || 0) ? "opacity-100 scale-105 outline outline-2 outline-white -outline-offset-1" : "opacity-60 hover:opacity-100"}`}
                  onClick={() =>
                    trackRef.current?.scrollTo({
                      left: (property.images?.length || 0) * (trackRef.current?.clientWidth || 0),
                      behavior: "smooth",
                    })
                  }
                >
                  <div className="w-full h-full bg-slate-900 border border-slate-700 flex items-center justify-center text-white">
                    <Video size={14} className="opacity-50" />
                  </div>
                </div>
            )}
          </div>

          <div className="absolute bottom-5 right-5 bg-black/50 backdrop-blur-md text-white text-[0.75rem] font-bold px-3 py-1.5 rounded-full tracking-[0.5px]">
            {currentImg + 1} / {(property.images?.length || 0) + Math.max((property.panoramas?.length || 0), 1)}
          </div>
        </div>

        {/* SHEET */}
        <div className="bg-app-bg -mt-8 relative z-[5] rounded-t-[32px] pt-6 px-6 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] pb-10">
          <div className="w-10 h-[5px] bg-slate-300 rounded-full mx-auto mb-5" />

          {/* Tags */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="bg-teal-light text-teal text-[0.65rem] sm:text-[0.68rem] font-bold px-2 py-1 sm:px-3 rounded-full uppercase tracking-[0.5px] flex items-center gap-1">
              <ShieldCheck size={12} /> Verified
            </span>
            <span className="bg-green-light text-green-600 text-[0.65rem] sm:text-[0.68rem] font-bold px-2 py-1 sm:px-3 rounded-full uppercase tracking-[0.5px] border border-green-200">
              Rooms Available
            </span>
            <span className="bg-amber-light text-amber-600 text-[0.65rem] sm:text-[0.68rem] font-bold px-2 py-1 sm:px-3 rounded-full uppercase tracking-[0.5px]">
              🔥 Popular Pick
            </span>
          </div>

          <div className="flex justify-between items-start mb-2 gap-2">
            <h1 className="text-[1.4rem] sm:text-[1.85rem] font-bold text-[var(--color-heading)] leading-[1.1] tracking-[-0.5px] break-words">
              {property.name}
            </h1>
            <div className="bg-card-bg border-transparent border shadow-sm rounded-xl px-2 py-1.5 sm:px-3 flex items-center gap-1 sm:gap-1.5 shrink-0">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <strong className="text-[0.85rem] sm:text-[0.95rem] font-bold">
                {property.rating}
              </strong>
              <span className="text-[0.7rem] sm:text-[0.75rem] text-text-muted">
                ({property.reviews})
              </span>
            </div>
          </div>

          <div className="flex items-start sm:items-center gap-2 text-text-muted text-[0.85rem] mb-6 font-medium">
            <MapPin size={14} className="text-[var(--color-accent)] shrink-0" />
            <span>{property.loc}</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 bg-app-bg/80 rounded-[20px] p-1.5 sm:p-2 mb-8 divide-x divide-slate-200/60 border border-border-subtle">
            <div className="text-center py-2 sm:py-2.5">
              <strong className="block text-[1rem] sm:text-[1.4rem] font-bold text-text-primary mb-0.5">
                {property.price.split(",")[0]}K
              </strong>
              <span className="text-[0.6rem] sm:text-[0.65rem] text-text-muted font-bold tracking-[0.5px] uppercase">
                Per Sem
              </span>
            </div>
            <div className="text-center py-2 sm:py-2.5">
              <strong className="block text-[1rem] sm:text-[1.4rem] font-bold text-text-primary mb-0.5">
                {property.reviews}
              </strong>
              <span className="text-[0.6rem] sm:text-[0.65rem] text-text-muted font-bold tracking-[0.5px] uppercase">
                Reviews
              </span>
            </div>
            <div className="text-center py-2 sm:py-2.5">
              <strong className="block text-[1rem] sm:text-[1.4rem] font-bold text-text-primary mb-0.5">
                3 min
              </strong>
              <span className="text-[0.6rem] sm:text-[0.65rem] text-text-muted font-bold tracking-[0.5px] uppercase">
                Campus
              </span>
            </div>
          </div>

          {/* View Reviews Button */}
          <button
            onClick={() => navigate(`/property/${property.id}/reviews`)}
            className="w-full mb-6 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-[16px] font-bold text-[0.95rem] flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
          >
            <MessageCircle size={18} />
            View Reviews ({property.reviews})
          </button>

          {/* Host */}
          <h2 className="text-[1.1rem] sm:text-[1.3rem] font-bold text-[var(--color-heading)] mb-4 tracking-tight">
            Listed by
          </h2>
          <div className="bg-card-bg rounded-[20px] p-3 sm:p-4 border-transparent border shadow-sm flex items-center gap-2 sm:gap-3.5 mb-8 flex-wrap">
            <div className="w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] shrink-0 rounded-full bg-gradient-to-br from-[var(--color-accent-muted)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <strong className="block text-[0.85rem] sm:text-[0.95rem] font-bold text-text-primary truncate">
                Mr. Carter
              </strong>
              <span className="text-[0.7rem] sm:text-[0.75rem] text-text-muted font-medium flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
                <ShieldCheck size={12} className="text-teal shrink-0" /> Verified Landlord
              </span>
              <div className="inline-block mt-0.5 sm:mt-1 bg-teal-50 text-teal-600 text-[0.6rem] sm:text-[0.65rem] font-bold px-2 py-0.5 rounded-[5px] uppercase tracking-wide">
                In 1 hr
              </div>
            </div>
            <div className="flex gap-1.5 sm:gap-2.5 shrink-0">
                  <a
                    href="tel:+233"
                    className="w-10 h-10 rounded-full bg-[var(--color-accent-muted)]/20 text-[var(--color-accent)] flex items-center justify-center transition-transform hover:bg-[var(--color-accent)] hover:text-white"
                  >
                    <Phone size={16} />
                  </a>
                  <a
                    href="https://wa.me/233"
                    className="w-10 h-10 rounded-full bg-[var(--color-accent-muted)]/20 text-teal-600 flex items-center justify-center transition-transform hover:bg-teal-600 hover:text-white"
                  >
                    <MessageCircle size={20} />
                  </a>
            </div>
          </div>

          {/* Amenities */}
          <h2 className="text-[1.1rem] sm:text-[1.3rem] font-bold text-[var(--color-heading)] mb-4 tracking-tight">
            What's Included
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {((property.amenities?.length ? property.amenities : property.tags) || []).map((am, i) => {
              const label = am.toLowerCase();
              let Icon = Wifi;
              let color = "text-[var(--color-accent)]";
              if (label.includes("ac")) { Icon = Snowflake; color = "text-blue-400"; }
              else if (label.includes("security") || label.includes("sec")) { Icon = ShieldCheck; color = "text-emerald-500"; }
              else if (label.includes("gen")) { Icon = PlugZap; color = "text-amber-500"; }
              else if (label.includes("study")) { Icon = BookOpen; color = "text-pink-500"; }
              else if (label.includes("water") || label.includes("piped")) { Icon = Droplet; color = "text-cyan-500"; }
              else if (label.includes("kitchen") || label.includes("cafeteria")) { Icon = Coffee; color = "text-orange-500"; }
              
              return (
                <div key={i} className="flex items-center gap-3 bg-app-bg/80 rounded-[16px] p-3.5 border border-border-subtle">
                  <Icon className={`${color} text-base`} />
                  <span className="text-[0.85rem] font-bold text-text-primary">
                    {am}
                  </span>
                </div>
              );
            })}
          </div>

          <h2 className="text-[1.1rem] sm:text-[1.3rem] font-bold text-[var(--color-heading)] mb-4 tracking-tight">
            About this Property
          </h2>
          <p className="text-[0.9rem] text-text-muted leading-[1.7] mb-2">
            {descExpanded ? fullDesc : fullDesc.slice(0, 200) + "..."}
          </p>
          <button
            onClick={() => setDescExpanded(!descExpanded)}
            className="text-[var(--color-accent)] font-bold text-[0.85rem] mb-8"
          >
            {descExpanded ? "Show less ↑" : "Read more →"}
          </button>

          {/* Room Options */}
          <h2 className="text-[1.1rem] sm:text-[1.3rem] font-bold text-[var(--color-heading)] mb-4 tracking-tight">
            Room Options
          </h2>
          <div className="flex gap-2.5 mb-4 px-1 pb-1 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveRoomMode("single")}
              className={`px-[18px] py-[8px] rounded-full text-[0.85rem] font-bold transition-all shrink-0 ${activeRoomMode === "single" ? "bg-[var(--color-accent)] text-white shadow-sm" : "bg-slate-200 text-text-primary"}`}
            >
              Single
            </button>
            <button
              onClick={() => setActiveRoomMode("double")}
              className={`px-[18px] py-[8px] rounded-full text-[0.85rem] font-bold transition-all shrink-0 ${activeRoomMode === "double" ? "bg-[var(--color-accent)] text-white shadow-sm" : "bg-slate-200 text-text-primary"}`}
            >
              Double
            </button>
            <button
              onClick={() => setActiveRoomMode("quad")}
              className={`px-[18px] py-[8px] rounded-full text-[0.85rem] font-bold transition-all shrink-0 ${activeRoomMode === "quad" ? "bg-[var(--color-accent)] text-white shadow-sm" : "bg-slate-200 text-text-primary"}`}
            >
              Quad
            </button>
          </div>

          <div className="bg-card-bg rounded-[20px] border-transparent border shadow-sm overflow-hidden mb-8">
            <div className="h-[160px]">
              <img
                src={selectedRoom.img}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-[18px]">
              <h3 className="text-[1.1rem] font-bold text-[var(--color-heading)] mb-2.5">
                {selectedRoom.name}
              </h3>
              <div className="flex gap-3 flex-wrap mb-3.5">
                <div className="text-[0.8rem] text-text-muted font-medium flex items-center gap-1.5">
                  <Ruler size={14} className="text-[var(--color-accent)]" /> {selectedRoom.size}
                </div>
                <div className="text-[0.8rem] text-text-muted font-medium flex items-center gap-1.5">
                  <User size={14} className="text-[var(--color-accent)]" /> {selectedRoom.occ}
                </div>
                <div className="text-[0.8rem] text-text-muted font-medium flex items-center gap-1.5">
                  <Bed size={14} className="text-[var(--color-accent)]" /> {selectedRoom.bed}
                </div>
              </div>
                 <div className="flex justify-between items-end pt-3.5 border-t border-border-subtle">
                <div>
                  <strong className="block text-[1.1rem] text-text-primary leading-none">
                    {selectedRoom.price}
                  </strong>
                  <span className="block text-[0.75rem] text-text-muted font-medium mt-1">
                    per semester
                  </span>
                </div>
                {/* NEW CHECKOUT BUTTON */}
                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="px-5 py-2 bg-[var(--color-accent)] text-white rounded-[12px] font-bold text-[0.85rem] shadow-sm hover:scale-[1.02] transition-transform" >
              
                  Checkout
                </button>
              </div>

            </div>
          </div>
        </div>

                {/* --- ADD THE MISSING BOTTOM REQUEST BAR HERE --- */}
        <div className="fixed bottom-0 left-0 w-full bg-app-bg border-t border-border-subtle px-5 py-4 pb-8 md:pb-4 z-50 flex justify-between items-center shadow-[0_-10px_20px_rgba(0,0,0,0.05)] md:rounded-b-2xl">
          <div>
            <strong className="block text-[1.2rem] font-bold text-[var(--color-heading)] leading-none mb-1">
              {property.price.split(',')[0]}K
            </strong>
            <span className="block text-[0.7rem] text-text-muted font-bold uppercase tracking-[0.5px]">
              Total Price
            </span>
          </div>
          <button
            onClick={() => setBookingModalOpen(true)}
            className="px-8 py-3.5 bg-[var(--color-accent)] text-white rounded-[16px] font-bold text-[0.95rem] shadow-sm hover:scale-[1.02] transition-transform"
          >
            Request Room
          </button>
        </div>
        {/* --- END OF REQUEST BAR --- */}

      </div>

      {/* --- NEW BOOKING MODAL --- */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-app-bg w-full max-w-md rounded-[24px] p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              ✕
            </button>
            <h2 className="text-[1.3rem] font-bold text-[var(--color-heading)] mb-2">Request Room</h2>
            <p className="text-[0.9rem] text-text-muted mb-6">Fill out your details to secure your {selectedRoom.name}.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[0.8rem] font-bold text-text-primary mb-1.5 ml-1">First Name</label>
                <input 
                  type="text" 
                  value={bookingForm.firstName}
                  onChange={(e) => setBookingForm({...bookingForm, firstName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[14px] outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all text-[0.95rem]"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-[0.8rem] font-bold text-text-primary mb-1.5 ml-1">Last Name</label>
                <input 
                  type="text" 
                  value={bookingForm.lastName}
                  onChange={(e) => setBookingForm({...bookingForm, lastName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[14px] outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all text-[0.95rem]"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block text-[0.8rem] font-bold text-text-primary mb-1.5 ml-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[14px] outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all text-[0.95rem]"
                  placeholder="Enter phone number"
                />
              </div>
              
              <button 
                onClick={() => {
                  showToast("Room requested successfully!");
                  setBookingModalOpen(false);
                }}
                className="w-full py-3.5 bg-[var(--color-accent)] text-white rounded-[16px] font-bold text-[1rem] shadow-sm hover:opacity-90 transition-opacity mt-4"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- END OF BOOKING MODAL --- */}

    </div>
  );
};
