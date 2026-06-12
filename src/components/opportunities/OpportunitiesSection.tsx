import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase } from 'lucide-react';

export const OpportunitiesSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-card-bg rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border-transparent border overflow-hidden mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 cursor-pointer min-h-[4rem]"
      onClick={() => navigate('/opportunities')}
    >
      <div className="px-5 py-4 bg-app-bg/50 flex items-center justify-between hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Briefcase size={16} />
          </div>
          <div>
            <h3 className="text-[1rem] font-bold text-text-primary leading-tight">Opportunities Hub</h3>
            <p className="text-[0.75rem] text-text-muted mt-0.5">Discover attachment & job opportunities in your area.</p>
          </div>
        </div>
        <button 
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-accent)] text-white text-[0.8rem] font-bold rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Find <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
