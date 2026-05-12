import React, { useState, useRef, useEffect } from "react";
import { Pannellum } from "pannellum-react";
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
} from "lucide-react";
import {
  FaHeart,
  FaRegHeart,
  FaWhatsapp,
  FaWifi,
  FaSnowflake,
  FaShieldAlt,
  FaPlug,
  FaBookOpen,
  FaTint,
  FaUtensils,
  FaVrCardboard,
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useAppContext } from "../context/AppContext";
import { HOSTELS } from "../data";

const mapIcon = L.divIcon({
  className: "",
  html: `<div style="background:#3730a3;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(55,48,163,0.4);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export const Details: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedHostelId,
    credits,
    deductCredits,
    showToast,
    savedHostels,
    toggleSave,
  } = useAppContext();

  const hostel = HOSTELS.find((h) => h.id === selectedHostelId) || HOSTELS[0];
  const isSaved = savedHostels.includes(hostel.id);

  // Gallery State
  const [currentImg, setCurrentImg] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const [is360Unlocked, setIs360Unlocked] = useState(false);
  const [isContactUnlocked, setIsContactUnlocked] = useState(false);
  const [isMapUnlocked, setIsMapUnlocked] = useState(false);

  const [descExpanded, setDescExpanded] = useState(false);
  const fullDesc = `Located perfectly for students looking to minimize their commute. ${hostel.name} offers a vibrant community atmosphere with spaces designed for deep study and relaxed living. The rooms are fully tiled, spacious, and recently renovated with fresh interiors.\n\nEach room comes with an in-built wardrobe, study desk, and fan. The compound is gated and guarded around the clock. Utility bills (water) are included in the semester fee, making budgeting simple and stress-free.`;

  const [activeRoomMode, setActiveRoomMode] = useState<
    "single" | "double" | "quad"
  >("single");

  // Modals
  const [unlockContext, setUnlockContext] = useState<{
    type: string;
    target: string;
    cost: number;
  } | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const rooms = {
    single: {
      name: "Private Single Room",
      size: "12 m²",
      occ: "1 occupant",
      bed: "Single bed",
      price: "GH₵5,000",
      avail: "4 rooms left",
      availClass: "bg-green-100 text-green-700",
      img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
    },
    double: {
      name: "Shared Double Room",
      size: "18 m²",
      occ: "2 occupants",
      bed: "Bunk beds",
      price: "GH₵3,800",
      avail: "2 rooms left",
      availClass: "bg-amber-100 text-amber-700",
      img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
    },
    quad: {
      name: "Quad Dorm Room",
      size: "28 m²",
      occ: "4 occupants",
      bed: "4 single beds",
      price: "GH₵3,200",
      avail: "6 rooms left",
      availClass: "bg-green-100 text-green-700",
      img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
    },
  };

  const selectedRoom = rooms[activeRoomMode];

  const handleUnlockConfirm = () => {
    if (!unlockContext) return;

    if (deductCredits(unlockContext.cost)) {
      if (unlockContext.type === "Contact") setIsContactUnlocked(true);
      if (unlockContext.type === "Location") setIsMapUnlocked(true);
      if (unlockContext.type === "360 Tour") setIs360Unlocked(true);

      showToast(`✅ ${unlockContext.type} unlocked!`);
      setUnlockContext(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar bg-slate-200 relative pb-[100px]">
      {/* GALLERY */}
      <div className="relative h-[380px] bg-black">
        <div className="absolute top-6 left-5 right-5 flex justify-between items-center z-10">
          <button
            onClick={() => setCurrentView("home")}
            className="w-11 h-11 rounded-full bg-white/75 backdrop-blur-md flex items-center justify-center text-text-primary shadow-sm hover:scale-105 transition-transform"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2.5 items-center">
            <div className="h-9 px-3 rounded-xl bg-black/50 backdrop-blur-md flex items-center gap-1.5 text-white font-bold text-[0.85rem] border border-white/20">
              <Coins size={14} className="text-amber-400" />
              <span>{credits}</span>
            </div>
            <button
              onClick={() => toggleSave(hostel.id)}
              className="w-11 h-11 rounded-full bg-white/75 backdrop-blur-md flex items-center justify-center text-text-primary shadow-sm hover:scale-105 transition-transform"
            >
              {isSaved ? (
                <FaHeart className="text-coral" size={18} />
              ) : (
                <FaRegHeart size={18} />
              )}
            </button>
            <button
              onClick={() => showToast("Link copied!")}
              className="w-11 h-11 rounded-full bg-white/75 backdrop-blur-md flex items-center justify-center text-text-primary shadow-sm hover:scale-105 transition-transform"
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
          {[
            hostel.img,
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80",
          ].map((src, i) => (
            <div key={i} className="min-w-full h-full snap-start relative">
              <img src={src} className="w-full h-full object-cover" />
            </div>
          ))}
          {/* 360 Slide */}
          <div className="min-w-full h-full snap-start relative bg-slate-900">
            {!is360Unlocked ? (
              <>
                <img
                  src={hostel.img}
                  className="w-full h-full object-cover blur-sm pointer-events-none"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-white/30">
                  <button
                    onClick={() =>
                      setUnlockContext({
                        type: "360 Tour",
                        target: "Room",
                        cost: 50,
                      })
                    }
                    className="bg-indigo text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-float active:scale-95 transition-transform"
                  >
                    <Lock size={16} /> Reveal 360 Tour
                  </button>
                </div>
              </>
            ) : (
              <Pannellum
                width="100%"
                height="100%"
                image="https://pannellum.org/images/alma.jpg"
                pitch={10}
                yaw={180}
                hfov={110}
                autoLoad
              />
            )}
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-[140px] bg-gradient-to-t from-[#0f0e2e]/60 to-transparent pointer-events-none" />

        <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 flex gap-2 items-center bg-black/30 backdrop-blur-md p-1.5 rounded-[14px]">
          {[hostel.img, "url2", "url3", "url4"].map((src, i) => (
            <div
              key={i}
              className={`w-[44px] h-[34px] rounded-lg overflow-hidden cursor-pointer transition-all ${currentImg === i ? "opacity-100 scale-105 outline outline-2 outline-white -outline-offset-1" : "opacity-60"}`}
              onClick={() =>
                trackRef.current?.scrollTo({
                  left: i * (trackRef.current?.clientWidth || 0),
                  behavior: "smooth",
                })
              }
            >
              <img
                src={
                  i === 0
                    ? src
                    : "https://pannellum.org/images/alma.jpg"
                }
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div
            className={`w-[44px] h-[34px] rounded-lg overflow-hidden cursor-pointer transition-all relative ${currentImg === 4 ? "opacity-100 scale-105 outline outline-2 outline-white -outline-offset-1" : "opacity-60"}`}
            onClick={() =>
              trackRef.current?.scrollTo({
                left: 4 * (trackRef.current?.clientWidth || 0),
                behavior: "smooth",
              })
            }
          >
            <img src={hostel.img} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
              <FaVrCardboard size={12} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 right-5 bg-black/50 backdrop-blur-md text-white text-[0.75rem] font-bold px-3 py-1.5 rounded-full tracking-[0.5px]">
          {currentImg + 1} / 5
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
          <h1 className="font-fraunces text-[1.60rem] sm:text-[1.85rem] font-bold text-text-primary leading-[1.1] tracking-[-0.5px] break-words">
            {hostel.name}
          </h1>
          <div className="bg-white border border-slate-100 shadow-sm rounded-xl px-2 py-1.5 sm:px-3 flex items-center gap-1 sm:gap-1.5 shrink-0">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <strong className="text-[0.85rem] sm:text-[0.95rem] font-bold">
              {hostel.rating}
            </strong>
            <span className="text-[0.7rem] sm:text-[0.75rem] text-text-muted">
              ({hostel.reviews})
            </span>
          </div>
        </div>

        <div className="flex items-start sm:items-center gap-2 text-text-muted text-[0.85rem] mb-6 font-medium">
          <MapPin size={14} className="text-indigo shrink-0" />
          <span>{hostel.loc}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 bg-slate-50/80 rounded-[20px] p-1.5 sm:p-2 mb-8 divide-x divide-slate-200/60 border border-slate-100">
          <div className="text-center py-2 sm:py-2.5">
            <strong className="block font-fraunces text-[1rem] sm:text-[1.15rem] font-bold text-text-primary mb-0.5">
              {hostel.price.split(",")[0]}K
            </strong>
            <span className="text-[0.6rem] sm:text-[0.65rem] text-text-muted font-bold tracking-[0.5px] uppercase">
              Per Sem
            </span>
          </div>
          <div className="text-center py-2 sm:py-2.5">
            <strong className="block font-fraunces text-[1rem] sm:text-[1.15rem] font-bold text-text-primary mb-0.5">
              {hostel.reviews}
            </strong>
            <span className="text-[0.6rem] sm:text-[0.65rem] text-text-muted font-bold tracking-[0.5px] uppercase">
              Reviews
            </span>
          </div>
          <div className="text-center py-2 sm:py-2.5">
            <strong className="block font-fraunces text-[1rem] sm:text-[1.15rem] font-bold text-text-primary mb-0.5">
              3 min
            </strong>
            <span className="text-[0.6rem] sm:text-[0.65rem] text-text-muted font-bold tracking-[0.5px] uppercase">
              Campus
            </span>
          </div>
        </div>

        {/* Host */}
        <h2 className="font-fraunces text-[1.25rem] font-bold text-text-primary mb-4 tracking-tight">
          Listed by
        </h2>
        <div className="bg-white rounded-[20px] p-3 sm:p-4 border border-slate-100 shadow-sm flex items-center gap-2 sm:gap-3.5 mb-8 flex-wrap">
          <div className="w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] shrink-0 rounded-full bg-gradient-to-br from-indigo-light to-indigo flex items-center justify-center text-white font-fraunces font-bold text-[1.2rem]">
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
            {!isContactUnlocked ? (
              <button
                onClick={() =>
                  setUnlockContext({
                    type: "Contact",
                    target: "Mr. Carter",
                    cost: 100,
                  })
                }
                className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center transition-transform hover:-translate-y-0.5"
              >
                <Lock size={16} />
              </button>
            ) : (
              <>
                <a
                  href="tel:+233"
                  className="w-10 h-10 rounded-full bg-slate-100 text-indigo flex items-center justify-center transition-transform hover:bg-indigo hover:text-white hover:-translate-y-0.5"
                >
                  <Phone size={16} />
                </a>
                <a
                  href="https://wa.me/233"
                  className="w-10 h-10 rounded-full bg-slate-100 text-teal-600 flex items-center justify-center transition-transform hover:bg-teal-600 hover:text-white hover:-translate-y-0.5"
                >
                  <FaWhatsapp size={16} />
                </a>
              </>
            )}
          </div>
        </div>

        {/* Amenities */}
        <h2 className="font-fraunces text-[1.25rem] font-bold text-text-primary mb-4 tracking-tight">
          What's Included
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="flex items-center gap-3 bg-slate-50/80 rounded-[16px] p-3.5 border border-slate-100/50">
            <FaWifi className="text-indigo text-base" />{" "}
            <span className="text-[0.85rem] font-bold text-text-primary">
              Fast Wi-Fi
            </span>
          </div>
          <div className="flex items-center gap-3 bg-slate-50/80 rounded-[16px] p-3.5 border border-slate-100/50">
            <FaSnowflake className="text-indigo text-base" />{" "}
            <span className="text-[0.85rem] font-bold text-text-primary">
              Air/con
            </span>
          </div>
          <div className="flex items-center gap-3 bg-slate-50/80 rounded-[16px] p-3.5 border border-slate-100/50">
            <FaShieldAlt className="text-indigo text-base" />{" "}
            <span className="text-[0.85rem] font-bold text-text-primary">
              24/7 Security
            </span>
          </div>
          <div className="flex items-center gap-3 bg-slate-50/80 rounded-[16px] p-3.5 border border-slate-100/50">
            <FaPlug className="text-indigo text-base" />{" "}
            <span className="text-[0.85rem] font-bold text-text-primary">
              Backup Gen
            </span>
          </div>
          <div className="flex items-center gap-3 bg-slate-50/80 rounded-[16px] p-3.5 border border-slate-100/50">
            <FaTint className="text-indigo text-base" />{" "}
            <span className="text-[0.85rem] font-bold text-text-primary">
              Water 24/7
            </span>
          </div>
          <div className="flex items-center gap-3 bg-slate-50/80 rounded-[16px] p-3.5 border border-slate-100/50 opacity-50">
            <FaUtensils className="text-slate-400 text-base" />{" "}
            <span className="text-[0.85rem] font-bold text-text-primary">
              Cafeteria
            </span>
          </div>
        </div>

        <h2 className="font-fraunces text-[1.25rem] font-bold text-text-primary mb-4 tracking-tight">
          About this Hostel
        </h2>
        <p className="text-[0.9rem] text-text-muted leading-[1.7] mb-2">
          {descExpanded ? fullDesc : fullDesc.slice(0, 200) + "..."}
        </p>
        <button
          onClick={() => setDescExpanded(!descExpanded)}
          className="text-indigo font-bold text-[0.85rem] mb-8"
        >
          {descExpanded ? "Show less ↑" : "Read more →"}
        </button>

        {/* Room Options */}
        <h2 className="font-fraunces text-[1.25rem] font-bold text-text-primary mb-4 tracking-tight">
          Room Options
        </h2>
        <div className="flex gap-2.5 mb-4 px-1 pb-1 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveRoomMode("single")}
            className={`px-[18px] py-[8px] rounded-full text-[0.85rem] font-bold transition-all shrink-0 ${activeRoomMode === "single" ? "bg-indigo-dark text-white shadow-sm" : "bg-slate-100 text-text-muted hover:bg-slate-200"}`}
          >
            Single
          </button>
          <button
            onClick={() => setActiveRoomMode("double")}
            className={`px-[18px] py-[8px] rounded-full text-[0.85rem] font-bold transition-all shrink-0 ${activeRoomMode === "double" ? "bg-indigo-dark text-white shadow-sm" : "bg-slate-100 text-text-muted hover:bg-slate-200"}`}
          >
            Double
          </button>
          <button
            onClick={() => setActiveRoomMode("quad")}
            className={`px-[18px] py-[8px] rounded-full text-[0.85rem] font-bold transition-all shrink-0 ${activeRoomMode === "quad" ? "bg-indigo-dark text-white shadow-sm" : "bg-slate-100 text-text-muted hover:bg-slate-200"}`}
          >
            Quad
          </button>
        </div>

        <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden mb-8">
          <div className="h-[160px]">
            <img
              src={selectedRoom.img}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-[18px]">
            <h3 className="font-fraunces text-[1.1rem] font-bold text-text-primary mb-2.5">
              {selectedRoom.name}
            </h3>
            <div className="flex gap-3 flex-wrap mb-3.5">
              <div className="text-[0.8rem] text-text-muted font-medium flex items-center gap-1.5">
                <Ruler size={14} className="text-indigo" /> {selectedRoom.size}
              </div>
              <div className="text-[0.8rem] text-text-muted font-medium flex items-center gap-1.5">
                <User size={14} className="text-indigo" /> {selectedRoom.occ}
              </div>
              <div className="text-[0.8rem] text-text-muted font-medium flex items-center gap-1.5">
                <Bed size={14} className="text-indigo" /> {selectedRoom.bed}
              </div>
            </div>
            <div className="flex justify-between items-end pt-3.5 border-t border-slate-100">
              <div>
                <strong className="block font-fraunces text-[1.35rem] text-text-primary leading-none">
                  {selectedRoom.price}
                </strong>
                <span className="block text-[0.75rem] text-text-muted font-medium mt-1">
                  per semester
                </span>
              </div>
              <span
                className={`text-[0.7rem] font-bold px-[10px] py-[5px] rounded-[8px] uppercase tracking-[0.3px] ${selectedRoom.availClass}`}
              >
                {selectedRoom.avail}
              </span>
            </div>
          </div>
        </div>

        {/* Location  */}
        <h2 className="font-fraunces text-[1.25rem] font-bold text-text-primary mb-4 tracking-tight">
          Location
        </h2>
        <div className="relative h-[220px] rounded-[20px] overflow-hidden border border-slate-100 shadow-sm mb-3 cursor-pointer">
          <div
            className={`w-full h-full transition-all ${!isMapUnlocked ? "blur-[4px] pointer-events-none" : ""}`}
          >
            <MapContainer
              center={[hostel.lat, hostel.lng]}
              zoom={15}
              className="w-full h-full"
              zoomControl={false}
              dragging={false}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution="© OpenStreetMap"
              />
              <Marker position={[hostel.lat, hostel.lng]} icon={mapIcon} />
            </MapContainer>
          </div>
          {!isMapUnlocked && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-sm"
              onClick={() =>
                setUnlockContext({
                  type: "Location",
                  target: hostel.name,
                  cost: 100,
                })
              }
            >
              <button className="bg-indigo text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-float active:scale-95 transition-transform">
                <Lock size={16} /> Reveal Exact Location
              </button>
            </div>
          )}
        </div>
        <p className="text-[0.8rem] text-text-muted font-medium flex items-center gap-2 pb-10">
          <Info size={14} className="text-indigo" />{" "}
          {!isMapUnlocked
            ? "Tap the map to unlock exact location."
            : "Location unlocked. Tap map to open."}
        </p>
      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 w-full max-w-[400px] bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-[100] flex justify-between items-center gap-3 pb-8">
        <div className="flex-1 min-w-0">
          <div className="font-fraunces text-[1.3rem] sm:text-[1.5rem] font-bold text-text-primary leading-[1.1]">
            {selectedRoom.price}
          </div>
          <div className="text-[0.65rem] sm:text-[0.75rem] text-text-muted font-medium mt-0.5 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
            {activeRoomMode === "single"
              ? "1"
              : activeRoomMode === "double"
                ? "2"
                : "4"}{" "}
            in a room / sem
          </div>
          <div className="bg-indigo-light text-indigo text-[0.65rem] sm:text-[0.75rem] font-bold px-2 py-1 rounded-[6px] inline-flex items-center gap-1 truncate max-w-full">
            <Tag size={12} className="shrink-0" /> Code DWELL15
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => showToast("Link copied!")}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-[12px] sm:rounded-[14px] bg-slate-50 border border-slate-200 flex items-center justify-center text-text-primary hover:bg-slate-100 transition-colors"
          >
            <ArrowUpFromLine size={16} />
          </button>
          <button
            onClick={() => setBookingModalOpen(true)}
            className="bg-indigo text-white font-bold h-10 sm:h-12 px-4 sm:px-6 rounded-[12px] sm:rounded-[14px] shadow-float active:scale-95 text-[0.9rem] sm:text-[1rem]"
          >
            Request
          </button>
        </div>
      </div>

      {/* UNLOCK MODAL */}
      {unlockContext && (
        <div className="fixed inset-0 z-[1000] bg-[#0f0e2e]/60 backdrop-blur-sm flex items-end">
          <div className="w-full max-w-[400px] mx-auto bg-white rounded-t-[32px] pt-6 px-6 pb-10 animate-in slide-in-from-bottom h-max flex flex-col items-center">
            <div className="w-10 h-[5px] bg-slate-300 rounded-full mb-8 shadow-sm" />
            <div className="text-amber-glow mb-2.5">
              <Lock size={40} />
            </div>
            <h2 className="font-fraunces text-[1.2rem] sm:text-[1.3rem] font-bold text-text-primary mb-1">
              Unlock {unlockContext.type}
            </h2>
            <p className="text-[0.85rem] sm:text-[0.9rem] text-text-muted mb-5 text-center">
              Reveal the {unlockContext.type.toLowerCase()} for{" "}
              {unlockContext.target}.
            </p>
            <div className="flex items-center gap-2 text-[1.35rem] sm:text-[1.5rem] font-bold text-text-primary mb-5">
              <Coins className="text-amber-400" size={24} /> -
              {unlockContext.cost} Credits
            </div>

            <button
              onClick={handleUnlockConfirm}
              className="w-full bg-amber-glow text-white font-bold py-3.5 sm:py-4 rounded-[14px] sm:rounded-[16px] mb-2.5 active:scale-95 transition-transform"
            >
              Pay & Reveal
            </button>
            <button
              onClick={() => setUnlockContext(null)}
              className="w-full bg-slate-50 border border-slate-200 text-text-primary font-bold py-3.5 sm:py-4 rounded-[14px] sm:rounded-[16px] active:scale-95 transition-transform"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-[#0f0e2e]/60 backdrop-blur-sm flex items-end">
          <div className="w-full max-w-[400px] max-h-[85vh] overflow-y-auto hide-scrollbar mx-auto bg-white rounded-t-[32px] pt-6 px-5 sm:px-6 pb-10 animate-in slide-in-from-bottom">
            <div
              className="w-10 h-[5px] bg-slate-300 rounded-full mx-auto mb-6 shadow-sm cursor-pointer hover:bg-slate-400"
              onClick={() => setBookingModalOpen(false)}
            />

            <h2 className="font-fraunces text-[1.3rem] font-bold text-text-primary mb-1">
              Request to Book
            </h2>
            <p className="text-[0.85rem] font-medium text-text-muted mb-6">
              {hostel.name} · {selectedRoom.name}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[0.75rem] font-bold text-text-muted uppercase tracking-[0.5px] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Kwame"
                  className="w-full bg-slate-50 border border-slate-200 rounded-[14px] px-4 py-3.5 text-[0.9rem] font-medium text-text-primary outline-none focus:border-indigo focus:ring-2 focus:ring-indigo-light"
                />
              </div>
              <div>
                <label className="block text-[0.75rem] font-bold text-text-muted uppercase tracking-[0.5px] mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Owusu"
                  className="w-full bg-slate-50 border border-slate-200 rounded-[14px] px-4 py-3.5 text-[0.9rem] font-medium text-text-primary outline-none focus:border-indigo focus:ring-2 focus:ring-indigo-light"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[0.75rem] font-bold text-text-muted uppercase tracking-[0.5px] mb-2">
                Phone / WhatsApp
              </label>
              <input
                type="tel"
                placeholder="+233 5X XXX XXXX"
                className="w-full bg-slate-50 border border-slate-200 rounded-[14px] px-4 py-3.5 text-[0.9rem] font-medium text-text-primary outline-none focus:border-indigo focus:ring-2 focus:ring-indigo-light"
              />
            </div>
            <div className="mb-4">
              <label className="block text-[0.75rem] font-bold text-text-muted uppercase tracking-[0.5px] mb-2">
                Room Type
              </label>
              <select
                value={activeRoomMode}
                onChange={(e) => setActiveRoomMode(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-[14px] px-4 py-3.5 text-[0.9rem] font-medium text-text-primary outline-none focus:border-indigo focus:ring-2 focus:ring-indigo-light"
              >
                <option value="single">
                  Single Room – {rooms.single.price}/sem
                </option>
                <option value="double">
                  Double Room – {rooms.double.price}/sem
                </option>
                <option value="quad">Quad Room – {rooms.quad.price}/sem</option>
              </select>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-[16px] p-[18px] flex justify-between items-center mb-6">
              <span className="text-[0.85rem] font-semibold text-text-muted">
                Estimated Total
              </span>
              <strong className="font-fraunces text-[1.4rem] font-bold text-text-primary">
                {selectedRoom.price}
              </strong>
            </div>

            <button
              onClick={() => {
                setBookingModalOpen(false);
                showToast("Booking request sent! 🎉");
              }}
              className="w-full bg-indigo text-white font-bold py-4 rounded-[16px] shadow-float active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              Confirm Request {`->`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
