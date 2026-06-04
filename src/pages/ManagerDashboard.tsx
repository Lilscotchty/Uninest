import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Property } from '../types';
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
  CheckCircle2,
  MapPin,
  Navigation,
  MoreHorizontal
} from 'lucide-react';

// ─── Ghana University Campus Database ─────────────────────────────────────────
// Main-gate / centroid coordinates for every major Ghanaian university.
// Used to auto-compute nearest campus and walking distance after GPS verification.
// ──────────────────────────────────────────────────────────────────────────────
const GHANA_UNIVERSITIES = [
  // Greater Accra
  { name: "University of Ghana (Legon)",            shortName: "UG Legon",   lat: 5.65083,  lng: -0.18694 },
  { name: "UPSA – Accra",                           shortName: "UPSA",       lat: 5.63281,  lng: -0.17560 },
  { name: "GIMPA – Legon",                          shortName: "GIMPA",      lat: 5.64900,  lng: -0.17700 },
  { name: "Ghana Communication Technology Univ.",   shortName: "GCTU",       lat: 5.57500,  lng: -0.24300 },
  { name: "Accra Technical University",             shortName: "ATU",        lat: 5.55200,  lng: -0.20700 },
  { name: "University of Ghana – Korle Bu",         shortName: "UG Korle Bu",lat: 5.53900,  lng: -0.22800 },
  // Ashanti
  { name: "KNUST – Kumasi",                         shortName: "KNUST",      lat: 6.67318,  lng: -1.56542 },
  { name: "Kumasi Technical University",            shortName: "KsTU",       lat: 6.68800,  lng: -1.62600 },
  { name: "AAM-USTED Kumasi",                       shortName: "USTED",      lat: 6.72500,  lng: -1.61000 },
  // Central
  { name: "University of Cape Coast",               shortName: "UCC",        lat: 5.10534,  lng: -1.28297 },
  { name: "University of Education, Winneba",       shortName: "UEW",        lat: 5.35167,  lng: -0.62056 },
  { name: "Cape Coast Technical University",        shortName: "CCTU",       lat: 5.10900,  lng: -1.26800 },
  // Northern
  { name: "University for Development Studies",     shortName: "UDS",        lat: 9.44600,  lng: -0.83900 },
  // Western
  { name: "University of Mines & Technology",       shortName: "UMAT",       lat: 5.30300,  lng: -2.00000 },
  // Volta
  { name: "Univ. of Health & Allied Sciences",      shortName: "UHAS",       lat: 6.60900,  lng: 0.47100  },
  // Brong-Ahafo
  { name: "Univ. of Energy & Natural Resources",    shortName: "UENR",       lat: 7.34400,  lng: -2.32600 },
  // Upper East
  { name: "CKT-UTAS – Navrongo",                   shortName: "CKT-UTAS",   lat: 10.89400, lng: -1.09500 },
  { name: "Bolgatanga Technical University",        shortName: "BTU",        lat: 10.78500, lng: -0.85000 },
  // Upper West
  { name: "SDD-UBIDS – Wa",                        shortName: "UBIDS",      lat: 10.06000, lng: -2.50100 },
  // Eastern
  { name: "UESD – Somanya",                        shortName: "UESD",       lat: 6.11900,  lng: -0.02700 },
  // Koforidua
  { name: "Koforidua Technical University",        shortName: "KTU",        lat: 6.09400,  lng: -0.25400 },
  // Takoradi
  { name: "Takoradi Technical University",         shortName: "TTU",        lat: 4.89400,  lng: -1.78400 },
  // Ho
  { name: "Ho Technical University",              shortName: "HTU",        lat: 6.60400,  lng: 0.47000  },
];

// ─── Haversine distance (metres) ─────────────────────────────────────────────
function haversineMetres(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Walking-time label (assumes 80 m/min average walking pace) ──────────────
function walkingLabel(metres: number): string {
  const mins = Math.round(metres / 80);
  if (mins < 1) return "< 1 min walk";
  if (mins < 60) return `~${mins} min walk`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem === 0 ? `~${hrs}h walk` : `~${hrs}h ${rem}min walk`;
}

// ─── Find nearest campus ──────────────────────────────────────────────────────
interface NearestCampus {
  name: string;
  shortName: string;
  distanceM: number;
  walkLabel: string;
}
function findNearestCampus(lat: number, lng: number): NearestCampus {
  let best = GHANA_UNIVERSITIES[0];
  let bestDist = haversineMetres(lat, lng, best.lat, best.lng);
  for (const uni of GHANA_UNIVERSITIES.slice(1)) {
    const d = haversineMetres(lat, lng, uni.lat, uni.lng);
    if (d < bestDist) { best = uni; bestDist = d; }
  }
  return {
    name: best.name,
    shortName: best.shortName,
    distanceM: Math.round(bestDist),
    walkLabel: walkingLabel(bestDist),
  };
}

// ─── Format distance for display ─────────────────────────────────────────────
function distanceLabel(m: number): string {
  return m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`;
}

interface RoomType {
  imageFile?: File;
  imageUrlPreview?: string;
  id: string;
  name: string;
  totalRooms: number;
  occupantsPerRoom: number;
  pricePerYear: number;
}

interface ManagerPropertyForm {
  title: string;
  description: string;
  ghanaPostGPS: string;
  location: string;
  lat?: number;
  lng?: number;
  googleMapsUrl?: string;
  ghanaPostUrl?: string;
  resolvedAddress?: string;
  nearestCampus?: NearestCampus;    // ← auto-filled after GPS verify
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
  const { setCurrentView, showToast, properties, addCustomProperty, removeCustomProperty, updateCustomProperty, user } = useAppContext();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'inquiries' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | number | null>(null);

  const managerId = user?.id || 'local-mock-manager';
  const myProperties = properties.filter(p => p.manager_id === managerId);

  const handleDeleteProperty = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      const propertyToDelete = myProperties.find(p => p.id === id);
      if (propertyToDelete?.dbId) {
        showToast("Deleting...");
        const { error } = await supabase.from("hostels").delete().eq("id", propertyToDelete.dbId);
        if (error) throw error;
      }
      removeCustomProperty(id);
      showToast("Property deleted!");
    } catch(err: any) {
      console.error(err);
      showToast("Failed to delete: " + err.message);
    }
  };

  const handleEditProperty = (id: string | number) => {
    setEditingPropertyId(id);
    setIsEditing(true);
  };

  const renderContent = () => {
    if (isEditing) {
      let initialData: Partial<ManagerPropertyForm> | undefined = undefined;
      if (editingPropertyId) {
         const p = myProperties.find(x => x.id === editingPropertyId);
         if (p) {
            initialData = {
              title: p.name,
              description: p.desc || "",
              location: p.loc,
              lat: p.lat,
              lng: p.lng,
              amenities: {
                wifi: (p.amenities || []).includes("WiFi") || (p.amenities || []).includes("wifi"),
                generator: (p.amenities || []).includes("Generator"),
                water: (p.amenities || []).includes("Water"),
                ac: (p.amenities || []).includes("AC"),
                kitchen: (p.amenities || []).includes("Kitchen"),
                studyRoom: (p.amenities || []).includes("Study Room"),
                security: (p.amenities || []).includes("Security"),
              },
              policies: p.policies || "",
              videoTour: p.videoTour || "",
              roomTypes: p.rooms ? p.rooms.map((r, i) => ({
                 id: String(i),
                 name: r.room_type,
                 pricePerYear: Number(r.price),
                 occupantsPerRoom: Number(r.capacity),
                 totalRooms: Number(r.quantity),
              })) : [{ id: "1", name: "", totalRooms: 0, occupantsPerRoom: 0, pricePerYear: 0 }]
            };
         }
      }

      return (
        <CreateEditListing
          initialData={initialData}
          onBack={() => { setIsEditing(false); setEditingPropertyId(null); }}
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

              let compoundUrl = "https://loremflickr.com/600/400/bedroom?lock=305";
              if (data.compoundImageFile) {
                const fileExt = data.compoundImageFile.name.split(".").pop();
                const fileName = `compound-${Math.random()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                  .from("property-media").upload(fileName, data.compoundImageFile);
                if (uploadError) throw new Error("Image upload failed: " + uploadError.message);
                compoundUrl = supabase.storage.from("property-media").getPublicUrl(fileName).data.publicUrl;
              }

              let image360Url = "";
              if (data.image360File) {
                const fileExt = data.image360File.name.split(".").pop();
                const fileName = `360-${Math.random()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                  .from("property-media").upload(fileName, data.image360File);
                if (uploadError) throw new Error("360 Image upload failed: " + uploadError.message);
                image360Url = supabase.storage.from("property-media").getPublicUrl(fileName).data.publicUrl;
              }

              const { data: authData, error: authError } = await supabase.auth.getUser();
              if (authError || !authData?.user) {
                throw new Error("Authentication failed: You must be logged in as a Manager.");
              }
              const managerId = authData.user.id;

              const finalLat = data.lat ?? null;
              const finalLng = data.lng ?? null;

              // Build proximity string to save alongside location
              const proximityStr = data.nearestCampus
                ? `${distanceLabel(data.nearestCampus.distanceM)} from ${data.nearestCampus.shortName} (${data.nearestCampus.walkLabel})`
                : data.location;

              const updatePayload = {
                  manager_id: managerId,
                  name: data.title,
                  description: data.description,
                  digital_address: data.ghanaPostGPS,
                  location: proximityStr || data.location,
                  amenities: amenitiesList,
                  policies: data.policies,
                  video_url: data.videoTour,
                  lat: finalLat,
                  lng: finalLng,
                  ...((compoundUrl && compoundUrl !== "https://loremflickr.com/600/400/bedroom?lock=305") ? { image_url: compoundUrl } : {}),
                  ...(image360Url ? { image_360_url: image360Url } : {}),
              };

              let property: any = null;
              const edittingDbId = editingPropertyId ? myProperties.find(p => p.id === editingPropertyId)?.dbId : null;

              if (editingPropertyId && edittingDbId) {
                 const { data: dbProp, error: propertyError } = await supabase
                    .from("hostels")
                    .update(updatePayload)
                    .eq('id', edittingDbId)
                    .select().single();
                 if (propertyError) throw propertyError;
                 property = dbProp;
              } else {
                 const { data: dbProp, error: propertyError } = await supabase
                    .from("hostels")
                    .insert(updatePayload)
                    .select().single();
                 if (propertyError) throw propertyError;
                 property = dbProp;
              }

              const roomsToInsert: any[] = [];
              const roomImages: string[] = [];
              for (const r of data.roomTypes) {
                let roomImgUrl = "https://loremflickr.com/600/400/bedroom?lock=305";
                if (r.imageFile) {
                  const fileExt = r.imageFile.name.split(".").pop();
                  const fileName = `room-${Math.random()}.${fileExt}`;
                  const { error: uploadError } = await supabase.storage
                    .from("property-media").upload(fileName, r.imageFile);
                  if (uploadError) throw new Error("Room image upload failed: " + uploadError.message);
                  roomImgUrl = supabase.storage.from("property-media").getPublicUrl(fileName).data.publicUrl;
                }
                roomImages.push(roomImgUrl);
                roomsToInsert.push({
                  hostel_id: property.id,
                  room_type: r.name,
                  price: Number(r.pricePerYear),
                  capacity: Number(r.occupantsPerRoom),
                  quantity: Number(r.totalRooms),
                  image_url: roomImgUrl,
                });
              }
              if (editingPropertyId && property.id) {
                 await supabase.from("rooms").delete().eq("hostel_id", property.id);
              }
              if (roomsToInsert.length > 0) {
                const { error: roomsError } = await supabase.from("rooms").insert(roomsToInsert);
                if (roomsError) throw roomsError;
              }

              const newProperty: Property = {
                id: property?.id || Date.now(),
                name: data.title,
                loc: proximityStr || data.location || data.ghanaPostGPS || "Accra",
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
                dbId: property?.id,
              };

              if (editingPropertyId) {
                updateCustomProperty(editingPropertyId, newProperty);
              } else {
                addCustomProperty(newProperty);
              }
              setIsEditing(false);
              setEditingPropertyId(null);
              showToast("Listing saved successfully!");
            } catch (e: any) {
              console.error("[ManagerDashboard] Error saving listing:", e);
              if (e.message?.includes("Failed to fetch")) {
                showToast("Network error. Check VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY env vars.");
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
      case "properties":
        return <Overview onAddNew={() => { setEditingPropertyId(null); setIsEditing(true); }} onEdit={handleEditProperty} onDelete={handleDeleteProperty} properties={myProperties} />;
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
    <div className="w-full h-full bg-white dark:bg-customDark flex font-sans relative overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed md:relative z-50 h-full bg-white dark:bg-customDark border-r border-gray-100 dark:border-gray-800 w-[260px] shrink-0 transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 h-[60px]">
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Property Portal</span>
          <button className="text-text-muted md:hidden" onClick={() => setSidebarOpen(false)}><X size={24} /></button>
        </div>
        <div className="flex flex-col p-4 gap-2">
          <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active={activeTab === "overview"} onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }} />
          <NavItem icon={<HomeIcon size={18} />} label="My Properties" active={activeTab === "properties"} onClick={() => { setActiveTab("properties"); setSidebarOpen(false); }} />
          <NavItem icon={<MessageSquare size={18} />} label="Inquiries" active={activeTab === "inquiries"} onClick={() => { setActiveTab("inquiries"); setSidebarOpen(false); }} />
          <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === "settings"} onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }} />
        </div>
      </div>

      {isSidebarOpen && <div className="absolute inset-0 bg-black/20 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        <PageHeader
          title="Your Listings"
          actions={[
            { icon: <Plus size={22} strokeWidth={1.8} />, label: "Add", onClick: () => setIsEditing(true) },
            { icon: <MoreHorizontal size={22} strokeWidth={1.8} />, label: "More", onClick: () => {} }
          ]}
          tabs={[
            { id: 'active', label: 'Active' },
            { id: 'pending', label: 'Pending' },
            { id: 'drafts', label: 'Drafts' }
          ]}
          activeTab="active"
          onTabChange={() => {}}
        />
        <main className="flex-1 overflow-y-auto bg-white dark:bg-customDark hide-scrollbar">{renderContent()}</main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-semibold text-[0.9rem] ${active ? "bg-indigo text-white shadow-sm" : "text-text-muted hover:bg-indigo-light/50 hover:text-text-primary"}`}>
    {icon} {label}
  </button>
);

const Overview = ({ onAddNew, onEdit, onDelete, properties }: { onAddNew: () => void; onEdit: (id: string | number) => void; onDelete: (id: string | number) => void; properties: Property[] }) => {
  const totalRooms = properties.reduce((sum, p) => sum + (p.rooms ? p.rooms.reduce((s2, r) => s2 + (Number(r.quantity) || 0), 0) : 0), 0);
  const totalViews = properties.length * 42; // mock performance metric

  return (
  <div className="p-6 flex flex-col gap-6 w-full max-w-5xl mx-auto">
    <div className="flex flex-col gap-3">
      <div>
        <h1 className=" text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Overview</h1>
        <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mt-1">Manage your properties and track performance.</p>
      </div>
      <button onClick={onAddNew} className="bg-indigo text-white font-bold px-5 py-2.5 rounded-xl shadow-sm hover:bg-indigo/90 active:scale-95 transition-all flex items-center gap-2 justify-center w-full">
        <Plus size={18} /> New Listing
      </button>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <StatCard title="Total Properties" value={properties.length.toString()} trend="Active Listings" />
      <StatCard title="Total Rooms" value={totalRooms.toString()} trend="Total capacity" />
      <StatCard title="Total Views" value={totalViews.toString()} trend="Profile views" />
      <StatCard title="Performance" value="Good" trend="Above average" />
    </div>
    <div className="bg-white dark:bg-customDark rounded-2xl shadow-sm border-transparent border p-5">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Active Listings</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-xs uppercase text-text-muted">
              <th className="pb-3 font-semibold">Property</th>
              <th className="pb-3 font-semibold">Location</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((h) => (
              <tr key={h.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                <td className="py-4 text-base font-medium text-gray-900 dark:text-gray-200">{h.name}</td>
                <td className="py-4 text-sm font-normal text-gray-500 dark:text-gray-400">{h.loc}</td>
                <td className="py-4"><span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700">published</span></td>
                <td className="py-4 flex items-center justify-end gap-2">
                  <button onClick={() => onEdit(h.id)} className="w-8 h-8 rounded-lg bg-indigo-light/30 text-indigo flex items-center justify-center hover:bg-indigo hover:text-white transition-colors" title="Edit"><Edit2 size={14} /></button>
                  <button onClick={() => onDelete(h.id)} className="w-8 h-8 rounded-lg bg-coral/10 text-coral flex items-center justify-center hover:bg-coral hover:text-white transition-colors" title="Delete"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg></button>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr><td colSpan={4} className="py-8 text-center text-text-muted text-sm">No listings found. Create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)};

const StatCard = ({ title, value, trend, alert }: { title: string; value: string; trend: string; alert?: boolean }) => (
  <div className="bg-white dark:bg-customDark p-6 rounded-2xl border-transparent border shadow-sm flex flex-col gap-1">
    <span className="text-xs font-normal text-gray-400 dark:text-gray-500 uppercase tracking-wide">{title}</span>
    <strong className="text-2xl font-black text-text-primary mt-1">{value}</strong>
    <span className={`text-xs font-medium ${alert ? "text-coral" : "text-emerald-600"}`}>{trend}</span>
  </div>
);

// ─── CreateEditListing ─────────────────────────────────────────────────────────

const CreateEditListing = ({ onBack, onSave, initialData }: { onBack: () => void; onSave: (data: ManagerPropertyForm) => void; initialData?: Partial<ManagerPropertyForm> }) => {
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [formData, setFormData] = useState<Partial<ManagerPropertyForm>>(initialData || {
    title: "",
    description: "",
    ghanaPostGPS: "",
    location: "",
    lat: undefined,
    lng: undefined,
    googleMapsUrl: "",
    ghanaPostUrl: "",
    resolvedAddress: "",
    nearestCampus: undefined,
    roomTypes: [{ id: "1", name: "", totalRooms: 0, occupantsPerRoom: 0, pricePerYear: 0 }],
    videoTour: "",
    amenities: { wifi: false, generator: false, water: false, ac: false, kitchen: false, studyRoom: false, security: false },
    policies: "",
  });

  const handleAmenitiesChange = (key: keyof ManagerPropertyForm["amenities"]) => {
    setFormData({ ...formData, amenities: { ...formData.amenities, [key]: !(formData.amenities as any)[key] } as any });
  };

  const handleNext = () => {
    if (step === 1 && !formData.title?.trim()) { alert("Title is required"); return; }
    setStep(step + 1);
  };

  // ─── GhanaPost GPS Verification + Auto Proximity ───────────────────────────
  // 1. POST to sperixlabs /get-location → real CenterLatitude / CenterLongitude
  // 2. Immediately compute nearest Ghanaian university using Haversine formula
  // 3. Auto-fill Location/Proximity field with the result
  // ──────────────────────────────────────────────────────────────────────────
  const handleVerifyGPS = async () => {
    if (!formData.ghanaPostGPS) return;
    setIsVerifying(true);

    let raw = formData.ghanaPostGPS.trim().toUpperCase();
    
    // If user forgot hyphens, strictly try to infer them based on 2-3 letter prefix
    if (!raw.includes("-")) {
      const match = raw.match(/^([A-Z]{2,3})(\d+)$/);
      if (match) {
        const prefix = match[1];
        const nums = match[2];
        const firstPartLen = Math.max(3, Math.floor(nums.length / 2));
        raw = `${prefix}-${nums.slice(0, firstPartLen)}-${nums.slice(firstPartLen)}`;
      }
    }

    // Ensure there are at least two hyphens to form a standard code for the API
    const parts = raw.split("-");
    if (parts.length < 3) {
      alert("Please ensure your GhanaPost GPS code includes hyphens (e.g., AZ-1234-1234, GA-123-4567).");
      setIsVerifying(false);
      return;
    }

    // Reconstruct the standard code without strict digit counts to allow flexibility
    const standardCode = parts.join("-");

    try {
      const apiBase =
        (import.meta as any).env?.VITE_GHANAPOST_API_URL?.replace(/\/$/, "") ||
        "https://ghanapostgps.sperixlabs.org";

      const body = new URLSearchParams();
      body.append("address", standardCode);

      const response = await fetch(`${apiBase}/get-location`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (!response.ok) throw new Error(`API responded with HTTP ${response.status}`);

      const result = await response.json();

      if (!result.found || !result.data?.Table?.[0]) {
        // Fallback: check if we know the prefix
        const prefix = parts[0];
        try {
            const { prefixToDistrictMap } = await import('../lib/ghanaPostGpsPrefixes');
            const match = prefixToDistrictMap[prefix];
            if (match) {
                const genericAddress = `${match.district}, ${match.region}`;
                setFormData(prev => ({
                    ...prev,
                    ghanaPostGPS: standardCode,
                    resolvedAddress: genericAddress,
                    location: prev.location?.trim() ? prev.location : genericAddress,
                }));
                alert(`Address "${standardCode}" not found precisely, but recognized prefix '${prefix}'. Generic location set to: ${genericAddress}`);
                setIsVerifying(false);
                return;
            }
        } catch (e) {
            console.error("Failed to load prefix map", e);
        }
        
        alert(`Address "${standardCode}" was not found in the GhanaPost database.\n\nPlease double-check the code.`);
        setIsVerifying(false);
        return;
      }

      const record = result.data.Table[0];
      const lat = parseFloat(record.CenterLatitude);
      const lng = parseFloat(record.CenterLongitude);
      if (isNaN(lat) || isNaN(lng)) throw new Error("API returned non-numeric coordinates.");

      const resolvedAddress = [record.Area, record.Street, record.District, record.Region]
        .filter(Boolean).join(", ");

      // ── Auto-compute nearest university ──────────────────────────────────
      const nearest = findNearestCampus(lat, lng);

      // Auto-fill the Location/Proximity field
      const autoProximity = `${distanceLabel(nearest.distanceM)} from ${nearest.shortName} (${nearest.walkLabel})`;

      setFormData(prev => ({
        ...prev,
        ghanaPostGPS: standardCode,
        lat,
        lng,
        googleMapsUrl: `https://www.google.com/maps?q=${lat},${lng}`,
        ghanaPostUrl: `https://www.ghanapostgps.com/map/#${raw}`,
        resolvedAddress,
        nearestCampus: nearest,
        // Only auto-fill proximity if the manager hasn't typed their own value
        location: prev.location?.trim() ? prev.location : autoProximity,
      }));

    } catch (err: any) {
      console.error("[handleVerifyGPS]", err);
      // Final Offline fallback
      try {
          const prefix = parts[0];
          const { prefixToDistrictMap } = await import('../lib/ghanaPostGpsPrefixes');
          const match = prefixToDistrictMap[prefix];
          if (match) {
              const genericAddress = `${match.district}, ${match.region}`;
              setFormData(prev => ({
                  ...prev,
                  ghanaPostGPS: standardCode,
                  resolvedAddress: genericAddress,
                  location: prev.location?.trim() ? prev.location : genericAddress,
              }));
              alert(`Network error, but offline map recognized prefix '${prefix}'. Generic location set to: ${genericAddress}`);
              return;
          }
      } catch(e) {}
      
      alert(
        "Could not reach the GhanaPost API.\n\nCheck your connection or VITE_GHANAPOST_API_URL.\n\nDetail: " +
        (err?.message ?? err)
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6 w-full mx-auto pb-20">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="text-text-muted hover:text-indigo"><ChevronLeft size={20} /></button>
        <h1 className=" text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Add New Listing</h1>
      </div>

      <div className="flex gap-2 mb-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`h-2 flex-1 rounded-full ${s <= step ? "bg-indigo" : "bg-gray-200 dark:bg-gray-700"}`} />
        ))}
      </div>

      <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); if (step < 4) { handleNext(); } else { onSave(formData as ManagerPropertyForm); } }}>

        {/* ── Step 1: Basic Information ─────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-white dark:bg-customDark p-6 rounded-2xl shadow-sm border-transparent border flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Basic Information</h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-base font-medium text-gray-900 dark:text-gray-200">Property Title *</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-customDark focus:border-indigo outline-none" placeholder="e.g. Pentagon Property" required />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-base font-medium text-gray-900 dark:text-gray-200">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-customDark focus:border-indigo outline-none h-24 resize-none" placeholder="Describe the atmosphere, community..." />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-base font-medium text-gray-900 dark:text-gray-200">GhanaPost GPS Address *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.ghanaPostGPS}
                  onChange={(e) => setFormData({ ...formData, ghanaPostGPS: e.target.value, lat: undefined, lng: undefined, resolvedAddress: "", nearestCampus: undefined })}
                  className="flex-1 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-customDark focus:border-indigo outline-none"
                  placeholder="e.g. GM-132-4567"
                  required
                />
                <button type="button" onClick={handleVerifyGPS} disabled={isVerifying || !formData.ghanaPostGPS} className="bg-indigo-light text-indigo font-bold px-4 rounded-xl text-sm whitespace-nowrap active:scale-95 disabled:opacity-50">
                  {isVerifying ? "Verifying…" : "Verify"}
                </button>
              </div>
            </div>

            {/* ── Map preview ─────────────────────────────────────────────── */}
            {formData.lat && formData.lng && (
              <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 h-[160px] relative animate-in fade-in">
                <iframe
                  src={`https://maps.google.com/maps?q=${formData.lat},${formData.lng}&z=16&output=embed`}
                  width="100%" height="100%" style={{ border: 0 }}
                  allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur text-xs px-3 py-2 rounded-lg font-medium text-emerald-700 shadow-sm flex items-center justify-between gap-2">
                  <span className="truncate flex items-center gap-1">
                    <CheckCircle2 size={12} className="shrink-0" />
                    {formData.resolvedAddress ? formData.resolvedAddress : "Address Verified"}
                  </span>
                </div>
              </div>
            )}

            {/* ── Nearest campus badge ────────────────────────────────────── */}
            {formData.nearestCampus && (
              <div className="flex items-start gap-3 bg-indigo/5 border border-indigo/20 rounded-xl px-4 py-3 animate-in fade-in">
                <Navigation size={16} className="text-indigo shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-bold text-indigo uppercase tracking-wide">Nearest Campus</span>
                  <span className="text-base font-medium text-gray-900 dark:text-gray-200 truncate">{formData.nearestCampus.name}</span>
                  <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
                    {distanceLabel(formData.nearestCampus.distanceM)} away · {formData.nearestCampus.walkLabel}
                  </span>
                </div>
              </div>
            )}

            {/* ── Location / Proximity (auto-filled, editable) ────────────── */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-base font-medium text-gray-900 dark:text-gray-200">Location / Proximity</label>
                {formData.nearestCampus && (
                  <span className="text-xs text-indigo font-medium flex items-center gap-1">
                    <MapPin size={10} /> Auto-filled from GPS
                  </span>
                )}
              </div>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-customDark focus:border-indigo outline-none"
                placeholder="e.g. 5 mins walk from Main Gate"
              />
              {formData.nearestCampus && (
                <p className="text-xs font-normal text-gray-400 dark:text-gray-500">
                  Auto-computed from your verified GPS address. You can edit this freely.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Step 2: Room & Pricing ──────────────────────────────────────── */}
        {step === 2 && (
          <div className="bg-white dark:bg-customDark p-6 rounded-2xl shadow-sm border-transparent border flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Room & Pricing Configuration</h2>
            <p className="text-xs font-normal text-gray-400 dark:text-gray-500">Add the different types of rooms available.</p>
            {formData.roomTypes?.map((room, index) => (
              <div key={room.id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 bg-white dark:bg-customDark relative">
                {formData.roomTypes!.length > 1 && (
                  <button type="button" onClick={() => setFormData({ ...formData, roomTypes: formData.roomTypes?.filter((_, i) => i !== index) })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X size={12} /></button>
                )}
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-normal text-gray-500 dark:text-gray-400">Room Name</label>
                    <input type="text" value={room.name} onChange={(e) => { const nr = [...formData.roomTypes!]; nr[index].name = e.target.value; setFormData({ ...formData, roomTypes: nr }); }} placeholder="e.g. 2 in a room" className="w-full border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2 text-sm bg-white" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-normal text-gray-500 dark:text-gray-400">Total Rooms</label>
                    <input type="number" value={room.totalRooms || ""} onChange={(e) => { const nr = [...formData.roomTypes!]; nr[index].totalRooms = Number(e.target.value); setFormData({ ...formData, roomTypes: nr }); }} placeholder="10" className="w-full border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2 text-sm bg-white" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-normal text-gray-500 dark:text-gray-400">Occupants per rm.</label>
                    <input type="number" value={room.occupantsPerRoom || ""} onChange={(e) => { const nr = [...formData.roomTypes!]; nr[index].occupantsPerRoom = Number(e.target.value); setFormData({ ...formData, roomTypes: nr }); }} placeholder="2" className="w-full border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2 text-sm bg-white" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-normal text-gray-500 dark:text-gray-400">Price (per Sem)</label>
                    <input type="number" value={room.pricePerYear || ""} onChange={(e) => { const nr = [...formData.roomTypes!]; nr[index].pricePerYear = Number(e.target.value); setFormData({ ...formData, roomTypes: nr }); }} placeholder="4500" className="w-full border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2 text-sm bg-white" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-normal text-gray-500 dark:text-gray-400">Room Image *</label>
                    <div className="relative border-2 border-dashed border-indigo-light bg-white dark:bg-customDark rounded-xl h-24 flex flex-col items-center justify-center text-text-muted gap-1 cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden">
                      {room.imageUrlPreview ? <img src={room.imageUrlPreview} alt="Room" className="w-full h-full object-cover" /> : <><UploadCloud size={18} className="text-indigo" /><span className="text-xs">Upload Room Image</span></>}
                      <input type="file" accept="image/*" title="Room Image" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { if (e.target.files?.[0]) { const f = e.target.files[0]; const nr = [...formData.roomTypes!]; nr[index].imageFile = f; nr[index].imageUrlPreview = URL.createObjectURL(f); setFormData({ ...formData, roomTypes: nr }); } }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setFormData({ ...formData, roomTypes: [...formData.roomTypes!, { id: Math.random().toString(), name: "", totalRooms: 0, occupantsPerRoom: 0, pricePerYear: 0 }] })} className="text-sm font-bold text-indigo flex items-center gap-1 active:scale-95 self-start">
              <Plus size={16} /> Add Room Type
            </button>
          </div>
        )}

        {/* ── Step 3: Media ───────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="bg-white dark:bg-customDark p-6 rounded-2xl shadow-sm border-transparent border flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Media Uploads</h2>
            <div className="flex flex-col gap-1.5">
              <label className="text-base font-medium text-gray-900 dark:text-gray-200">Compound Image *</label>
              <div className="relative border-2 border-dashed border-indigo-light bg-white dark:bg-customDark rounded-xl h-32 flex flex-col items-center justify-center text-text-muted gap-2 cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden">
                {formData.compoundImagePreview ? <img src={formData.compoundImagePreview} alt="Compound" className="w-full h-full object-cover" /> : <><UploadCloud size={24} className="text-indigo" /><span className="text-sm">Upload Compound Image</span></>}
                <input type="file" accept="image/*" title="Compound Image" required className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { if (e.target.files?.[0]) { const f = e.target.files[0]; setFormData({ ...formData, compoundImageFile: f, compoundImagePreview: URL.createObjectURL(f) }); } }} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-base font-medium text-gray-900 dark:text-gray-200">360 Virtual Tour Image (Optional)</label>
              <div className="relative border-2 border-dashed border-indigo-light bg-white dark:bg-customDark rounded-xl h-32 flex flex-col items-center justify-center text-text-muted gap-2 cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden">
                {formData.image360Preview ? <img src={formData.image360Preview} alt="360 Tour" className="w-full h-full object-cover" /> : <><UploadCloud size={24} className="text-indigo" /><span className="text-sm">Upload 360 Panorama</span></>}
                <input type="file" accept="image/*" title="360 Image" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { if (e.target.files?.[0]) { const f = e.target.files[0]; setFormData({ ...formData, image360File: f, image360Preview: URL.createObjectURL(f) }); } }} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-base font-medium text-gray-900 dark:text-gray-200">Video Tour (YouTube/Vimeo URL) (Optional)</label>
              <input type="url" value={formData.videoTour || ""} onChange={(e) => setFormData({ ...formData, videoTour: e.target.value })} className="w-full border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-customDark focus:border-indigo outline-none" placeholder="https://..." />
            </div>
          </div>
        )}

        {/* ── Step 4: Amenities & Policies ───────────────────────────────── */}
        {step === 4 && (
          <div className="bg-white dark:bg-customDark p-6 rounded-2xl shadow-sm border-transparent border flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Amenities & Policies</h2>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-base font-medium text-gray-900 dark:text-gray-200 mb-1">Select Available Facilities</label>
              <div className="grid grid-cols-2 gap-3">
                {["wifi", "generator", "water", "ac", "kitchen", "studyRoom", "security"].map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm cursor-pointer border border-gray-100 dark:border-gray-800 rounded-lg p-3 hover:bg-white dark:bg-customDark transition-colors">
                    <input type="checkbox" checked={(formData.amenities as any)[item]} onChange={() => handleAmenitiesChange(item as keyof ManagerPropertyForm["amenities"])} className="w-4 h-4 rounded text-indigo focus:ring-indigo" />
                    <span className="capitalize text-text-primary">{item.replace(/([A-Z])/g, " $1").trim()}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-base font-medium text-gray-900 dark:text-gray-200">Policies & Rules</label>
              <textarea value={formData.policies} onChange={(e) => setFormData({ ...formData, policies: e.target.value })} className="w-full border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-customDark focus:border-indigo outline-none h-24 resize-none" placeholder="Guest policies, curfew timings..." />
            </div>
          </div>
        )}

        {/* ── Navigation ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-4 pb-12">
          <button type="button" onClick={() => (step > 1 ? setStep(step - 1) : onBack())} className="px-5 py-2.5 text-sm font-bold text-text-muted hover:text-text-primary">
            {step === 1 ? "Cancel" : "Back"}
          </button>
          {step < 4 ? (
            <button type="button" onClick={handleNext} className="bg-indigo text-white font-bold px-8 py-2.5 rounded-xl shadow-sm hover:bg-indigo/90 active:scale-95 transition-all">Next</button>
          ) : (
            <button type="submit" className="bg-emerald-600 text-white font-bold px-8 py-2.5 rounded-xl shadow-sm hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2">
              Publish <CheckCircle2 size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};