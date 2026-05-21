import React, { useState } from 'react';
import { ChevronLeft, Video, Play, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { HOSTELS } from '../data';
import { PageHeader } from '../components/PageHeader';

export const VirtualTour: React.FC = () => {
  const { setCurrentView, showToast, hostels } = useAppContext();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const featuredTours = hostels.slice(0, 3);

  return (
    <div className="w-full h-full bg-app-bg flex flex-col font-sans relative">
      <PageHeader 
        title="Virtual Tours"
        rightAction={
          <button 
            onClick={() => setCurrentView('home')}
            className="text-white hover:text-indigo-200 transition-colors"
          >
            <ChevronLeft size={24} /> Back
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-light text-amber-500 rounded-[20px] flex items-center justify-center mx-auto mb-4">
            <Video size={32} />
          </div>
          <h2 className="font-montserrat text-[1.5rem] font-bold text-text-primary mb-2">Explore Look-Alikes</h2>
          <p className="text-[0.9rem] text-text-muted">Experience 360° tours and video walkthroughs of top-rated student hostels before making a decision.</p>
        </div>

        <div className="flex flex-col gap-4">
          {featuredTours.map((hostel) => (
            <div key={hostel.id} className="bg-card-bg rounded-[20px] overflow-hidden border-transparent border shadow-sm flex flex-col cursor-pointer group" onClick={() => setSelectedVideo(hostel.img)}>
              <div className="relative h-[200px] w-full">
                <img src={hostel.img} alt={hostel.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center text-white pl-1">
                    <Play size={24} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 bg-indigo text-white text-[0.7rem] font-bold px-2 py-1 rounded-md uppercase">
                  Featured
                </div>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <h3 className="font-fraunces text-[1.1rem] font-bold text-text-primary">{hostel.name}</h3>
                <div className="flex items-center text-[0.8rem] text-text-muted gap-1">
                  <MapPin size={12} className="text-amber-500" /> {hostel.loc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedVideo && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col">
          <div className="p-4 flex justify-end">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
             {/* Fake video player using the image placeholder */}
             <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center border border-white/10">
                <img src={selectedVideo} className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm" alt="Blurred bg" />
                <div className="relative text-white font-bold tracking-widest uppercase text-xl animate-pulse">Playing Video...</div>
             </div>
          </div>
          <div className="p-6 text-center">
            <button 
              onClick={() => { setSelectedVideo(null); setCurrentView('details'); }}
              className="bg-amber-glow text-white font-bold py-4 px-8 rounded-xl w-full max-w-[300px] active:scale-95 transition-transform"
            >
              Book this room
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
