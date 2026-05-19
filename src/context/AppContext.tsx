import React, { createContext, useContext, useState, ReactNode } from 'react';
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
