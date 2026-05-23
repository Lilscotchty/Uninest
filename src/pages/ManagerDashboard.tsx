import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Hostel } from '../types';
import {
  LayoutDashboard,
  Home as HomeIcon,
  MessageSquare,
  Settings,
  Plus,
  Edit2,
  Eye,
  Menu,
  X,
  ChevronLeft,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';

interface RoomType {
  imageFile?: File;
  imageUrlPreview?: string;
  id: string;
  name: string;
  totalRooms: number;
  occupantsPerRoom: number;
  pricePerYear: number;
}

interface ManagerHostelForm {
  title: string;
  description: string;
  ghanaPostGPS: string;
  location: string;
  lat?: number;
  lng?: number;
  googleMapsUrl?: string;
  ghanaPostUrl?: string;
  resolvedAddress?: string;        // ← NEW: human-readable address from geocoder
  roomTypes: RoomType[];
  videoTour?: string;
  compoundImageFile?: File;
  compoundImagePreview?: string;
  image360File?: File;
  image360Preview?: string;
  amenities: {
    wifi: boolean;
    generator: boolean;
    water: boolean;
    ac: boolean;
    kitchen: boolean;
    studyRoom: boolean;
    security: boolean;
  };
  policies: string;
}

export const ManagerDashboard: React.FC = () => {
  const { setCurrentView, showToast, hostels, addCustomHostel } = useAppContext();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'hostels' | 'inquiries' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);

  const myHostels = hostels;

  const renderContent = () => {
    if (isEditing) {
      return (
        <CreateEditListing
          onBack={() => setIsEditing(false)}
          onSave={async (data) => {
            showToast("Saving to database...");
            try {
              const amenitiesList: string[] = [];
              if (data.amenities.wifi) amenitiesList.push("WiFi");
              if (data.amenities.generator) amenitiesList.push("Generator");
              if (data.amenities.water) amenitiesList.push("Water");
              if (data.amenities.ac) amenitiesList.push("AC");
              if (data.amenities.kitchen) amenitiesList.push("Kitchen");
              if (data.amenities.studyRoom) amenitiesList.push("Study Room");
              if (data.amenities.security) amenitiesList.push("Security");

              // ── Compound image upload ──────────────────────────────────────
              let compoundUrl = "https://loremflickr.com/600/400/bedroom?lock=305";
              if (data.compoundImageFile) {
                const fileExt = data.compoundImageFile.name.split(".").pop();
                const fileName = `compound-${Math.random()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                  .from("hostel-media")
                  .upload(fileName, data.compoundImageFile);
                if (uploadError) throw new Error("Image upload failed: " + uploadError.message);
                compoundUrl = supabase.storage
                  .from("hostel-media")
                  .getPublicUrl(fileName).data.publicUrl;
              }

              // ── 360 image upload ───────────────────────────────────────────
              let image360Url = "";
              if (data.image360File) {
                const fileExt = data.image360File.name.split(".").pop();
                const fileName = `360-${Math.random()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                  .from("hostel-media")
                  .upload(fileName, data.image360File);
                if (uploadError) throw new Error("360 Image upload failed: " + uploadError.message);
                image360Url = supabase.storage
                  .from("hostel-media")
                  .getPublicUrl(fileName).data.publicUrl;
              }

              // ── Auth check ─────────────────────────────────────────────────
              const { data: authData, error: authError } = await supabase.auth.getUser();
              if (authError || !authData?.user) {
                throw new Error(
                  "Authentication failed: You must be logged in as a Manager to insert or modify listings."
                );
              }
              const managerId = authData.user.id;

              // ── Coordinates: use only real verified coords, never dummy values ──
              // If the manager skipped GPS verification, lat/lng will be undefined.
              // We store null in that case; the app can handle missing coords gracefully.
              const finalLat = data.lat ?? null;
              const finalLng = data.lng ?? null;

              // ── Insert hostel row ──────────────────────────────────────────
              const { data: hostel, error: hostelError } = await supabase
                .from("hostels")
                .insert({
                  manager_id: managerId,
                  name: data.title,
                  description: data.description,
                  digital_address: data.ghanaPostGPS,
                  location: data.location,
                  amenities: amenitiesList,
                  policies: data.policies,
                  video_url: data.videoTour,
                  image_url: compoundUrl,
                  image_360_url: image360Url,
                  lat: finalLat,
                  lng: finalLng,
                })
                .select()
                .single();

              if (hostelError) throw hostelError;

              // ── Room type uploads & insert ─────────────────────────────────
              const roomsToInsert: any[] = [];
              const roomImages: string[] = [];

              for (const r of data.roomTypes) {
                let roomImgUrl = "https://loremflickr.com/600/400/bedroom?lock=305";
                if (r.imageFile) {
                  const fileExt = r.imageFile.name.split(".").pop();
                  const fileName = `room-${Math.random()}.${fileExt}`;
                  const { error: uploadError } = await supabase.storage
                    .from("hostel-media")
                    .upload(fileName, r.imageFile);
                  if (uploadError) throw new Error("Room image upload failed: " + uploadError.message);
                  roomImgUrl = supabase.storage
                    .from("hostel-media")
                    .getPublicUrl(fileName).data.publicUrl;
                }
                roomImages.push(roomImgUrl);
                roomsToInsert.push({
                  hostel_id: hostel.id,
                  room_type: r.name,
                  price: Number(r.pricePerYear),
                  capacity: Number(r.occupantsPerRoom),
                  quantity: Number(r.totalRooms),
                  image_url: roomImgUrl,
                });
              }

              if (roomsToInsert.length > 0) {
                const { error: roomsError } = await supabase.from("rooms").insert(roomsToInsert);
                if (roomsError) throw roomsError;
              }

              // ── Update local app state ─────────────────────────────────────
              const newHostel: Hostel = {
                id: hostel?.id || Date.now(),
                name: data.title,
                loc: data.location || data.ghanaPostGPS || "Accra",
                lat: finalLat ?? 0,
                lng: finalLng ?? 0,
                price: `GH₵${data.roomTypes[0]?.pricePerYear || 5000}`,
                priceNum: data.roomTypes[0]?.pricePerYear || 5000,
                rating: 0.0,
                reviews: 0,
                tags: amenitiesList.slice(0, 3),
                category: "standard" as const,
                avail: "Available" as const,
                img: compoundUrl,
                desc: data.description,
                amenities: amenitiesList,
                policies: data.policies,
                rooms: roomsToInsert,
                videoTour: data.videoTour,
                panoramas: image360Url ? [image360Url] : [],
                images: [compoundUrl, ...roomImages].filter(Boolean),
                dbId: hostel?.id,
              };

              addCustomHostel(newHostel);
              setIsEditing(false);
              showToast("Listing saved successfully!");
            } catch (e: any) {
              console.error("[ManagerDashboard] Error saving listing:", e);
              if (e.message?.includes("Failed to fetch")) {
                showToast(
                  "Network error: Failed to fetch. Please ensure your Vercel Environment Variables " +
                  "(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are configured correctly and the domain is allowed."
                );
              } else {
                showToast("Error saving to database: " + e.message);
              }
            }
          }}
        />
      );
    }

    switch (activeTab) {
      case "overview":
      case "hostels":
        return <Overview onAddNew={() => setIsEditing(true)} hostels={myHostels} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
            <p>This section is under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full flex-1 min-h-0 bg-app-bg flex font-sans relative overflow-hidden">
      {/* Sidebar */}
      <div
        className={`absolute z-50 h-full bg-card-bg border-r border-transparent w-[260px] transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border-subtle h-[60px]">
          <span className="font-fraunces font-bold text-lg text-indigo">Hostel Portal</span>
          <button className="text-text-muted" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col p-4 gap-2">
          <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active={activeTab === "overview"} onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }} />
          <NavItem icon={<HomeIcon size={18} />} label="My Hostels" active={activeTab === "hostels"} onClick={() => { setActiveTab("hostels"); setSidebarOpen(false); }} />
          <NavItem icon={<MessageSquare size={18} />} label="Inquiries" active={activeTab === "inquiries"} onClick={() => { setActiveTab("inquiries"); setSidebarOpen(false); }} />
          <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === "settings"} onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }} />
        </div>
      </div>

      {isSidebarOpen && (
        <div className="absolute inset-0 bg-black/20 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <header className="h-[60px] flex items-center justify-between px-4 bg-card-bg border-b border-transparent shrink-0">
          <div className="flex items-center gap-3">
            <button className="text-text-muted hover:text-indigo" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-1 text-sm font-semibold text-text-muted hover:text-indigo"
            >
              <ChevronLeft size={16} /> Exit
            </button>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold">Manager View</div>
        </header>

        <main className="flex-1 overflow-y-auto bg-app-bg hide-scrollbar">{renderContent()}</main>
      </div>
    </div>
  );
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const NavItem = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-semibold text-[0.9rem] ${
      active
        ? "bg-indigo text-white shadow-sm"
        : "text-text-muted hover:bg-indigo-light/50 hover:text-text-primary"
    }`}
  >
    {icon} {label}
  </button>
);

const Overview = ({ onAddNew, hostels }: { onAddNew: () => void; hostels: Hostel[] }) => (
  <div className="p-4 flex flex-col gap-5 w-full max-w-5xl mx-auto">
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="font-fraunces text-xl font-bold text-text-primary">Overview</h1>
        <p className="text-sm text-text-muted mt-1">Manage your properties and track performance.</p>
      </div>
      <button
        onClick={onAddNew}
        className="bg-indigo text-white font-bold px-5 py-2.5 rounded-xl shadow-sm hover:bg-indigo/90 active:scale-95 transition-all flex items-center gap-2 justify-center w-full"
      >
        <Plus size={18} /> New Listing
      </button>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <StatCard title="Total Properties" value={hostels.length.toString()} trend="+1 this month" />
      <StatCard title="Total Rooms" value="120" trend="Active" />
      <StatCard title="Occupancy Rate" value="85%" trend="+5% up" />
      <StatCard title="Pending Inquiries" value="12" trend="Needs action" alert />
    </div>

    <div className="bg-card-bg rounded-2xl shadow-sm border-transparent border p-5">
      <h2 className="text-lg font-bold text-text-primary mb-4">Active Listings</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-border-subtle text-xs uppercase text-text-muted">
              <th className="pb-3 font-semibold">Property</th>
              <th className="pb-3 font-semibold">Location</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hostels.map((h) => (
              <tr key={h.id} className="border-b border-border-subtle last:border-0">
                <td className="py-4 font-semibold text-text-primary">{h.name}</td>
                <td className="py-4 text-sm text-text-muted">{h.loc}</td>
                <td className="py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700">
                    published
                  </span>
                </td>
                <td className="py-4 flex items-center justify-end gap-2">
                  <button
                    onClick={onAddNew}
                    className="w-8 h-8 rounded-lg bg-indigo-light/30 text-indigo flex items-center justify-center hover:bg-indigo hover:text-white transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-slate-100 text-text-muted flex items-center justify-center hover:bg-slate-200 transition-colors">
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {hostels.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-text-muted text-sm">
                  No listings found. Create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const StatCard = ({
  title,
  value,
  trend,
  alert,
}: {
  title: string;
  value: string;
  trend: string;
  alert?: boolean;
}) => (
  <div className="bg-card-bg p-4 rounded-2xl border-transparent border shadow-sm flex flex-col gap-1">
    <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">{title}</span>
    <strong className="text-2xl font-black text-text-primary mt-1">{value}</strong>
    <span className={`text-xs font-medium ${alert ? "text-coral" : "text-emerald-600"}`}>{trend}</span>
  </div>
);

// ─── CreateEditListing ─────────────────────────────────────────────────────────

const CreateEditListing = ({
  onBack,
  onSave,
}: {
  onBack: () => void;
  onSave: (data: ManagerHostelForm) => void;
}) => {
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [formData, setFormData] = useState<Partial<ManagerHostelForm>>({
    title: "",
    description: "",
    ghanaPostGPS: "",
    location: "",
    lat: undefined,
    lng: undefined,
    googleMapsUrl: "",
    ghanaPostUrl: "",
    resolvedAddress: "",          // ← initialised here
    roomTypes: [{ id: "1", name: "", totalRooms: 0, occupantsPerRoom: 0, pricePerYear: 0 }],
    videoTour: "",
    amenities: {
      wifi: false,
      generator: false,
      water: false,
      ac: false,
      kitchen: false,
      studyRoom: false,
      security: false,
    },
    policies: "",
  });

  const handleAmenitiesChange = (key: keyof ManagerHostelForm["amenities"]) => {
    setFormData({
      ...formData,
      amenities: { ...formData.amenities, [key]: !(formData.amenities as any)[key] } as any,
    });
  };

  const handleNext = () => {
    if (step === 1 && !formData.title?.trim()) {
      alert("Title is required");
      return;
    }
    setStep(step + 1);
  };

 // ─────────────────────────────────────────────────────────────────────────────
// handleVerifyGPS — GhanaPost GPS → real lat/lng
//
// API:  POST https://ghanapostgps.sperixlabs.org/get-location
//       Content-Type: application/x-www-form-urlencoded
//       Body param:   address=GM-132-4567
//
// Response shape (found):
// {
//   "found": true,
//   "data": {
//     "Table": [{
//       "CenterLatitude":  5.601...,
//       "CenterLongitude": -0.187...,
//       "Area": "...", "Street": "...", "District": "...", "Region": "...",
//       "PostCode": "...", "GPSName": "..."
//     }]
//   }
// }
//
// Response shape (not found):
// { "found": false, "data": { "Table": null } }
//
// NOTE: Your environment variable must be named VITE_GHANAPOST_API_URL
//       and set to: https://ghanapostgps.sperixlabs.org
//       OR call the endpoint directly as shown below.
// ─────────────────────────────────────────────────────────────────────────────

const handleVerifyGPS = async () => {
  if (!formData.ghanaPostGPS) return;
  setIsVerifying(true);

  // 1. Sanitise input — strip everything except letters and digits, uppercase
  const raw = formData.ghanaPostGPS.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  // 2. Validate format: XX-NNN-NNNN or XX-NNNN-NNNN  (e.g. GM-132-4567)
  const parts = raw.match(/^([A-Z]{2})(\d{3,4})(\d{4})$/);
  if (!parts) {
    alert(
      'Invalid GhanaPost GPS format.\n' +
      'Expected XX-NNN-NNNN or XX-NNNN-NNNN — e.g. GM-132-4567 or GA-144-3280.'
    );
    setIsVerifying(false);
    return;
  }

  // Re-format to canonical dashed form the API accepts
  const standardCode = `${parts[1]}-${parts[2]}-${parts[3]}`;

  try {
    // ── PRIMARY: sperixlabs GhanaPost API ────────────────────────────────────
    // Method: POST | Content-Type: application/x-www-form-urlencoded
    // Env var: VITE_GHANAPOST_API_URL (set to https://ghanapostgps.sperixlabs.org)
    const apiBase =
      import.meta.env.VITE_GHANAPOST_API_URL?.replace(/\/$/, '') ||
      'https://ghanapostgps.sperixlabs.org';

    const body = new URLSearchParams();
    body.append('address', standardCode);

    const response = await fetch(`${apiBase}/get-location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error(`API responded with HTTP ${response.status}`);
    }

    const result = await response.json();

    // 3. Check the `found` flag first — never trust Table[0] without it
    if (!result.found || !result.data?.Table?.[0]) {
      alert(
        `Address "${standardCode}" was not found in the GhanaPost database.\n\n` +
        'Please double-check the code and try again.'
      );
      setIsVerifying(false);
      return;
    }

    const record = result.data.Table[0];

    // 4. Extract real coordinates — CenterLatitude / CenterLongitude
    const lat = parseFloat(record.CenterLatitude);
    const lng = parseFloat(record.CenterLongitude);

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('API returned non-numeric coordinates.');
    }

    // 5. Build a human-readable resolved address from the returned fields
    const resolvedAddress = [record.Area, record.Street, record.District, record.Region]
      .filter(Boolean)
      .join(', ');

    // 6. Commit everything to form state
    setFormData(prev => ({
      ...prev,
      ghanaPostGPS:    standardCode,
      lat,
      lng,
      googleMapsUrl:   `https://www.google.com/maps?q=${lat},${lng}`,
      ghanaPostUrl:    `https://www.ghanapostgps.com/map/#${raw}`,
      resolvedAddress,
    }));

  } catch (err: any) {
    console.error('[handleVerifyGPS]', err);
    alert(
      'Could not reach the GhanaPost API.\n\n' +
      'Check your network connection or that VITE_GHANAPOST_API_URL is set correctly.\n\n' +
      `Detail: ${err?.message ?? err}`
    );
  } finally {
    setIsVerifying(false);
  }
};
  // ────────────────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 flex flex-col gap-5 w-full mx-auto pb-20">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="text-text-muted hover:text-indigo">
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-fraunces text-xl font-bold text-text-primary">Add New Listing</h1>
      </div>

      {/* Progress bar */}
      <div className="flex gap-2 mb-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full ${s <= step ? "bg-indigo" : "bg-border-subtle"}`}
          />
        ))}
      </div>

      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 4) {
            handleNext();
          } else {
            onSave(formData as ManagerHostelForm);
          }
        }}
      >
        {/* ── Step 1: Basic Information ───────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-card-bg p-4 rounded-2xl shadow-sm border-transparent border flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-lg font-bold text-text-primary mb-2">Basic Information</h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-primary">Hostel Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm bg-app-bg focus:border-indigo outline-none"
                placeholder="e.g. Pentagon Hostel"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-primary">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm bg-app-bg focus:border-indigo outline-none h-24 resize-none"
                placeholder="Describe the atmosphere, community..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-primary">GhanaPost GPS Address *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.ghanaPostGPS}
                  onChange={(e) =>
                    setFormData({ ...formData, ghanaPostGPS: e.target.value, lat: undefined, lng: undefined, resolvedAddress: "" })
                  }
                  className="flex-1 border border-border-subtle rounded-xl px-4 py-2.5 text-sm bg-app-bg focus:border-indigo outline-none"
                  placeholder="e.g. GA-123-4567"
                  required
                />
                <button
                  type="button"
                  onClick={handleVerifyGPS}
                  disabled={isVerifying || !formData.ghanaPostGPS}
                  className="bg-indigo-light text-indigo font-bold px-4 rounded-xl text-sm whitespace-nowrap active:scale-95 disabled:opacity-50"
                >
                  {isVerifying ? "Verifying…" : "Verify"}
                </button>
              </div>
            </div>

            {/* Map preview — only shown when real coordinates exist */}
            {formData.lat && formData.lng && (
              <div className="rounded-xl overflow-hidden border border-border-subtle h-[160px] relative animate-in fade-in">
                <iframe
                  src={`https://maps.google.com/maps?q=${formData.lat},${formData.lng}&z=16&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur text-xs px-3 py-2 rounded-lg font-medium text-emerald-700 shadow-sm flex items-center justify-between gap-2">
                  <span className="truncate">
                    {formData.resolvedAddress ? `✓ ${formData.resolvedAddress}` : "Address Verified"}
                  </span>
                  <CheckCircle2 size={14} className="shrink-0" />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-primary">Location / Proximity</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm bg-app-bg focus:border-indigo outline-none"
                placeholder="e.g. 5 mins walk from Main Gate"
              />
            </div>
          </div>
        )}

        {/* ── Step 2: Room & Pricing ──────────────────────────────────────── */}
        {step === 2 && (
          <div className="bg-card-bg p-4 rounded-2xl shadow-sm border-transparent border flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-lg font-bold text-text-primary mb-2">Room & Pricing Configuration</h2>
            <p className="text-xs text-text-muted">Add the different types of rooms available.</p>

            {formData.roomTypes?.map((room, index) => (
              <div key={room.id} className="border border-border-subtle rounded-xl p-4 bg-app-bg/50 relative">
                {formData.roomTypes!.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, roomTypes: formData.roomTypes?.filter((_, i) => i !== index) })
                    }
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                )}
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-primary">Room Name</label>
                    <input
                      type="text"
                      value={room.name}
                      onChange={(e) => {
                        const newRooms = [...formData.roomTypes!];
                        newRooms[index].name = e.target.value;
                        setFormData({ ...formData, roomTypes: newRooms });
                      }}
                      placeholder="e.g. 2 in a room"
                      className="w-full border border-border-subtle rounded-lg px-3 py-2 text-sm bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-primary">Total Rooms</label>
                    <input
                      type="number"
                      value={room.totalRooms || ""}
                      onChange={(e) => {
                        const newRooms = [...formData.roomTypes!];
                        newRooms[index].totalRooms = Number(e.target.value);
                        setFormData({ ...formData, roomTypes: newRooms });
                      }}
                      placeholder="10"
                      className="w-full border border-border-subtle rounded-lg px-3 py-2 text-sm bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-primary">Occupants per rm.</label>
                    <input
                      type="number"
                      value={room.occupantsPerRoom || ""}
                      onChange={(e) => {
                        const newRooms = [...formData.roomTypes!];
                        newRooms[index].occupantsPerRoom = Number(e.target.value);
                        setFormData({ ...formData, roomTypes: newRooms });
                      }}
                      placeholder="2"
                      className="w-full border border-border-subtle rounded-lg px-3 py-2 text-sm bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-primary">Price (per Sem)</label>
                    <input
                      type="number"
                      value={room.pricePerYear || ""}
                      onChange={(e) => {
                        const newRooms = [...formData.roomTypes!];
                        newRooms[index].pricePerYear = Number(e.target.value);
                        setFormData({ ...formData, roomTypes: newRooms });
                      }}
                      placeholder="4500"
                      className="w-full border border-border-subtle rounded-lg px-3 py-2 text-sm bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-primary">Room Image *</label>
                    <div className="relative border-2 border-dashed border-indigo-light bg-app-bg rounded-xl h-24 flex flex-col items-center justify-center text-text-muted gap-1 cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden">
                      {room.imageUrlPreview ? (
                        <img src={room.imageUrlPreview} alt="Room" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <UploadCloud size={18} className="text-indigo" />
                          <span className="text-xs">Upload Room Image</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        title="Room Image"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            const newRooms = [...formData.roomTypes!];
                            newRooms[index].imageFile = file;
                            newRooms[index].imageUrlPreview = URL.createObjectURL(file);
                            setFormData({ ...formData, roomTypes: newRooms });
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  roomTypes: [
                    ...formData.roomTypes!,
                    { id: Math.random().toString(), name: "", totalRooms: 0, occupantsPerRoom: 0, pricePerYear: 0 },
                  ],
                })
              }
              className="text-sm font-bold text-indigo flex items-center gap-1 active:scale-95 self-start"
            >
              <Plus size={16} /> Add Room Type
            </button>
          </div>
        )}

        {/* ── Step 3: Media ───────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="bg-card-bg p-4 rounded-2xl shadow-sm border-transparent border flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-lg font-bold text-text-primary mb-2">Media Uploads</h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-primary">Compound Image *</label>
              <div className="relative border-2 border-dashed border-indigo-light bg-app-bg rounded-xl h-32 flex flex-col items-center justify-center text-text-muted gap-2 cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden">
                {formData.compoundImagePreview ? (
                  <img src={formData.compoundImagePreview} alt="Compound" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <UploadCloud size={24} className="text-indigo" />
                    <span className="text-sm">Upload Compound Image</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  title="Compound Image"
                  required
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setFormData({ ...formData, compoundImageFile: file, compoundImagePreview: URL.createObjectURL(file) });
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-sm font-semibold text-text-primary">360 Virtual Tour Image (Optional)</label>
              <div className="relative border-2 border-dashed border-indigo-light bg-app-bg rounded-xl h-32 flex flex-col items-center justify-center text-text-muted gap-2 cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden">
                {formData.image360Preview ? (
                  <img src={formData.image360Preview} alt="360 Tour" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <UploadCloud size={24} className="text-indigo" />
                    <span className="text-sm">Upload 360 Panorama</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  title="360 Image"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setFormData({ ...formData, image360File: file, image360Preview: URL.createObjectURL(file) });
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-sm font-semibold text-text-primary">
                Video Tour (YouTube/Vimeo URL) (Optional)
              </label>
              <input
                type="url"
                value={formData.videoTour || ""}
                onChange={(e) => setFormData({ ...formData, videoTour: e.target.value })}
                className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm bg-app-bg focus:border-indigo outline-none"
                placeholder="https://..."
              />
            </div>
          </div>
        )}

        {/* ── Step 4: Amenities & Policies ───────────────────────────────── */}
        {step === 4 && (
          <div className="bg-card-bg p-4 rounded-2xl shadow-sm border-transparent border flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-lg font-bold text-text-primary mb-2">Amenities & Policies</h2>

            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm font-semibold text-text-primary mb-1">Select Available Facilities</label>
              <div className="grid grid-cols-2 gap-3">
                {["wifi", "generator", "water", "ac", "kitchen", "studyRoom", "security"].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2 text-sm cursor-pointer border border-border-subtle rounded-lg p-3 hover:bg-app-bg transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={(formData.amenities as any)[item]}
                      onChange={() => handleAmenitiesChange(item as keyof ManagerHostelForm["amenities"])}
                      className="w-4 h-4 rounded text-indigo focus:ring-indigo"
                    />
                    <span className="capitalize text-text-primary">
                      {item.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-primary">Policies & Rules</label>
              <textarea
                value={formData.policies}
                onChange={(e) => setFormData({ ...formData, policies: e.target.value })}
                className="w-full border border-border-subtle rounded-xl px-4 py-2.5 text-sm bg-app-bg focus:border-indigo outline-none h-24 resize-none"
                placeholder="Guest policies, curfew timings..."
              />
            </div>
          </div>
        )}

        {/* ── Navigation buttons ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-4 pb-12">
          <button
            type="button"
            onClick={() => (step > 1 ? setStep(step - 1) : onBack())}
            className="px-5 py-2.5 text-sm font-bold text-text-muted hover:text-text-primary"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-indigo text-white font-bold px-8 py-2.5 rounded-xl shadow-sm hover:bg-indigo/90 active:scale-95 transition-all"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="bg-emerald-600 text-white font-bold px-8 py-2.5 rounded-xl shadow-sm hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2"
            >
              Publish <CheckCircle2 size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};