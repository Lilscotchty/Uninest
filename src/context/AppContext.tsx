import { supabase } from "../lib/supabase";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppState, ViewState, Hostel } from '../types';
import { HOSTELS as INITIAL_HOSTELS } from '../data';

interface AppContextType extends AppState, ViewState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  hostels: Hostel[];
  addCustomHostel: (hostel: Hostel) => void;
  updateCustomHostel: (id: number, updates: Partial<Hostel>) => void;
  toggleSave: (id: number) => void;
  setActiveFilter: (filter: string) => void;
  exploreSearchQuery: string;
  setExploreSearchQuery: (query: string) => void;
  setCurrentView: (view: 'home' | 'explore' | 'details' | 'saved' | 'profile' | 'signup' | 'virtual-tour' | 'price-alerts' | 'manager-dashboard') => void;
  setSelectedHostelId: (id: number | null) => void;
  toastMessage: string | null;
  clearToast: () => void;
  showToast: (msg: string) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  exitFullscreen: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hostels, setHostels] = useState<Hostel[]>(INITIAL_HOSTELS);
  const [savedHostels, setSavedHostels] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [exploreSearchQuery, setExploreSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'explore' | 'details' | 'saved' | 'profile' | 'signup' | 'virtual-tour' | 'price-alerts' | 'manager-dashboard'>('home');
  const [selectedHostelId, setSelectedHostelId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const { data, error } = await supabase.from("hostels").select("*, rooms(*)");
        if (error) throw error;
        
        if (data && data.length > 0) {
          const dbHostels = data.map(h => ({
            id: Math.random().toString(36).substr(2, 9), // Keep ID format mixed or cast, ideally keep original id
            name: h.name,
            loc: h.location || h.digital_address || "Accra",
            lat: 5.6000 + (h.name.length * 0.001), // mock lat
            lng: -0.1900 + (h.name.length * 0.001), // mock lng
            price: h.rooms && h.rooms.length > 0 ? `GH₵${h.rooms[0].price}` : "GH₵5,000",
            priceNum: h.rooms && h.rooms.length > 0 ? h.rooms[0].price : 5000,
            rating: 0.0,
            reviews: 0,
            tags: h.amenities ? h.amenities.slice(0, 3) : [],
            category: "standard",
            avail: "Available",
            img: h.image_url || "https://loremflickr.com/600/400/bedroom?lock=305",
            desc: h.description,
            dbId: h.id
          }));
          
          setHostels(prev => [...prev.filter(p => !dbHostels.find(d => d.name === p.name)), ...dbHostels]);
        }
      } catch (err) {
        console.error("Error fetching hostels:", err);
      }
    };
    
    fetchHostels();
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

  const addCustomHostel = (hostel: Hostel) => setHostels(prev => [...prev, hostel]);
  const updateCustomHostel = (id: number, updates: Partial<Hostel>) => {
    setHostels(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };
  
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const toggleSave = (id: number) => {
    setSavedHostels((prev) =>
      prev.includes(id) ? prev.filter((hostelId) => hostelId !== id) : [...prev, id]
    );
  };

  const clearToast = () => setToastMessage(null);
  const showToast = (msg: string) => setToastMessage(msg);

  return (
    <AppContext.Provider
      value={{
        hostels,
        addCustomHostel,
        updateCustomHostel,
        savedHostels,
        activeFilter,
        exploreSearchQuery,
        setExploreSearchQuery,
        currentView,
        selectedHostelId,
        toggleSave,
        setActiveFilter,
        setCurrentView,
        setSelectedHostelId,
        toastMessage,
        clearToast,
        showToast,
        theme,
        toggleTheme,
        isFullscreen,
        toggleFullscreen,
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
