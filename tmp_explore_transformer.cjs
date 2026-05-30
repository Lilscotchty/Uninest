import fs from 'fs';

const orig = fs.readFileSync('src/pages/Explore.tsx', 'utf8');

let dest = orig;

// Make the outer div a standard flex box responsive
dest = dest.replace(
  /<div className="relative w-full flex-1 min-h-0 overflow-hidden" ref={containerRef}>/g,
  `<div className="relative w-full flex-1 min-h-0 overflow-hidden flex flex-col md:flex-row h-[calc(100vh-64px)]" ref={containerRef}>`
);

// Map Container logic
dest = dest.replace(
  /<div className=\{\`absolute inset-0 z-0 transition-all duration-500 ease-in-out\`\}>/g,
  `<div className="absolute md:relative inset-0 md:inset-auto z-0 md:z-auto transition-all duration-500 ease-in-out md:flex-1 md:h-full">`
);

// Hide Mobile Top Bar on Desktop
dest = dest.replace(
  /<div className="absolute top-0 left-0 w-full z-\[1000\] p-4 sm:p-5 flex flex-col pointer-events-none">/g,
  `<div className="md:hidden absolute top-0 left-0 w-full z-[1000] p-4 sm:p-5 flex flex-col pointer-events-none">`
);

// Hide Floating Actions on Desktop
dest = dest.replace(
  /<div className="absolute right-4 z-\[1050\] flex flex-col gap-3 pointer-events-none"/g,
  `<div className="md:hidden absolute right-4 z-[1050] flex flex-col gap-3 pointer-events-none"`
);

// Hide Peek Card on Desktop
dest = dest.replace(
  /absolute left-4 right-4 z-\[1050\] bg-card-bg/g,
  `md:hidden absolute left-4 right-4 z-[1050] bg-card-bg`
);

// We need to inject the Desktop Sidebar panel just before Map Container.
const desktopSidebar = `
      {/* DESKTOP/TABLET SIDEBAR LIST */}
      <div className="hidden md:flex w-[40%] lg:w-[35%] h-full flex-col bg-card-bg border-r border-border-subtle z-10 shrink-0">
        <div className="p-4 border-b border-border-subtle shrink-0">
           <div className="flex items-center gap-3 mb-4">
              <button 
                onClick={() => navigate("/student/dashboard")}
                className="w-10 h-10 rounded-full bg-border-subtle flex items-center justify-center text-text-primary hover:bg-border-subtle/80 cursor-pointer"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
              <div className="bg-app-bg rounded-xl px-4 flex items-center gap-2 border border-border-subtle h-11 flex-1">
                <Search size={18} className="text-gray-500 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search hostels, areas..." 
                  className="bg-transparent border-none outline-none w-full text-[0.9rem] font-medium text-text-primary placeholder:text-text-muted"
                  value={localSearch}
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                    setExploreSearchQuery(e.target.value);
                  }}
                />
              </div>
           </div>
           
           <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
             {['All', 'Private', 'Shared', 'Near Campus', 'Budget', 'Wi-Fi'].map((filter, i) => (
               <button 
                 key={filter}
                 className={\`shrink-0 px-4 py-1.5 rounded-full border-[1.5px] text-[0.75rem] font-bold shadow-sm transition-all
                   \${i === 0 
                     ? 'bg-indigo text-white border-indigo shadow-[0_4px_14px_rgba(55,48,163,0.35)]' 
                     : 'bg-card-bg text-text-muted border-border-subtle hover:bg-app-bg'}\`}
               >
                 {filter}
               </button>
             ))}
           </div>
           <div className="mt-2 text-sm font-semibold text-text-primary">
             {filteredHostels.length} hostels nearby
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {filteredHostels.map(h => (
            <div key={h.id} className="w-full" onMouseEnter={() => setPeekHostelId(h.id)} onMouseLeave={() => setPeekHostelId(null)}>
               <PropertyCard 
                 hostel={h} 
                 isSaved={savedHostels.includes(h.id)} 
                 onToggleSave={toggleSave} 
                 onClick={() => { setSelectedHostelId(h.id); navigate("/details"); }} 
               />
            </div>
          ))}
        </div>
      </div>
`;
dest = dest.replace(
  /\{\/\* Map Container \*\/\}/g,
  desktopSidebar + '\n      {/* Map Container */}'
);

// Make motion.div ONLY visible on Mobile
dest = dest.replace(
  /className="absolute bottom-0 left-0 w-full/g,
  `className="md:hidden absolute bottom-0 left-0 w-full`
);

fs.writeFileSync('src/pages/Explore.tsx', dest, 'utf8');
