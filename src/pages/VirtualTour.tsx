import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { ChevronLeft, Video, Play, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PROPERTIES } from '../data';
import { PageHeader } from '../components/PageHeader';
import { BlazingRifts } from '../components/BlazingRifts';

export const VirtualTour: React.FC = () => {
  const { setCurrentView, showToast, properties } = useAppContext();
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const featuredTours = properties.slice(0, 3);

  return (
    <div className="w-full flex-1 min-h-0 bg-app-bg flex flex-col font-sans relative">
      <PageHeader 
        title="Virtual Tours"
        rightAction={
          <button 
            onClick={() => navigate("/student/dashboard")}
            className="text-white hover:text-[var(--color-accent)]-200 transition-colors"
          >
            <ChevronLeft size={24} /> Back
          </button>
        }
      />

      <div className="flex-1 w-full overflow-y-auto">
        <div className="max-w-screen-xl mx-auto px-5 py-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-light text-amber-500 rounded-[20px] flex items-center justify-center mx-auto mb-4">
              <Video size={32} />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Explore Look-Alikes</h2>
            <p className="text-sm text-text-muted">Experience video walkthroughs of top-rated student properties before making a decision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTours.map((property) => (
              <div key={property.id} className="bg-card-bg rounded-[20px] overflow-hidden border-zinc-100 border transition-all shadow-sm flex flex-col cursor-pointer hover:-translate-y-1 hover:shadow-md group" onClick={() => setSelectedVideo(property.img)}>
                <div className="relative h-[200px] w-full">
                  <img src={property.img} alt={property.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-[var(--color-button-hover)]/20 transition-colors">
                    <div className="w-14 h-14 bg-[var(--color-surface)]/20 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center text-white pl-1">
                      <Play size={24} fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-[var(--color-button)] text-white text-[0.7rem] font-bold px-2 py-1 rounded-md uppercase">
                    Featured
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-text-primary">{property.name}</h3>
                  <div className="flex items-center text-[0.8rem] text-text-muted gap-1">
                    <MapPin size={12} className="text-amber-500" /> {property.loc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedVideo && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col">
          <div className="p-4 flex justify-end">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="w-10 h-10 bg-[var(--color-surface)]/10 rounded-full flex items-center justify-center text-white hover:bg-[var(--color-surface)]/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
             <div className="relative w-full aspect-video rounded-lg overflow-hidden flex items-center justify-center border border-white/10 group">
                {selectedVideo.includes('pano') ? (
                  <img onClick={() => { setSelectedVideo(null); navigate("/details"); }} src={selectedVideo} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50 cursor-pointer" />
                ) : (
                  <BlazingRifts />
                )}
             </div>
          </div>
          <div className="p-6 text-center">
            <button 
              onClick={() => { setSelectedVideo(null); navigate("/details"); }}
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
