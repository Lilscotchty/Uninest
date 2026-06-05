import { supabase } from "../lib/supabase";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppState, ViewState, Property } from '../types';
import { PROPERTIES as INITIAL_PROPERTIES } from '../data';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [user, setUser] = useState<any | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
