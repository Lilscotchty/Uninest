import React, { useState } from 'react';
import { MapPin, Target, X } from 'lucide-react';
import type { StudentLocation } from '../../types/opportunities';

interface LocationInputModalProps {
  onSave: (location: StudentLocation) => void;
  onDismiss: () => void;
}

export const LocationInputModal: React.FC<LocationInputModalProps> = ({ onSave, onDismiss }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setError('Please enter a location');
      return;
    }

    const isGps = /^[A-Za-z]{2}-\d{3,4}-\d{4}$/.test(inputValue.trim());
    
    // Simulate geocoding for now. We assign Accra for testing purposes.
    const resolvedCity = isGps ? 'Accra' : inputValue.trim().split(',')[0];
    
    const location: StudentLocation = {
      type: isGps ? 'gps' : 'community',
      value: inputValue.trim(),
      resolvedCity,
      resolvedLat: 5.6037, // default to Accra roughly
      resolvedLng: -0.187,
      savedAt: new Date().toISOString(),
    };
    
    onSave(location);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card-bg w-full max-w-sm rounded-[24px] overflow-hidden shadow-float animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 relative">
          <button 
            onClick={onDismiss}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-app-bg text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={18} />
          </button>
          
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Target size={24} />
          </div>
          
          <h2 className="text-xl font-bold text-text-primary tracking-tight mb-2">Where are you located?</h2>
          <p className="text-[0.85rem] text-text-muted mb-6 leading-relaxed">
            Enter your Ghana Post GPS address or community name to find relevant companies near you. 
            <span className="block mt-1 opacity-80 italic">Used only to find nearby companies. Stored on your device.</span>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="relative mb-2">
              <MapPin size={18} className="absolute left-4 top-[14px] text-text-muted" />
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError('');
                }}
                placeholder="e.g. GM-123-1234 or Madina" 
                className="w-full pl-11 pr-4 py-3.5 bg-app-bg border border-border-subtle rounded-xl text-[0.95rem] font-medium placeholder:text-text-muted focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
            {error && <p className="text-red-500 text-[0.75rem] font-medium ml-1 mb-2">{error}</p>}
            
            <button 
              type="submit"
              className="w-full mt-4 bg-slate-900 hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm active:scale-[0.98]"
            >
              Find Opportunities
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
