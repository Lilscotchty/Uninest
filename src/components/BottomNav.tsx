import React from 'react';
import { Home, Search, Bookmark, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentView, setCurrentView, showToast } = useAppContext();

  return (
    <div className="absolute bottom-0 w-full bg-card-bg flex justify-around py-3 pb-6 border-t border-border-subtle shadow-[0_-4px_20px_rgba(55,48,163,0.06)] z-50">
      <button 
        onClick={() => setCurrentView('home')}
        className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'home' ? 'text-indigo' : 'text-gray-400'}`}
      >
        <Home size={22} className={currentView === 'home' ? 'text-indigo' : ''} />
        <span className="text-[0.7rem] font-semibold">Home</span>
        <div className={`w-1 h-1 rounded-full bg-indigo mt-0.5 transition-opacity ${currentView === 'home' ? 'opacity-100' : 'opacity-0'}`}></div>
      </button>
      
      <button 
        onClick={() => { setCurrentView('explore'); showToast('Explore map opening...'); }}
        className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'explore' ? 'text-indigo' : 'text-gray-400'}`}
      >
        <Search size={22} className={currentView === 'explore' ? 'text-indigo' : ''} />
        <span className="text-[0.7rem] font-semibold">Explore</span>
        <div className={`w-1 h-1 rounded-full bg-indigo mt-0.5 transition-opacity ${currentView === 'explore' ? 'opacity-100' : 'opacity-0'}`}></div>
      </button>
      
      <button 
        onClick={() => setCurrentView('saved')}
        className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'saved' ? 'text-indigo' : 'text-gray-400'}`}
      >
        <Bookmark size={22} className={currentView === 'saved' ? 'text-indigo' : ''} />
        <span className="text-[0.7rem] font-semibold">Saved</span>
        <div className={`w-1 h-1 rounded-full bg-indigo mt-0.5 transition-opacity ${currentView === 'saved' ? 'opacity-100' : 'opacity-0'}`}></div>
      </button>
      
      <button 
        onClick={() => setCurrentView('profile')}
        className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'profile' ? 'text-indigo' : 'text-gray-400'}`}
      >
        <User size={22} className={currentView === 'profile' ? 'text-indigo' : ''} />
        <span className="text-[0.7rem] font-semibold">Profile</span>
        <div className={`w-1 h-1 rounded-full bg-indigo mt-0.5 transition-opacity ${currentView === 'profile' ? 'opacity-100' : 'opacity-0'}`}></div>
      </button>
    </div>
  );
};
