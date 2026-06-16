import { supabase } from "../lib/supabase";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppState, ViewState, Property } from '../types';
import { PROPERTIES as INITIAL_PROPERTIES } from '../data';
import type { UserProfile, UserRole } from '../types/roles';
import { isOwner } from '../types/roles';

interface AppContextType extends AppState, ViewState {
  properties: Property[];
  addCustomProperty: (property: Property) => void;
  updateCustomProperty: (id: number | string, updates: Partial<Property>) => void;
  removeCustomProperty: (id: number | string) => void;
  toggleSave: (id: number | string) => void;
  setActiveFilter: (filter: string) => void;
  exploreSearchQuery: string;
  setExploreSearchQuery: (query: string) => void;
  setCurrentView: (view: 'home' | 'explore' | 'details' | 'saved' | 'profile' | 'signup' | 'virtual-tour' | 'price-alerts' | 'manager-dashboard') => void;
  setSelectedPropertyId: (id: number | string | null) => void;
  toastMessage: string | null;
  clearToast: () => void;
  showToast: (msg: string) => void;
  isFullscreen: boolean;
  user: any;
  toggleFullscreen: () => void;
  exitFullscreen: () => void;
  
  // Payment & Referral additions
  hasPaidOpportunityHub: boolean;
  setHasPaidOpportunityHub: (val: boolean) => void;
  earnedCredits: number;
  setEarnedCredits: React.Dispatch<React.SetStateAction<number>>;
  earnedCash: number;
  setEarnedCash: React.Dispatch<React.SetStateAction<number>>;
  referralCode: string;
  referees: { name: string; status: string; date: string; amount?: number }[];
  
  // Auth additions
  profile: UserProfile | null;
  profileLoading: boolean;
  updateRole: (role: UserRole, ownerType?: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  isOwner: boolean;
  isStudent: boolean;
  isAccommodationOwner: boolean;
  isPropertyOwnerUser: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [savedProperties, setSavedProperties] = useState<(number | string)[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [exploreSearchQuery, setExploreSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'explore' | 'details' | 'saved' | 'profile' | 'signup' | 'virtual-tour' | 'price-alerts' | 'manager-dashboard'>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [user, setUser] = useState<any | null | undefined>(undefined);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Payment & Referral states
  const [hasPaidOpportunityHub, setHasPaidOpportunityHubState] = useState(false);
  const [earnedCredits, setEarnedCredits] = useState(0);
  const [earnedCash, setEarnedCash] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [referees, setReferees] = useState<{ name: string; status: string; date: string; amount?: number }[]>([]);

  const setHasPaidOpportunityHub = (val: boolean) => {
    setHasPaidOpportunityHubState(val);
    if (user) {
      localStorage.setItem(`paid_opp_hub_${user.id}`, val ? 'true' : 'false');
    }
  };

  const fetchProfile = async (userId: string) => {
    setProfileLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error && data) setProfile(data as UserProfile);
    setProfileLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        const code = session.user.id.substring(0, 8).toUpperCase();
        setHasPaidOpportunityHubState(localStorage.getItem(`paid_opp_hub_${session.user.id}`) === 'true');
        setReferralCode(code);
        setEarnedCredits(Number(localStorage.getItem(`credits_${session.user.id}`) || '0'));
        setEarnedCash(
          Number(localStorage.getItem(`cash_${session.user.id}`) || '0') +
          Number(localStorage.getItem(`cash_by_code_${code}`) || '0')
        );
        let baselineRefs: any[] = [];
        let codeRefs: any[] = [];
        try {
          const v1 = localStorage.getItem(`referees_${session.user.id}`);
          if (v1 && v1 !== 'undefined') {
            const parsed = JSON.parse(v1);
            if (Array.isArray(parsed)) baselineRefs = parsed;
          }
        } catch(e) {}
        try {
          const v2 = localStorage.getItem(`referees_by_code_${code}`);
          if (v2 && v2 !== 'undefined') {
            const parsed = JSON.parse(v2);
            if (Array.isArray(parsed)) codeRefs = parsed;
          }
        } catch(e) {}
        
        const uniqueRefs = [...baselineRefs, ...codeRefs].filter((value, index, self) =>
           index === self.findIndex((t) => t?.name === value?.name)
        );
        setReferees(uniqueRefs);
      }
      else setProfileLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        const code = session.user.id.substring(0, 8).toUpperCase();
        setHasPaidOpportunityHubState(localStorage.getItem(`paid_opp_hub_${session.user.id}`) === 'true');
        setReferralCode(code);
        setEarnedCredits(Number(localStorage.getItem(`credits_${session.user.id}`) || '0'));
        setEarnedCash(
          Number(localStorage.getItem(`cash_${session.user.id}`) || '0') +
          Number(localStorage.getItem(`cash_by_code_${code}`) || '0')
        );
        let baselineRefs: any[] = [];
        let codeRefs: any[] = [];
        try {
          const v1 = localStorage.getItem(`referees_${session.user.id}`);
          if (v1 && v1 !== 'undefined') {
            const parsed = JSON.parse(v1);
            if (Array.isArray(parsed)) baselineRefs = parsed;
          }
        } catch(e) {}
        try {
          const v2 = localStorage.getItem(`referees_by_code_${code}`);
          if (v2 && v2 !== 'undefined') {
            const parsed = JSON.parse(v2);
            if (Array.isArray(parsed)) codeRefs = parsed;
          }
        } catch(e) {}

        const uniqueRefs = [...baselineRefs, ...codeRefs].filter((value, index, self) =>
           index === self.findIndex((t) => t?.name === value?.name)
        );
        setReferees(uniqueRefs);
      }
      else {
        setProfile(null);
        setProfileLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync earned credits/cash with local storage manually for mock
  useEffect(() => {
    if (user) {
      localStorage.setItem(`credits_${user.id}`, earnedCredits.toString());
      localStorage.setItem(`cash_${user.id}`, earnedCash.toString());
      localStorage.setItem(`referees_${user.id}`, JSON.stringify(referees));
    }
  }, [earnedCredits, earnedCash, referees, user]);

  const updateRole = async (role: UserRole, ownerType?: string) => {
    if (!user) return;
    const update: Partial<UserProfile> = {
      role,
      owner_type: ownerType as UserProfile['owner_type'] ?? null,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from('profiles')
      .update(update)
      .eq('id', user.id);
    if (error) throw error;
    setProfile(prev => prev ? { ...prev, ...update } as UserProfile : null);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  const isOwnerUser = isOwner(profile?.role);
  const isStudentUser = profile?.role === 'student';
  const isAccommodationOwner = profile?.role === 'accommodation_owner';
  const isPropertyOwnerUser = profile?.role === 'property_owner';

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase.from("hostels").select("*, rooms(*)");
        if (error) throw error;
        
        if (data && data.length > 0) {
          const dbProperties = data.map(h => ({
            id: h.id, 
            name: h.name,
            loc: h.location || h.digital_address || "Accra",
            lat: h.lat || (5.6000 + (h.name.length * 0.001)),
            lng: h.lng || (-0.1900 + (h.name.length * 0.001)),
            panoramas: h.image_360_url ? [h.image_360_url] : [],
            images: [h.image_url, ...(h.rooms?.map((r: any) => r.image_url).filter(Boolean) || [])],
            amenities: h.amenities || [],
            policies: h.policies || "",
            rooms: h.rooms || [],
            videoTour: h.video_url,
            price: h.rooms && h.rooms.length > 0 ? `GH₵${h.rooms[0].price}` : "GH₵5,000",
            priceNum: h.rooms && h.rooms.length > 0 ? h.rooms[0].price : 5000,
            pricing_tag: h.rooms && h.rooms.length > 0 && h.rooms[0].pricing_tag ? h.rooms[0].pricing_tag : '/sem',
            rating: 0.0,
            reviews: 0,
            tags: h.amenities ? h.amenities.slice(0, 3) : [],
            category: "standard",
            avail: "Available",
            img: h.image_url || "https://loremflickr.com/600/400/bedroom?lock=305",
            desc: h.description,
            dbId: h.id,
            manager_id: h.manager_id
          }));
          
          setProperties(prev => [...prev.filter(p => !dbProperties.find(d => d.name === p.name)), ...dbProperties]);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    };
    
    fetchProperties();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Auto fullscreen on first interaction
    const firstInteraction = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
      document.removeEventListener('click', firstInteraction);
      document.removeEventListener('touchstart', firstInteraction);
    };

    document.addEventListener('click', firstInteraction);
    document.addEventListener('touchstart', firstInteraction);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('click', firstInteraction);
      document.removeEventListener('touchstart', firstInteraction);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.warn(err));
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const addCustomProperty = (property: Property) => setProperties(prev => [...prev, property]);
  const updateCustomProperty = (id: number | string, updates: Partial<Property>) => {
    setProperties(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };
  const removeCustomProperty = (id: number | string) => {
    setProperties(prev => prev.filter(h => h.id !== id && h.dbId !== id));
  };

  const toggleSave = (id: number | string) => {
    setSavedProperties((prev) =>
      prev.includes(id) ? prev.filter((propertyId) => propertyId !== id) : [...prev, id]
    );
  };

  const clearToast = () => setToastMessage(null);
  const showToast = (msg: string) => setToastMessage(msg);

  return (
    <AppContext.Provider
      value={{
        properties,
        addCustomProperty,
        updateCustomProperty,
        removeCustomProperty,
        savedProperties,
        activeFilter,
        exploreSearchQuery,
        setExploreSearchQuery,
        currentView,
        selectedPropertyId,
        toggleSave,
        setActiveFilter,
        setCurrentView,
        setSelectedPropertyId,
        toastMessage,
        clearToast,
        showToast,
        isFullscreen,
        toggleFullscreen,
        user,
        exitFullscreen,
        profile,
        profileLoading,
        updateRole,
        refreshProfile,
        isOwner: isOwnerUser,
        isStudent: isStudentUser,
        isAccommodationOwner,
        isPropertyOwnerUser,
        isSidebarOpen,
        toggleSidebar,
        hasPaidOpportunityHub,
        setHasPaidOpportunityHub,
        earnedCredits,
        setEarnedCredits,
        earnedCash,
        setEarnedCash,
        referralCode,
        referees,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
