import React from 'react';
import { useAppContext } from '../context/AppContext';
import { User, CreditCard, Bell, Shield, HelpCircle, FileText, PenLine, LogOut, ChevronRight } from 'lucide-react';

export const Profile: React.FC = () => {
  const { credits, showToast, setCurrentView } = useAppContext();

  const handleAction = (action: string) => {
    if (action === 'Log Out') {
      setCurrentView('signup');
    } else {
      showToast(`${action} action triggered`);
    }
  };

  return (
    <div className="w-full h-full bg-app-bg flex flex-col font-sans relative overflow-hidden">
      {/* Top Header */}
      <div className="bg-white px-5 pt-12 pb-4 flex items-center border-b border-black/5 relative z-10 w-full shrink-0">
        <h1 className="font-fraunces text-2xl font-bold text-text-primary leading-tight tracking-tight">Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-[100px] flex flex-col gap-5 hide-scrollbar w-full mt-4">
        
        {/* User Identity Card */}
        <div className="bg-white rounded-[20px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-indigo-light/50 flex items-center gap-4 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-16 h-16 rounded-full bg-indigo/10 flex items-center justify-center text-indigo font-fraunces font-bold text-2xl shrink-0 overflow-hidden border-2 border-indigo-light">
            {/* Avatar or Initials */}
            KO
          </div>
          <div className="flex flex-col flex-1 min-w-0 pr-6">
            <h2 className="font-fraunces text-lg font-bold text-text-primary truncate">Kwame Owusu</h2>
            <p className="text-[0.8rem] text-text-muted font-medium truncate mt-0.5">Level 300, University of Ghana</p>
          </div>
          <button 
            onClick={() => handleAction('Edit Profile')}
            className="absolute top-4 right-4 text-text-muted hover:text-indigo transition-colors p-2"
          >
            <PenLine size={16} />
          </button>
        </div>

        {/* Credit Balance Hero Card */}
        <div className="bg-gradient-to-br from-indigo-dark to-indigo rounded-[20px] p-6 shadow-[0_12px_32px_rgba(55,48,163,0.15)] flex flex-col overflow-hidden relative animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[50ms]">
          {/* Decorative shapes */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5 blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-amber-glow/10 blur-xl"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="flex flex-col">
              <span className="text-indigo-light text-xs font-semibold tracking-wider font-sans uppercase mb-1">Current Balance</span>
              <div className="flex items-baseline gap-1">
                <span className="font-fraunces text-4xl font-bold text-white">{credits}</span>
                <span className="text-indigo-light text-sm font-semibold">credits</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => handleAction('Buy Credits')}
            className="mt-5 bg-amber-glow text-white font-bold text-sm py-3 px-5 rounded-xl border-none cursor-pointer shadow-[0_4px_12px_rgba(245,158,11,0.25)] transition-transform active:scale-[0.97] hover:bg-[#f59e0b]/90 self-start"
          >
            Buy Credits
          </button>
        </div>

        {/* Settings & Preferences */}
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[100ms]">
          
          {/* Account Group */}
          <div className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-indigo-light/50 overflow-hidden">
            <div className="px-5 py-3 border-b border-black/5 bg-gray-50/50">
              <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Account</span>
            </div>
            <div className="flex flex-col">
              <button onClick={() => handleAction('Personal Information')} className="flex items-center gap-3 w-full p-4 border-b border-black/5 text-left bg-white transition-colors hover:bg-gray-50 cursor-pointer active:bg-gray-100 group">
                <div className="w-8 h-8 rounded-full bg-indigo-light text-indigo flex items-center justify-center shrink-0">
                  <User size={16} />
                </div>
                <span className="flex-1 text-[0.9rem] font-semibold text-text-primary">Personal Information</span>
                <ChevronRight size={16} className="text-text-muted group-hover:text-indigo transition-colors" />
              </button>
              <button onClick={() => handleAction('Payment Methods')} className="flex items-center gap-3 w-full p-4 text-left bg-white transition-colors hover:bg-gray-50 cursor-pointer active:bg-gray-100 group">
                <div className="w-8 h-8 rounded-full bg-teal-light text-teal flex items-center justify-center shrink-0">
                  <CreditCard size={16} />
                </div>
                <span className="flex-1 text-[0.9rem] font-semibold text-text-primary">Payment Methods</span>
                <ChevronRight size={16} className="text-text-muted group-hover:text-teal transition-colors" />
              </button>
            </div>
          </div>

          {/* Preferences Group */}
          <div className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-indigo-light/50 overflow-hidden">
            <div className="px-5 py-3 border-b border-black/5 bg-gray-50/50">
              <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Preferences</span>
            </div>
            <div className="flex flex-col">
              <button onClick={() => handleAction('Notifications')} className="flex items-center gap-3 w-full p-4 border-b border-black/5 text-left bg-white transition-colors hover:bg-gray-50 cursor-pointer active:bg-gray-100 group">
                <div className="w-8 h-8 rounded-full bg-amber-light text-amber-glow flex items-center justify-center shrink-0">
                  <Bell size={16} />
                </div>
                <span className="flex-1 text-[0.9rem] font-semibold text-text-primary">Notifications</span>
                <ChevronRight size={16} className="text-text-muted group-hover:text-amber-glow transition-colors" />
              </button>
              <button onClick={() => handleAction('Privacy & Security')} className="flex items-center gap-3 w-full p-4 text-left bg-white transition-colors hover:bg-gray-50 cursor-pointer active:bg-gray-100 group">
                <div className="w-8 h-8 rounded-full bg-indigo-light text-indigo flex items-center justify-center shrink-0">
                  <Shield size={16} />
                </div>
                <span className="flex-1 text-[0.9rem] font-semibold text-text-primary">Privacy & Security</span>
                <ChevronRight size={16} className="text-text-muted group-hover:text-indigo transition-colors" />
              </button>
            </div>
          </div>

          {/* Support Group */}
          <div className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-indigo-light/50 overflow-hidden">
            <div className="px-5 py-3 border-b border-black/5 bg-gray-50/50">
              <span className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Support</span>
            </div>
            <div className="flex flex-col">
              <button onClick={() => handleAction('Help Center')} className="flex items-center gap-3 w-full p-4 border-b border-black/5 text-left bg-white transition-colors hover:bg-gray-50 cursor-pointer active:bg-gray-100 group">
                <div className="w-8 h-8 rounded-full bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0">
                  <HelpCircle size={16} />
                </div>
                <span className="flex-1 text-[0.9rem] font-semibold text-text-primary">Help Center</span>
                <ChevronRight size={16} className="text-text-muted group-hover:text-[#d97706] transition-colors" />
              </button>
              <button onClick={() => handleAction('Terms & Policies')} className="flex items-center gap-3 w-full p-4 text-left bg-white transition-colors hover:bg-gray-50 cursor-pointer active:bg-gray-100 group">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <FileText size={16} />
                </div>
                <span className="flex-1 text-[0.9rem] font-semibold text-text-primary">Terms & Policies</span>
                <ChevronRight size={16} className="text-text-muted group-hover:text-slate-500 transition-colors" />
              </button>
            </div>
          </div>

        </div>

        {/* Logout Action */}
        <div className="mt-2 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[150ms]">
          <button 
            onClick={() => handleAction('Log Out')}
            className="inline-flex items-center gap-2 text-coral font-bold text-[0.95rem] py-3 px-6 rounded-full bg-coral-light/30 border border-coral-light/50 active:scale-[0.97] transition-all hover:bg-coral-light"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>

      </div>
    </div>
  );
};
