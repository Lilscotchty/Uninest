import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Map, Coffee, BookOpen, Dumbbell, BusFront, MapPin, Navigation } from 'lucide-react';

export const CampusGuide = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const CATEGORIES = [
    { id: 'all', label: 'All', icon: Map },
    { id: 'food', label: 'Food & Cafes', icon: Coffee },
    { id: 'study', label: 'Study Spaces', icon: BookOpen },
    { id: 'fitness', label: 'Gym & Sports', icon: Dumbbell },
    { id: 'transit', label: 'Transit', icon: BusFront },
  ];

  return (
    <div className="flex-1 w-full flex flex-col bg-app-bg min-h-screen">
      <PageHeader title="Campus Guide" />
      
      <div className="max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 pb-20 flex-1 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Points of Interest */}
        <div className="w-full md:w-[320px] lg:w-[400px] shrink-0 h-[50vh] md:h-[calc(100vh-140px)] flex flex-col gap-4">
          
          <div className="bg-card-bg p-5 rounded-[20px] shadow-sm border border-border-subtle shrink-0">
            <h1 className="text-[1.3rem] font-bold text-text-primary tracking-tight mb-4">University Explorer</h1>
            
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[0.85rem] font-semibold whitespace-nowrap transition-all border ${
                    activeFilter === cat.id
                      ? 'bg-[var(--color-button)] text-white border-[var(--color-button)] shadow-sm'
                      : 'bg-app-bg text-text-muted border-border-subtle hover:bg-border-subtle hover:text-text-primary'
                  }`}
                >
                  <cat.icon size={16} className={activeFilter === cat.id ? "text-white" : "text-text-muted"} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-card-bg rounded-[20px] shadow-sm border border-border-subtle overflow-y-auto hide-scrollbar p-1">
            {[
              { name: 'Main Campus Library', cat: 'Study', dist: '5 mins walk', open: true },
              { name: 'Student Union Cafe', cat: 'Food', dist: '2 mins walk', open: true },
              { name: 'West Wing Gym', cat: 'Fitness', dist: '10 mins walk', open: false },
              { name: 'North Gate Bus Stop', cat: 'Transit', dist: '1 min walk', open: true },
              { name: 'Engineering Quad', cat: 'Study', dist: '7 mins walk', open: true }
            ].map((loc, i) => (
              <div key={i} className="p-4 border-b border-border-subtle last:border-b-0 hover:bg-app-bg/50 transition-colors cursor-pointer group flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[0.95rem] text-text-primary group-hover:text-[var(--color-accent)] transition-colors">{loc.name}</h3>
                    {loc.open ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0"></span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[0.8rem] text-text-muted font-medium">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {loc.cat}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{loc.dist}</span>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-app-bg border border-border-subtle flex items-center justify-center text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Navigation size={14} />
                </button>
              </div>
            ))}
          </div>

        </div>

        {/* Mock Map Area */}
        <div className="flex-1 bg-slate-200 rounded-[20px] md:h-[calc(100vh-140px)] h-[40vh] border border-border-subtle overflow-hidden relative shadow-sm">
          {/* Static Map Image Mockup */}
          <img 
            src="https://loremflickr.com/1200/800/map,streets?lock=234" 
            alt="Campus Map" 
            className="w-full h-full object-cover opacity-80"
          />
          
          {/* Overlay UI */}
          <div className="absolute inset-0 bg-blue-900/5 mix-blend-multiply"></div>
          
          <div className="absolute top-4 right-4 bg-card-bg/90 backdrop-blur-md border border-border-subtle rounded-xl p-3 shadow-md flex flex-col gap-2">
            <button className="w-8 h-8 rounded-lg bg-app-bg flex items-center justify-center text-text-primary hover:bg-border-subtle font-bold text-lg">+</button>
            <div className="w-full h-[1px] bg-border-subtle"></div>
            <button className="w-8 h-8 rounded-lg bg-app-bg flex items-center justify-center text-text-primary hover:bg-border-subtle font-bold text-lg">-</button>
          </div>

          <div className="absolute bottom-4 left-4 bg-card-bg/90 backdrop-blur-md border border-border-subtle rounded-xl px-4 py-2.5 shadow-md flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-[0.8rem] font-bold text-text-primary">Your Location</span>
          </div>
        </div>

      </div>
    </div>
  );
};
