import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, ViewState } from '../types';

interface AppContextType extends AppState, ViewState {
  deductCredits: (amount: number) => boolean;
  toggleSave: (id: number) => void;
  setActiveFilter: (filter: string) => void;
  setCurrentView: (view: 'home' | 'explore' | 'details' | 'saved' | 'profile' | 'signup') => void;
  setSelectedHostelId: (id: number | null) => void;
  toastMessage: string | null;
  clearToast: () => void;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [credits, setCredits] = useState(500);
  const [savedHostels, setSavedHostels] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentView, setCurrentView] = useState<'home' | 'explore' | 'details' | 'saved' | 'profile' | 'signup'>('home');
  const [selectedHostelId, setSelectedHostelId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const deductCredits = (amount: number) => {
    if (credits - amount < 0) {
      setToastMessage('Insufficient credits!');
      return false;
    }
    setCredits((prev) => prev - amount);
    return true;
  };

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
        credits,
        savedHostels,
        activeFilter,
        currentView,
        selectedHostelId,
        deductCredits,
        toggleSave,
        setActiveFilter,
        setCurrentView,
        setSelectedHostelId,
        toastMessage,
        clearToast,
        showToast,
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
