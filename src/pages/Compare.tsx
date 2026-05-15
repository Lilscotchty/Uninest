import React, { useState } from 'react';
import { ChevronLeft, Scale, Plus, Star, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { HOSTELS } from '../data';

export const Compare: React.FC = () => {
  const { setCurrentView, showToast } = useAppContext();
  
  // Start with first two hostels
  const [comparing, setComparing] = useState([HOSTELS[0], HOSTELS[1]]);

  return (
    <div className="w-full h-full bg-app-bg flex flex-col font-sans relative">
      <div className="bg-card-bg h-[60px] flex items-center px-4 border-b border-border-subtle shrink-0">
        <button 
          onClick={() => setCurrentView('home')}
          className="w-10 h-10 flex items-center justify-center text-text-primary rounded-full hover:bg-app-bg transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 text-center pr-10 text-[17px] font-semibold text-text-primary">
          Compare Mode
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <div className="text-center px-5 py-6">
          <div className="w-16 h-16 bg-indigo-light text-indigo rounded-[20px] flex items-center justify-center mx-auto mb-4">
            <Scale size={32} />
          </div>
          <h2 className="font-fraunces text-[1.5rem] font-bold text-text-primary mb-2">Side-by-Side</h2>
          <p className="text-[0.9rem] text-text-muted">Compare features, prices, and locations to find your best match.</p>
        </div>

        <div className="flex w-full min-w-max border-y border-border-subtle bg-card-bg">
          {comparing.map((hostel, i) => (
            <div key={hostel.id} className={`flex-1 min-w-[160px] max-w-[200px] p-4 ${i === 0 ? 'border-r border-border-subtle' : ''}`}>
              <div className="w-full h-[100px] rounded-xl overflow-hidden mb-3 relative">
                <img src={hostel.img} alt={hostel.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => showToast('Swap feature coming soon')}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14h6v6"></path><path d="M20 10h-6V4"></path><path d="M14 10l7-7"></path><path d="M3 21l7-7"></path></svg>
                </button>
              </div>
              <h3 className="font-fraunces text-[0.95rem] font-bold text-text-primary line-clamp-1">{hostel.name}</h3>
              <div className="flex items-center text-[0.8rem] text-text-muted mt-1 gap-1">
                <Star size={12} className="text-amber-400 fill-amber-400" /> {hostel.rating}
              </div>
            </div>
          ))}
          {comparing.length < 3 && (
            <div className="w-[80px] flex items-center justify-center p-4 border-l border-border-subtle bg-app-bg" onClick={() => showToast('Limit reached for mobile view')}>
               <div className="w-10 h-10 rounded-full bg-card-bg border border-dashed border-border-subtle flex items-center justify-center text-text-muted cursor-pointer active:scale-95">
                  <Plus size={20} />
               </div>
            </div>
          )}
        </div>

        <div className="flex flex-col tracking-tight">
          {/* Price Category */}
          <div className="px-5 py-3 bg-app-bg text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Price / Sem</div>
          <div className="flex border-y border-border-subtle bg-card-bg">
            {comparing.map((h, i) => (
              <div key={h.id} className={`flex-1 p-4 font-fraunces text-[1.1rem] font-bold text-text-primary ${i === 0 ? 'border-r border-border-subtle' : ''}`}>
                {h.price}
              </div>
            ))}
          </div>

          {/* Location Category */}
          <div className="px-5 py-3 bg-app-bg text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Distance</div>
          <div className="flex border-y border-border-subtle bg-card-bg">
            {comparing.map((h, i) => (
              <div key={h.id} className={`flex-1 p-4 text-[0.85rem] font-medium text-text-muted flex items-start gap-1.5 ${i === 0 ? 'border-r border-border-subtle' : ''}`}>
                <MapPin size={14} className="text-indigo shrink-0 mt-0.5" />
                <span className="line-clamp-2">{h.loc}</span>
              </div>
            ))}
          </div>

          {/* Tags Category */}
          <div className="px-5 py-3 bg-app-bg text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Features</div>
          <div className="flex border-y border-border-subtle bg-card-bg mb-10">
            {comparing.map((h, i) => (
              <div key={h.id} className={`flex-1 p-4 flex flex-col gap-2 ${i === 0 ? 'border-r border-border-subtle' : ''}`}>
                {h.tags.map(t => (
                  <div key={t} className="bg-indigo-light/20 text-indigo text-[0.75rem] font-bold px-2 py-1 rounded-md self-start">
                    {t === 'wifi' ? 'Wi-Fi' : t === 'sec' ? 'Security' : t === 'gen' ? 'Backup Gen' : t}
                  </div>
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
