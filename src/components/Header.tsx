import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Header: React.FC = () => {
  const { showToast } = useAppContext();

  return (
    <div className="relative overflow-hidden pt-12 px-5 pb-20"
         style={{
           background: 'linear-gradient(160deg, var(--color-indigo-dark) 0%, var(--color-indigo) 60%, #4f46e5 100%)',
           borderRadius: '0 0 100% 100% / 0 0 30px 30px'
         }}>
      {/* Decorative blobs */}
      <div className="absolute -top-[15px] -right-[15px] w-[220px] h-[220px] rounded-full bg-white/5" />
      <div className="absolute -bottom-[30px] -left-[30px] w-[140px] h-[140px] rounded-full bg-amber-500/10 flex items-center justify-center p-[20px]" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-2 rounded-full bg-amber-glow" />
            <span className="text-white/60 text-[0.78rem] font-light tracking-[3px] uppercase">
              Student Dwell
            </span>
          </div>
          <div className="relative z-10 w-full">
            <h1 className="font-fraunces text-white text-[1.90rem] sm:text-[2.1rem] font-bold leading-[1.15] tracking-[-0.5px]">
              <span className="whitespace-nowrap">Find your</span> <br /><em className="italic text-amber-glow">perfect</em> stay.
            </h1>
          </div>
        </div>
        
        <div className="flex gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white cursor-pointer relative hover:bg-card-bg/20 transition-colors"
               onClick={() => showToast('No new notifications')}
          >
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-glow rounded-full border-2 border-indigo-dark text-[8px] flex items-center justify-center font-bold">
              3
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex gap-4 mt-6">
        <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-[14px] p-2.5 text-center">
          <strong className="block text-white text-[1.1rem] font-semibold font-fraunces">240+</strong>
          <span className="text-white/60 text-[0.65rem] uppercase tracking-[0.8px]">Listings</span>
        </div>
        <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-[14px] p-2.5 text-center">
          <strong className="block text-white text-[1.1rem] font-semibold font-fraunces">3</strong>
          <span className="text-white/60 text-[0.65rem] uppercase tracking-[0.8px]">Cities</span>
        </div>
      </div>
    </div>
  );
};
