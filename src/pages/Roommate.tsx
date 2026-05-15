import React, { useState } from 'react';
import { ChevronLeft, UserPlus, Heart, MessageCircle, Info } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Roommate: React.FC = () => {
  const { setCurrentView, showToast } = useAppContext();

  const [activeTab, setActiveTab] = useState<'discover' | 'matches'>('discover');

  return (
    <div className="w-full h-full bg-app-bg flex flex-col font-sans relative">
      <div className="bg-card-bg pt-[50px] px-4 shrink-0 flex flex-col border-b border-border-subtle">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => setCurrentView('home')}
            className="w-10 h-10 flex items-center justify-center text-text-primary rounded-full hover:bg-app-bg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="flex-1 text-center pr-10 text-[17px] font-semibold text-text-primary">
            Roommate Matcher
          </h1>
        </div>

        <div className="flex gap-4">
          <button 
            className={`pb-3 text-[0.9rem] font-bold transition-colors ${activeTab === 'discover' ? 'text-indigo border-b-2 border-indigo' : 'text-text-muted hover:text-text-primary'}`}
            onClick={() => setActiveTab('discover')}
          >
            Discover
          </button>
          <button 
             className={`pb-3 text-[0.9rem] font-bold transition-colors ${activeTab === 'matches' ? 'text-indigo border-b-2 border-indigo' : 'text-text-muted hover:text-text-primary'}`}
             onClick={() => setActiveTab('matches')}
          >
            My Matches
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {activeTab === 'discover' ? (
          <div>
            <div className="bg-gradient-to-br from-[#1e1b4b] to-[#312e81] rounded-[24px] p-6 text-white mb-6 shadow-float relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5 blur-xl"></div>
               <div className="w-12 h-12 bg-white/10 rounded-[14px] flex items-center justify-center mb-4 backdrop-blur-md">
                 <UserPlus size={24} className="text-amber-glow" />
               </div>
               <h2 className="font-fraunces text-[1.4rem] font-bold mb-2">Find your perfect roommate</h2>
               <p className="text-[0.85rem] text-white/70 mb-4">Set up your profile, answer a few questions about your lifestyle, and match with compatible students.</p>
               <button 
                 onClick={() => showToast('Profile editor coming soon')}
                 className="bg-amber-glow text-white font-bold py-2.5 px-5 rounded-xl text-[0.85rem] shadow-sm active:scale-95"
               >
                 Complete Profile
               </button>
            </div>

            <h3 className="font-bold text-text-primary text-[1.1rem] mb-4">Suggested Matches</h3>
            
            <div className="flex flex-col gap-4">
               {/* Match Card */}
               <div className="bg-card-bg rounded-[20px] p-4 border border-border-subtle shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                     <div className="w-12 h-12 rounded-full bg-app-bg border border-border-subtle flex items-center justify-center font-fraunces font-bold text-indigo text-[1.2rem]">
                       JD
                     </div>
                     <div className="flex-1">
                        <strong className="block text-[1rem] font-bold text-text-primary">John Doe</strong>
                        <span className="text-[0.75rem] text-text-muted">Lvl 200 • Computer Science</span>
                     </div>
                     <div className="bg-green-100 text-green-700 text-[0.75rem] font-bold px-2 py-1 rounded-md">
                        92% Match
                     </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-indigo-light/20 text-text-muted text-[0.7rem] font-bold px-2 py-1 rounded-[6px]">Early Bird</span>
                    <span className="bg-indigo-light/20 text-text-muted text-[0.7rem] font-bold px-2 py-1 rounded-[6px]">Quiet Study</span>
                    <span className="bg-indigo-light/20 text-text-muted text-[0.7rem] font-bold px-2 py-1 rounded-[6px]">Non-Smoker</span>
                  </div>

                  <div className="flex gap-2">
                    <button 
                       onClick={() => showToast('Liked John!')}
                       className="flex-1 bg-coral-light/20 text-coral font-bold py-2.5 rounded-xl border border-coral-light/50 flex items-center justify-center gap-2 active:scale-95"
                    >
                       <Heart size={16} /> Like
                    </button>
                    <button 
                       onClick={() => showToast('Direct message requested')}
                       className="flex-1 bg-app-bg text-text-primary font-bold py-2.5 rounded-xl border border-border-subtle flex items-center justify-center gap-2 active:scale-95 hover:bg-slate-200"
                    >
                       <MessageCircle size={16} /> Message
                    </button>
                  </div>
               </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center pb-20">
             <div className="w-16 h-16 bg-app-bg rounded-full flex items-center justify-center text-text-muted mb-4 border border-border-subtle">
                <Info size={24} />
             </div>
             <strong className="block text-[1.1rem] font-bold text-text-primary mb-2">No Matches Yet</strong>
             <p className="text-[0.9rem] text-text-muted max-w-[250px]">Complete your profile and start liking potential roommates to see your matches here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
